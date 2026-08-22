import { z } from "zod";

export const userSchema = z.object({
	id: z.uuid(),
	name: z.string().min(1),
	email: z.email(),
	emailVerified: z.boolean(),
	image: z.string().nullable().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const createUserSchema = userSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});
export const updateUserSchema = userSchema.partial().required({ id: true });
export const deleteUserSchema = z.object({ id: z.uuid() });

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
