// useCreateUser.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import type { CreateUserInput } from "../schemas/user.schema";
import { createUserSchema } from "../schemas/user.schema";

type UseCreateUserProps = {
	onSuccess?: () => void;
	onError?: (error: unknown) => void;
};

const useCreateUser = ({ onSuccess, onError }: UseCreateUserProps = {}) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		...trpc.user.create.mutationOptions(),
		onSuccess: async () => {
			await queryClient.invalidateQueries(trpc.user.list.queryOptions());
			toast.success(`User created successfully`);
			onSuccess?.();
		},
		onError: (error) => {
			toast.error(`Failed to create user`);
			onError?.(error);
		},
	});

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			emailVerified: false,
			image: null,
		} as CreateUserInput,
		validators: {
			onChange: createUserSchema,
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

export default useCreateUser;
