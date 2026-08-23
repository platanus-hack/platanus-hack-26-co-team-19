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
	});

	return {
		conversation: query.data?.id === id ? query.data : undefined,
		isLoading: Boolean(id) && query.data?.id !== id,
		error: query.error,
	};
};

export default useGetConversation;
