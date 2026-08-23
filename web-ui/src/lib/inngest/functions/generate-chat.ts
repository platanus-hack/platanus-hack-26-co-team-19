import { runChatGeneration } from "@/features/chat/server/generate-chat";
import { inngest } from "@/lib/inngest/client";

export const generateChat = inngest.createFunction(
	{
		id: "generate-chat",
		retries: 0,
		concurrency: {
			limit: 1,
			key: "event.data.conversationId",
		},
		triggers: { event: "chat/generate.requested" },
	},
	async ({ event }) => {
		const { conversationId, userId, assistantMessageId } = event.data as {
			conversationId: string;
			userId: string;
			assistantMessageId: string;
		};
		await runChatGeneration({
			userId,
			conversationId,
			assistantMessageId,
		});
		return { ok: true, conversationId };
	},
);
