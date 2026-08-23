import { createDeepSeek } from "@ai-sdk/deepseek";
import { createMCPClient } from "@ai-sdk/mcp";
import {
	convertToModelMessages,
	readUIMessageStream,
	stepCountIs,
	streamText,
	type UIMessage,
} from "ai";
import { titleFromMessages } from "@/features/chat/lib/title-from-messages";
import * as chatService from "@/features/chat/server/chat.service";
import config from "@/lib/config";

export const CHAT_SYSTEM_PROMPT = `Eres un asistente jurídico sobre datos del Consejo de Estado (Colombia).
Usa las tools MCP (search_perfiles, get_perfil, search_providencias, get_providencia y salvamentos) cuando haga falta.
Responde en español. Saluda de forma breve; no enumeres capacidades ni uses emojis.

Consultas de juez o ponente (nombre parcial, «el juez Carlos», etc.):
- Identifica al ponente. Si hay varios candidatos, lístalos y pregunta, o usa el más cercano.
- Busca sus providencias con search_providencias. No filtres por año a ciegas: si el dataset solo tiene un anio_fallo, usa esos resultados.
- Responde por defecto con una tabla Markdown y SOLO estas columnas:
  1. Tema del caso: campo temas. Si está vacío, infiere de pasivo, actor o resolutiva y márcalo como inferido.
  2. Tipo: tipo_doc; indica tutela si es_tutela.
  3. Fecha: fecha.
  4. Decisión: verbo; si está vacío, infiere de la resolutiva o usa «—».
  5. Sentido: sentido; si está vacío, «—».
- Si no hay tema (ni en temas ni inferible), omite esa fila. No escribas «No registrado».
- Si hay tema pero decisión o sentido no están definidos, incluye la fila con «—» en esas columnas.
- Si tras filtrar no queda ninguna fila, di que no hay providencias con tema registrado. No añadas resumen.
- Después de la tabla, muestra un resumen breve y legible calculado SOLO sobre las filas mostradas (no JSON ni get_perfil):
  - Total de providencias.
  - Por tipo: recuento y porcentaje (sentencia, auto; tutela si aplica).
  - Por decisión (verbo): recuento y porcentaje; las «—» como «sin decisión», aparte de los verbos definidos.
  - Por sentido: porcentaje favorable, desfavorable y sin sentido. Usa frases claras (p. ej. «10 de 12 con sentido desfavorable (83 %)»).
  - Rango de fechas: mínima y máxima de fecha.
- No incluyas radicado, duración ni JSON crudo salvo que el usuario lo pida.
- Si resolutiva está truncada y necesitas tema o decisión, llama a get_providencia.

Otras consultas (radicado concreto, texto completo, salvamentos, métricas): responde con el formato que corresponda; no fuerces esa tabla.`;

const PERSIST_THROTTLE_MS = 400;

const toUiMessages = (
	messages: Array<{ id: string; role: string; parts: unknown }>,
): UIMessage[] =>
	messages.map((message) => ({
		id: message.id,
		role: message.role as UIMessage["role"],
		parts: message.parts as UIMessage["parts"],
	}));

const persistAssistant = async (
	userId: string,
	conversationId: string,
	assistant: UIMessage,
	title?: string,
) => {
	await chatService.upsertMessages(
		userId,
		conversationId,
		[
			{
				id: assistant.id,
				role: assistant.role,
				parts: assistant.parts,
			},
		],
		title,
	);
};

const createThrottledPersister = (
	userId: string,
	conversationId: string,
	title?: string,
) => {
	let latest: UIMessage | null = null;
	let timer: ReturnType<typeof setTimeout> | null = null;
	let chain = Promise.resolve();

	const flush = () => {
		const snapshot = latest;
		if (!snapshot) {
			return;
		}
		chain = chain
			.then(() => persistAssistant(userId, conversationId, snapshot, title))
			.catch((error) => {
				console.error("Failed to persist chat snapshot", error);
			});
	};

	return {
		push(message: UIMessage) {
			latest = message;
			if (timer) {
				return;
			}
			timer = setTimeout(() => {
				timer = null;
				flush();
			}, PERSIST_THROTTLE_MS);
		},
		async finish() {
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
			flush();
			await chain;
		},
	};
};

export const runChatGeneration = async ({
	userId,
	conversationId,
	assistantMessageId,
}: {
	userId: string;
	conversationId: string;
	assistantMessageId: string;
}) => {
	if (!config.deepseekApiKey) {
		throw new Error("DEEPSEEK_API_KEY no configurada");
	}

	const conversation = await chatService.get(userId, conversationId);
	const history = toUiMessages(
		conversation.messages.filter(
			(message) => message.id !== assistantMessageId,
		),
	);
	const title = titleFromMessages(history);

	const mcpClient = await createMCPClient({
		transport: {
			type: "http",
			url: config.mcpServerUrl,
		},
		protocolVersionDiscovery: false,
	});

	const persister = createThrottledPersister(userId, conversationId, title);
	let latestAssistant: UIMessage = {
		id: assistantMessageId,
		role: "assistant",
		parts: [],
	};

	try {
		const deepseek = createDeepSeek({ apiKey: config.deepseekApiKey });
		const tools = await mcpClient.tools();
		const result = streamText({
			model: deepseek(config.deepseekModel),
			system: CHAT_SYSTEM_PROMPT,
			messages: await convertToModelMessages(history),
			tools,
			stopWhen: stepCountIs(8),
			providerOptions: {
				deepseek: {
					thinking: { type: "enabled" },
				},
			},
		});

		for await (const uiMessage of readUIMessageStream({
			message: latestAssistant,
			stream: result.toUIMessageStream({
				sendReasoning: true,
				originalMessages: history,
				generateMessageId: () => assistantMessageId,
			}),
		})) {
			latestAssistant = { ...uiMessage, id: assistantMessageId };
			persister.push(latestAssistant);
		}

		await persister.finish();
		await chatService.setGenerationStatus(userId, conversationId, "idle");
	} catch (error) {
		await persister.finish().catch(() => undefined);
		const message =
			error instanceof Error ? error.message : "Error al generar respuesta";
		await chatService
			.setGenerationStatus(userId, conversationId, "error", message)
			.catch((statusError) => {
				console.error("Failed to set generation error status", statusError);
			});
		throw error;
	} finally {
		await mcpClient.close().catch(() => undefined);
	}
};
