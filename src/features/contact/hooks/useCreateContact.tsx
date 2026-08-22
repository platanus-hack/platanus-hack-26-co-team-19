// useCreateContact.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import type { CreateContactInput } from "../schemas/contact.schema";
import { createContactSchema } from "../schemas/contact.schema";

type UseCreateContactProps = {
	onSuccess?: () => void;
	onError?: (error: unknown) => void;
};

const useCreateContact = ({
	onSuccess,
	onError,
}: UseCreateContactProps = {}) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		...trpc.contact.create.mutationOptions(),
		onSuccess: async () => {
			await queryClient.invalidateQueries(trpc.contact.list.queryOptions());
			toast.success(`Contact created successfully`);
			onSuccess?.();
		},
		onError: (error) => {
			toast.error(`Failed to create contact`);
			onError?.(error);
		},
	});

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			subject: "",
			message: "",
			status: "NEW",
		} as CreateContactInput,
		validators: {
			onChange: createContactSchema,
		},
		onSubmit: async ({ value }) => {
			await mutation.mutateAsync(value);
			form.reset();
		},
	});

	return {
		form,
		...mutation,
	};
};

export default useCreateContact;
