"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

const useListConversations = () => {
	const trpc = useTRPC();
	const query = useQuery(trpc.chat.list.queryOptions());

	return {
		conversations: query.data ?? [],
		isLoading: query.isLoading,
		error: query.error,
	};
};

export default useListConversations;
