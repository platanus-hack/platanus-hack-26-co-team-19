// useDeleteUser.tsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

type UseDeleteUserProps = {
	onSuccess?: () => void;
	onError?: (error: unknown) => void;
};

const useDeleteUser = ({ onSuccess, onError }: UseDeleteUserProps = {}) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		...trpc.user.delete.mutationOptions(),
		onSuccess: async (_data, variables) => {
			await queryClient.invalidateQueries(trpc.user.list.queryOptions());
			await queryClient.invalidateQueries(
				trpc.user.get.queryOptions({ id: variables.id }),
			);
			toast.success("User deleted successfully");
			onSuccess?.();
		},
		onError: (error) => {
			toast.error("Failed to delete user");
			onError?.(error);
		},
	});

	return {
		...mutation,
	};
};

export default useDeleteUser;
