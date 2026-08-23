import { z } from "zod";

export const chatMessageSchema = z.object({
	id: z.uuid(),
	conversationId: z.uuid(),
	role: z.string(),
	parts: z.unknown(),
	createdAt: z.date(),
});

export const chatGenerationStatusSchema = z.enum(["idle", "running", "error"]);

export const chatConversationSchema = z.object({
	id: z.uuid(),
	userId: z.string(),
	title: z.string(),
	generationStatus: chatGenerationStatusSchema,
	generationError: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const chatConversationWithMessagesSchema = chatConversationSchema.extend(
	{
		messages: z.array(chatMessageSchema),
	},
);

export const chatIdSchema = z.object({ id: z.uuid() });

export const createChatConversationSchema = z.object({
	title: z.string().min(1).optional(),
});

export const updateChatTitleSchema = z.object({
	id: z.uuid(),
	title: z.string().min(1).max(200),
});

export const replaceChatMessagesSchema = z.object({
	id: z.uuid(),
	messages: z.array(
		z.object({
			id: z.string(),
			role: z.string(),
			parts: z.unknown(),
		}),
	),
	title: z.string().min(1).max(200).optional(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatConversation = z.infer<typeof chatConversationSchema>;
export type ChatConversationWithMessages = z.infer<
	typeof chatConversationWithMessagesSchema
>;
