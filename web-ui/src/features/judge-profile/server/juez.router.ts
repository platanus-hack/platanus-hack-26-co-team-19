import { TRPCError } from "@trpc/server";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { presignProvidenciaPdfSchema } from "../schemas/judge-profile.schema";
import * as juezService from "./juez.service";

export const juezRouter = createTRPCRouter({
	presignPdf: baseProcedure
		.input(presignProvidenciaPdfSchema)
		.query(async ({ input }) => {
			try {
				return await juezService.presignPdf(input);
			} catch (err) {
				if (err instanceof Error && err.message.includes("not found")) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "PDF no encontrado",
					});
				}
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "No se pudo generar el enlace del PDF",
				});
			}
		}),
});
