// useListContacts.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

const useListContacts = () => {
	const trpc = useTRPC();
	const { data, isLoading, error } = useQuery(trpc.contact.list.queryOptions());

	return {
		contacts: data ?? [],
		isLoading,
		error,
	};
};

export default useListContacts;
