import { createDeepSeek } from "@ai-sdk/deepseek";
import { createMCPClient } from "@ai-sdk/mcp";
import {
	convertToModelMessages,
	stepCountIs,
	streamText,
	type UIMessage,
} from "ai";
import { headers } from "next/headers";
import { after } from "next/server";
import { titleFromMessages } from "@/features/chat/lib/title-from-messages";
import * as chatService from "@/features/chat/server/chat.service";
import { auth } from "@/lib/auth";
import config from "@/lib/config";

export const maxDuration = 120;

const SYSTEM_PROMPT = `Eres un asistente jurídico sobre datos del Consejo de Estado (Colombia).
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

export async function POST(request: Request) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session) {
		return new Response("Unauthorized", { status: 401 });
	}
	if (!config.deepseekApiKey) {
		return new Response("DEEPSEEK_API_KEY no configurada", { status: 500 });
	}

	const body = (await request.json()) as {
		messages?: UIMessage[];
		conversationId?: string;
		id?: string;
	};
	const messages = body.messages ?? [];
	const conversationId = body.conversationId ?? body.id;
	if (!conversationId) {
		return new Response("conversationId requerido", { status: 400 });
	}

	const ownerId = session.user.id;
	await chatService.get(ownerId, conversationId);

	const mcpClient = await createMCPClient({
		transport: {
			type: "http",
			url: config.mcpServerUrl,
		},
		protocolVersionDiscovery: false,
	});

	try {
		const deepseek = createDeepSeek({ apiKey: config.deepseekApiKey });
		const tools = await mcpClient.tools();
		const result = streamText({
			model: deepseek(config.deepseekModel),
			system: SYSTEM_PROMPT,
			messages: await convertToModelMessages(messages),
			tools,
			stopWhen: stepCountIs(8),
			providerOptions: {
				deepseek: {
					thinking: { type: "enabled" },
				},
			},
		});

		result.consumeStream();

		return result.toUIMessageStreamResponse({
			sendReasoning: true,
			originalMessages: messages,
			onFinish: ({ messages: nextMessages }) => {
				after(async () => {
					try {
						const title = titleFromMessages(nextMessages);
						await chatService.replaceMessages(
							ownerId,
							conversationId,
							nextMessages.map((message) => ({
								id: message.id,
								role: message.role,
								parts: message.parts,
							})),
							title,
						);
					} catch (persistError) {
						console.error("Failed to persist chat messages", persistError);
					} finally {
						await mcpClient.close().catch(() => undefined);
					}
				});
			},
		});
	} catch (error) {
		await mcpClient.close().catch(() => undefined);
		const message =
			error instanceof Error ? error.message : "Error al generar respuesta";
		return new Response(message, { status: 500 });
	}
}
