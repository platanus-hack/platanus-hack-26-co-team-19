import * as chatService from "@/features/chat/server/chat.service";
import { runChatGeneration } from "@/features/chat/server/generate-chat";
import { inngest } from "@/lib/inngest/client";

type GenerateChatEventData = {
	conversationId: string;
	userId: string;
	assistantMessageId: string;
};

export const generateChat = inngest.createFunction(
	{
		id: "generate-chat",
		retries: 0,
		concurrency: {
			limit: 1,
			key: "event.data.conversationId",
		},
		triggers: { event: "chat/generate.requested" },
		onFailure: async ({ event }) => {
			const original = (
				event.data as { event?: { data?: GenerateChatEventData } }
			).event?.data;
			if (!original?.userId || !original?.conversationId) {
				return;
			}
			const errorMessage =
				typeof (event.data as { error?: { message?: string } }).error
					?.message === "string"
					? (event.data as { error: { message: string } }).error.message
					: "La generación falló";
			await chatService
				.setGenerationStatus(
					original.userId,
					original.conversationId,
					"error",
					errorMessage,
				)
				.catch((statusError) => {
					console.error("Failed to set generation error status", statusError);
				});
		},
	},
	async ({ event, step }) => {
		const { conversationId, userId, assistantMessageId } =
			event.data as GenerateChatEventData;
		await step.run("run-chat-generation", async () => {
			await runChatGeneration({
				userId,
				conversationId,
				assistantMessageId,
			});
			return { ok: true, conversationId };
		});
		return { ok: true, conversationId };
	},
);
