// useSignIn.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { type SignInInput, signInSchema } from "../schemas/auth.schema";

type UseSignInProps = {
	onSuccess?: () => void;
	onError?: (error: unknown) => void;
};

const useSignIn = ({ onSuccess, onError }: UseSignInProps = {}) => {
	const trpc = useTRPC();

	const mutation = useMutation(
		trpc.auth.signIn.mutationOptions({
			onSuccess: () => {
				toast.success("Signed in successfully");
				onSuccess?.();
			},
			onError: (error) => {
				toast.error(error.message || "Failed to sign in");
				onError?.(error);
			},
		}),
	);

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			rememberMe: true,
		} as SignInInput,
		validators: {
			onChange: signInSchema,
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

export default useSignIn;
