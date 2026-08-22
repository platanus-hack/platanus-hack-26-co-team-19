// user.router.ts

import { TRPCError } from "@trpc/server";
import {
	baseProcedure,
	createTRPCRouter,
	protectedProcedure,
} from "@/trpc/init";
import {
	createUserSchema,
	deleteUserSchema,
	updateUserSchema,
} from "../schemas/user.schema";
import * as userService from "./user.service";

export const userRouter = createTRPCRouter({
	list: baseProcedure.query(async () => {
		try {
			return await userService.list();
		} catch (_err) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to list users",
			});
		}
	}),

	get: baseProcedure.input(deleteUserSchema).query(async ({ input }) => {
		try {
			return await userService.get(input.id);
		} catch (err) {
			if (err instanceof Error && err.message.includes("not found")) {
				throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
			}
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to get user",
			});
		}
	}),

	create: protectedProcedure
		.input(createUserSchema)
		.mutation(async ({ input }) => {
			try {
				return await userService.create(input);
			} catch (err) {
				if (err instanceof Error && err.message.includes("already exists")) {
					throw new TRPCError({ code: "CONFLICT", message: err.message });
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create user",
				});
			}
		}),

	update: protectedProcedure
		.input(updateUserSchema)
		.mutation(async ({ input }) => {
			try {
				return await userService.update(input.id, input);
			} catch (err) {
				if (err instanceof Error && err.message.includes("not found")) {
					throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update user",
				});
			}
		}),

	delete: protectedProcedure
		.input(deleteUserSchema)
		.mutation(async ({ input }) => {
			try {
				await userService.remove(input.id);
				return { success: true };
			} catch (err) {
				if (err instanceof Error && err.message.includes("not found")) {
					throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to delete user",
				});
			}
		}),
});
