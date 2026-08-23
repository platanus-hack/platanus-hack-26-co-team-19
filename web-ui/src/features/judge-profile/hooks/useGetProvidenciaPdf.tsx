"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

type UseGetProvidenciaPdfProps = {
	id?: string | null;
	radicado?: string | null;
	enabled: boolean;
};

const useGetProvidenciaPdf = ({
	id,
	radicado,
	enabled,
}: UseGetProvidenciaPdfProps) => {
	const trpc = useTRPC();
	const input = id
		? { id }
		: radicado
			? { radicado }
			: { radicado: "__idle__" };
	const query = useQuery({
		...trpc.juez.presignPdf.queryOptions(input),
		enabled: enabled && Boolean(id || radicado),
	});

	return {
		url: query.data?.url,
		isLoading: query.isLoading || query.isFetching,
		error: query.error,
	};
};

export default useGetProvidenciaPdf;
