import "server-only"; // <-- ensure this file cannot be imported from the client

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
	createTRPCOptionsProxy,
	type TRPCQueryOptions,
} from "@trpc/tanstack-react-query";
import { cache } from "react";
import { createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
	ctx: createTRPCContext,
	router: appRouter,
	queryClient: getQueryClient,
});

// If your router is on a separate server, pass a client:
// createTRPCOptionsProxy<AppRouter>({
//   client: createTRPCClient<AppRouter>({
//     links: [httpLink({ url: '...' })],
//   }),
//   queryClient: getQueryClient,
// });

export function HydrateClient(props: { children: React.ReactNode }) {
	const queryClient = getQueryClient();
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			{props.children}
		</HydrationBoundary>
	);
}

export function prefetch<T extends ReturnType<TRPCQueryOptions<never>>>(
	queryOptions: T,
) {
	const queryClient = getQueryClient();
	const options = queryOptions as T & { queryKey: unknown[] };
	if (
		(options.queryKey[1] as { type?: string } | undefined)?.type === "infinite"
	) {
		void queryClient.prefetchInfiniteQuery(
			queryOptions as Parameters<typeof queryClient.prefetchInfiniteQuery>[0],
		);
	} else {
		void queryClient.prefetchQuery(
			queryOptions as Parameters<typeof queryClient.prefetchQuery>[0],
		);
	}
}
