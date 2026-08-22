"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

type UseDeleteConversationProps = {
	onSuccess?: () => void;
};

const useDeleteConversation = ({
	onSuccess,
}: UseDeleteConversationProps = {}) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	return useMutation({
		...trpc.chat.delete.mutationOptions(),
		onSuccess: async () => {
			await queryClient.invalidateQueries(trpc.chat.list.queryOptions());
			toast.success("Conversación eliminada");
			onSuccess?.();
		},
		onError: () => {
			toast.error("No se pudo eliminar la conversación");
		},
	});
};

export default useDeleteConversation;
