// useSuspenseListUsers.tsx
"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

const useSuspenseListUsers = () => {
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(trpc.user.list.queryOptions());

	return {
		users: data,
	};
};

export default useSuspenseListUsers;
