// HydrateUser.tsx

import type { ReactNode } from "react";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

type HydrateUsersProps = {
	children: ReactNode;
};

const HydrateUsers = ({ children }: HydrateUsersProps) => {
	prefetch(trpc.user.list.queryOptions());

	return <HydrateClient>{children}</HydrateClient>;
};

export default HydrateUsers;
