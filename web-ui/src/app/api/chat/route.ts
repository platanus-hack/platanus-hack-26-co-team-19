import type { UIMessage } from "ai";
import { headers } from "next/headers";
import { titleFromMessages } from "@/features/chat/lib/title-from-messages";
import * as chatService from "@/features/chat/server/chat.service";
import { auth } from "@/lib/auth";
import { inngest } from "@/lib/inngest/client";

export const maxDuration = 60;

export async function POST(request: Request) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session) {
		return new Response("Unauthorized", { status: 401 });
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
	const conversation = await chatService.get(ownerId, conversationId);
	if (conversation.generationStatus === "running") {
		return Response.json({ alreadyRunning: true }, { status: 409 });
	}

	const persistMessages = async (nextMessages: UIMessage[], title?: string) => {
		await chatService.upsertMessages(
			ownerId,
			conversationId,
			nextMessages.map((message) => ({
				id: message.id,
				role: message.role,
				parts: message.parts,
			})),
			title,
		);
	};

	const assistantMessageId = crypto.randomUUID();
	const assistantPlaceholder: UIMessage = {
		id: assistantMessageId,
		role: "assistant",
		parts: [],
	};

	try {
		await persistMessages(
			[...messages, assistantPlaceholder],
			titleFromMessages(messages),
		);
		await chatService.setGenerationStatus(ownerId, conversationId, "running");
	} catch (persistError) {
		console.error("Failed to persist incoming chat messages", persistError);
		return new Response("No se pudieron guardar los mensajes", { status: 500 });
	}

	try {
		await inngest.send({
			name: "chat/generate.requested",
			data: {
				conversationId,
				userId: ownerId,
				assistantMessageId,
			},
		});
	} catch (sendError) {
		console.error("Failed to enqueue chat generation", sendError);
		await chatService
			.setGenerationStatus(
				ownerId,
				conversationId,
				"error",
				"No se pudo encolar la generación",
			)
			.catch(() => undefined);
		return new Response("No se pudo iniciar la generación", { status: 500 });
	}

	return Response.json({ ok: true, assistantMessageId }, { status: 202 });
}
