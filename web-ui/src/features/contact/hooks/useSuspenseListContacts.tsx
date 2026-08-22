// useSuspenseListContacts.tsx
"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

const useSuspenseListContacts = () => {
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(trpc.contact.list.queryOptions());

	return {
		contacts: data,
	};
};

export default useSuspenseListContacts;
