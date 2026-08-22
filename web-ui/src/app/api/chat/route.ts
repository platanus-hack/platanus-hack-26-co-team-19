import { createDeepSeek } from "@ai-sdk/deepseek";
import { createMCPClient } from "@ai-sdk/mcp";
import {
	convertToModelMessages,
	stepCountIs,
	streamText,
	type UIMessage,
} from "ai";
import { headers } from "next/headers";
import { titleFromMessages } from "@/features/chat/lib/title-from-messages";
import * as chatService from "@/features/chat/server/chat.service";
import { auth } from "@/lib/auth";
import config from "@/lib/config";

export const maxDuration = 120;

const SYSTEM_PROMPT = `Eres un asistente jurídico sobre datos del Consejo de Estado (Colombia).
Debes usar las tools MCP disponibles para buscar providencias, perfiles de ponentes y votos.
Si search_providencias trunca la resolutiva, llama a get_providencia para devolver el contenido completo.
Incluye en tu respuesta el contenido encontrado (radicados, perfiles, JSON de tools) sin omitir campos relevantes.
Responde en español.`;

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

		return result.toUIMessageStreamResponse({
			sendReasoning: true,
			originalMessages: messages,
			onFinish: async ({ messages: nextMessages }) => {
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
				} finally {
					await mcpClient.close();
				}
			},
		});
	} catch (error) {
		await mcpClient.close();
		const message =
			error instanceof Error ? error.message : "Error al generar respuesta";
		return new Response(message, { status: 500 });
	}
}
