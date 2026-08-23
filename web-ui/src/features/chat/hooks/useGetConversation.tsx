"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

type UseGetConversationProps = {
	id: string | null;
};

const useGetConversation = ({ id }: UseGetConversationProps) => {
	const trpc = useTRPC();
	const query = useQuery({
		...trpc.chat.get.queryOptions({ id: id ?? "" }),
		enabled: Boolean(id),
		placeholderData: keepPreviousData,
	});

	const conversation = query.data?.id === id ? query.data : undefined;

	return {
		conversation,
		isLoading: Boolean(id) && !conversation && query.isPending,
		error: query.error,
	};
};

export default useGetConversation;
