// useUpdateUser.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import type { UpdateUserInput, User } from "../schemas/user.schema";
import { updateUserSchema } from "../schemas/user.schema";

type UseUpdateUserProps = {
	user: User;
	onSuccess?: () => void;
	onError?: (error: unknown) => void;
};

const useUpdateUser = ({ user, onSuccess, onError }: UseUpdateUserProps) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		...trpc.user.update.mutationOptions(),
		onSuccess: async (data) => {
			await queryClient.invalidateQueries(trpc.user.list.queryOptions());
			await queryClient.invalidateQueries(
				trpc.user.get.queryOptions({ id: data.id }),
			);
			toast.success("User updated successfully");
			onSuccess?.();
		},
		onError: (error) => {
			toast.error("Failed to update user");
			onError?.(error);
		},
	});

	const form = useForm({
		defaultValues: {
			id: user.id,
			name: user.name,
			email: user.email,
			emailVerified: user.emailVerified,
			image: user.image,
		} as UpdateUserInput,
		validators: {
			onChange: updateUserSchema,
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

export default useUpdateUser;
