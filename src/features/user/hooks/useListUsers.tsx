// useListUsers.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

const useListUsers = () => {
	const trpc = useTRPC();
	const { data, isLoading, error } = useQuery(trpc.user.list.queryOptions());

	return {
		users: data ?? [],
		isLoading,
		error,
	};
};

export default useListUsers;
