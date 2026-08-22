import PerfilDetailView from "@/features/mcp-preview/views/PerfilDetailView";

type PageProps = {
	params: Promise<{ slug: string }>;
};

export default async function PruebaPerfilDetailPage({ params }: PageProps) {
	const { slug } = await params;
	return <PerfilDetailView slug={slug} />;
}
