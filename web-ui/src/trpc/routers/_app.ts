import { z } from "zod";
import { authRouter } from "@/features/auth/server/auth.router";
import { contactRouter } from "@/features/contact/server/contact.router";
import { userRouter } from "@/features/user/server/user.router";
import { baseProcedure, createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
	hello: baseProcedure
		.input(
			z.object({
				text: z.string(),
			}),
		)
		.query((opts) => {
			return {
				greeting: `hello ${opts.input.text}`,
			};
		}),
	auth: authRouter,
	contact: contactRouter,
	user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
