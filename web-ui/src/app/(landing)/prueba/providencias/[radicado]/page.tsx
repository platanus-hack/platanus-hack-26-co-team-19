import ProvidenciaDetailView from "@/features/mcp-preview/views/ProvidenciaDetailView";

type PageProps = {
	params: Promise<{ radicado: string }>;
};

export default async function PruebaProvidenciaDetailPage({
	params,
}: PageProps) {
	const { radicado } = await params;
	return <ProvidenciaDetailView radicado={decodeURIComponent(radicado)} />;
}
