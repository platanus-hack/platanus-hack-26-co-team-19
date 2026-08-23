"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

type UseCreateConversationProps = {
	onSuccess?: (id: string) => void;
};

const useCreateConversation = ({
	onSuccess,
}: UseCreateConversationProps = {}) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	return useMutation({
		...trpc.chat.create.mutationOptions(),
		onSuccess: async (data) => {
			await queryClient.invalidateQueries(trpc.chat.list.queryOptions());
			onSuccess?.(data.id);
		},
		onError: (error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "No se pudo crear la conversación",
			);
		},
	});
};

export default useCreateConversation;
