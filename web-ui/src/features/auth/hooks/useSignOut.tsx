// useSignOut.tsx
"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

type UseSignOutProps = {
	onSuccess?: () => void;
	onError?: (error: unknown) => void;
};

const useSignOut = ({ onSuccess, onError }: UseSignOutProps = {}) => {
	const trpc = useTRPC();

	const mutation = useMutation(
		trpc.auth.signOut.mutationOptions({
			onSuccess: () => {
				toast.success("Signed out successfully");
				onSuccess?.();
			},
			onError: (error) => {
				toast.error(error.message || "Failed to sign out");
				onError?.(error);
			},
		}),
	);

	const handleSignOut = async () => {
		await mutation.mutateAsync({});
	};

	return {
		handleSignOut,
		...mutation,
	};
};

export default useSignOut;
