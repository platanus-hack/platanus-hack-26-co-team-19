// HydrateContact.tsx

import type { ReactNode } from "react";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

type HydrateContactsProps = {
	children: ReactNode;
};

const HydrateContacts = ({ children }: HydrateContactsProps) => {
	prefetch(trpc.contact.list.queryOptions());

	return <HydrateClient>{children}</HydrateClient>;
};

export default HydrateContacts;
