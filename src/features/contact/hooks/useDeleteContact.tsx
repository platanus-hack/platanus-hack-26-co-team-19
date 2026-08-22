// useDeleteContact.tsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

type UseDeleteContactProps = {
	onSuccess?: () => void;
	onError?: (error: unknown) => void;
};

const useDeleteContact = ({
	onSuccess,
	onError,
}: UseDeleteContactProps = {}) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		...trpc.contact.delete.mutationOptions(),
		onSuccess: async (_data, variables) => {
			await queryClient.invalidateQueries(trpc.contact.list.queryOptions());
			await queryClient.invalidateQueries(
				trpc.contact.get.queryOptions({ id: variables.id }),
			);
			toast.success("Contact deleted successfully");
			onSuccess?.();
		},
		onError: (error) => {
			toast.error("Failed to delete contact");
			onError?.(error);
		},
	});

	return {
		...mutation,
	};
};

export default useDeleteContact;
