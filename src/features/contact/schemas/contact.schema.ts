import { z } from "zod";

export const contactStatusSchema = z.enum(["NEW", "READ", "ARCHIVED"]);
export type ContactStatusType = z.infer<typeof contactStatusSchema>;

export const contactSchema = z.object({
	id: z.uuid(),
	name: z.string().min(1),
	email: z.email(),
	subject: z.string().nullable().optional(),
	message: z.string().min(1),
	status: contactStatusSchema,
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const createContactSchema = contactSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});
export const updateContactSchema = contactSchema
	.partial()
	.required({ id: true });
export const deleteContactSchema = z.object({ id: z.uuid() });

export type Contact = z.infer<typeof contactSchema>;
export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
export type DeleteContactInput = z.infer<typeof deleteContactSchema>;
