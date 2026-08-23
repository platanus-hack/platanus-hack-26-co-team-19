import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import {
	chatIdSchema,
	createChatConversationSchema,
	updateChatTitleSchema,
} from "../schemas/chat.schema";
import * as chatService from "./chat.service";

export const chatRouter = createTRPCRouter({
	list: protectedProcedure.query(async ({ ctx }) => {
		try {
			return await chatService.list(ctx.userId);
		} catch {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to list conversations",
			});
		}
	}),

	get: protectedProcedure.input(chatIdSchema).query(async ({ ctx, input }) => {
		try {
			return await chatService.get(ctx.userId, input.id);
		} catch (err) {
			if (err instanceof Error && err.message.includes("not found")) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Conversation not found",
				});
			}
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to get conversation",
			});
		}
	}),

	create: protectedProcedure
		.input(createChatConversationSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				return await chatService.create(ctx.userId, input.title);
			} catch {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create conversation",
				});
			}
		}),

	updateTitle: protectedProcedure
		.input(updateChatTitleSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				return await chatService.updateTitle(ctx.userId, input.id, input.title);
			} catch (err) {
				if (err instanceof Error && err.message.includes("not found")) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Conversation not found",
					});
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update title",
				});
			}
		}),

	delete: protectedProcedure
		.input(chatIdSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				await chatService.remove(ctx.userId, input.id);
				return { success: true };
			} catch (err) {
				if (err instanceof Error && err.message.includes("not found")) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Conversation not found",
					});
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to delete conversation",
				});
			}
		}),
});
