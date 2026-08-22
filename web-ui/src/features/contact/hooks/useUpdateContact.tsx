// useUpdateContact.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import type { Contact, UpdateContactInput } from "../schemas/contact.schema";
import { updateContactSchema } from "../schemas/contact.schema";

type UseUpdateContactProps = {
	contact: Contact;
	onSuccess?: () => void;
	onError?: (error: unknown) => void;
};

const useUpdateContact = ({
	contact,
	onSuccess,
	onError,
}: UseUpdateContactProps) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		...trpc.contact.update.mutationOptions(),
		onSuccess: async (data) => {
			await queryClient.invalidateQueries(trpc.contact.list.queryOptions());
			await queryClient.invalidateQueries(
				trpc.contact.get.queryOptions({ id: data.id }),
			);
			toast.success("Contact updated successfully");
			onSuccess?.();
		},
		onError: (error) => {
			toast.error("Failed to update contact");
			onError?.(error);
		},
	});

	const form = useForm({
		defaultValues: {
			id: contact.id,
			name: contact.name,
			email: contact.email,
			subject: contact.subject,
			message: contact.message,
			status: contact.status,
		} as UpdateContactInput,
		validators: {
			onChange: updateContactSchema,
		},
		onSubmit: async ({ value }) => {
			await mutation.mutateAsync(value);
		},
	});

	return {
		form,
		...mutation,
	};
};

export default useUpdateContact;
