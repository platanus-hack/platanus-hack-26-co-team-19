// useSignUp.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { type SignUpInput, signUpSchema } from "../schemas/auth.schema";

type UseSignUpProps = {
	onSuccess?: () => void;
	onError?: (error: unknown) => void;
};

const useSignUp = ({ onSuccess, onError }: UseSignUpProps = {}) => {
	const trpc = useTRPC();

	const mutation = useMutation(
		trpc.auth.signUp.mutationOptions({
			onSuccess: () => {
				toast.success("Account created successfully");
				onSuccess?.();
			},
			onError: (error) => {
				toast.error(error.message || "Failed to sign up");
				onError?.(error);
			},
		}),
	);

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			image: null,
			rememberMe: true,
		} as SignUpInput,
		validators: {
			onChange: signUpSchema,
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

export default useSignUp;
