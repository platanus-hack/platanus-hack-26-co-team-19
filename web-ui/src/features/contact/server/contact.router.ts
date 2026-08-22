// contact.router.ts

import { TRPCError } from "@trpc/server";
import {
	baseProcedure,
	createTRPCRouter,
	protectedProcedure,
} from "@/trpc/init";
import {
	createContactSchema,
	deleteContactSchema,
	updateContactSchema,
} from "../schemas/contact.schema";
import * as contactService from "./contact.service";

export const contactRouter = createTRPCRouter({
	list: protectedProcedure.query(async () => {
		try {
			return await contactService.list();
		} catch (_err) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to list contacts",
			});
		}
	}),

	get: protectedProcedure
		.input(deleteContactSchema)
		.query(async ({ input }) => {
			try {
				return await contactService.get(input.id);
			} catch (err) {
				if (err instanceof Error && err.message.includes("not found")) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Contact not found",
					});
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to get contact",
				});
			}
		}),

	create: baseProcedure
		.input(createContactSchema)
		.mutation(async ({ input }) => {
			try {
				return await contactService.create(input);
			} catch (err) {
				if (err instanceof Error && err.message.includes("already exists")) {
					throw new TRPCError({ code: "CONFLICT", message: err.message });
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create contact",
				});
			}
		}),

	update: protectedProcedure
		.input(updateContactSchema)
		.mutation(async ({ input }) => {
			try {
				return await contactService.update(input.id, input);
			} catch (err) {
				if (err instanceof Error && err.message.includes("not found")) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Contact not found",
					});
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update contact",
				});
			}
		}),

	delete: protectedProcedure
		.input(deleteContactSchema)
		.mutation(async ({ input }) => {
			try {
				await contactService.remove(input.id);
				return { success: true };
			} catch (err) {
				if (err instanceof Error && err.message.includes("not found")) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Contact not found",
					});
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to delete contact",
				});
			}
		}),
});
