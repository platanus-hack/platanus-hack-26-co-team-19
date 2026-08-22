"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

type UseGetConversationProps = {
	id: string | null;
};

const useGetConversation = ({ id }: UseGetConversationProps) => {
	const trpc = useTRPC();
	const query = useQuery({
		...trpc.chat.get.queryOptions({ id: id ?? "" }),
		enabled: Boolean(id),
		placeholderData: (previousData) => previousData,
	});

	return {
		conversation: query.data,
		isLoading: query.isLoading,
		error: query.error,
	};
};

export default useGetConversation;
