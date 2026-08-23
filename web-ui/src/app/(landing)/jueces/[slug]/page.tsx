import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findJuezBySlug } from "@/features/judge-profile/server/juez.repository";
import JudgeProfileView from "@/features/judge-profile/views/JudgeProfileView";
import { JsonLd } from "@/features/marketing/components/JsonLd";
import { createPageMetadata, site } from "@/features/marketing/data/site";

export const dynamic = "force-dynamic";

type JuezDetailPageProps = {
	params: Promise<{ slug: string }>;
};

export async function generateMetadata({
	params,
}: JuezDetailPageProps): Promise<Metadata> {
	const { slug } = await params;
	const profile = await findJuezBySlug(slug);
	if (!profile) {
		return createPageMetadata({
			title: "Ficha no encontrada",
			description: site.defaultDescription,
			path: `/jueces/${slug}`,
			noIndex: true,
		});
	}

	const organo = [profile.seccion, profile.subseccion]
		.filter(Boolean)
		.join(" · ");
	const title = `${profile.ponente} · ${organo || "Consejo de Estado"}`;
	const description = `Ficha de ${profile.ponente} a partir de providencias observadas. No es calificación oficial ni tasa de éxito.`;

	return createPageMetadata({
		title,
		description,
		path: `/jueces/${profile.slug}`,
		type: "profile",
	});
}

export default async function JuezDetailPage({ params }: JuezDetailPageProps) {
	const { slug } = await params;
	const profile = await findJuezBySlug(slug);
	if (!profile) notFound();

	const organo = [profile.seccion, profile.subseccion]
		.filter(Boolean)
		.join(" · ");

	return (
		<>
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "Person",
					name: profile.ponente,
					jobTitle: "Magistrado ponente",
					url: `${site.url}/jueces/${profile.slug}`,
					worksFor: {
						"@type": "Organization",
						name: "Consejo de Estado",
					},
					knowsAbout: organo || "Derecho administrativo",
					description:
						"Ficha pública a partir de providencias observadas. Los indicadores no equivalen a una tasa de éxito.",
				}}
			/>
			<JudgeProfileView profile={profile} />
		</>
	);
}
