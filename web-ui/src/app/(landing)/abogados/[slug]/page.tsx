import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
	getLawyerBySlug,
	lawyers,
} from "@/features/lawyer-profile/data/lawyers";
import { MATERIA_LABELS } from "@/features/lawyer-profile/schemas/lawyer-profile.schema";
import LawyerProfileView from "@/features/lawyer-profile/views/LawyerProfileView";
import { JsonLd } from "@/features/marketing/components/JsonLd";
import { createPageMetadata, site } from "@/features/marketing/data/site";

type LawyerDetailPageProps = {
	params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
	return lawyers.map((lawyer) => ({ slug: lawyer.slug }));
}

export async function generateMetadata({
	params,
}: LawyerDetailPageProps): Promise<Metadata> {
	const { slug } = await params;
	const profile = getLawyerBySlug(slug);
	if (!profile) {
		return createPageMetadata({
			title: "Ficha no encontrada",
			description: site.defaultDescription,
			path: `/abogados/${slug}`,
			noIndex: true,
		});
	}

	const materia = MATERIA_LABELS[profile.materiaPrincipal];
	const title = `${profile.identity.fullName} · ${materia} · ${profile.identity.sede}`;
	const description = `Ficha pública de ${profile.identity.fullName} (${profile.identity.nroColegiatura}) en ${profile.identity.sede}. Materia principal: ${materia}. Información ilustrativa a partir de casos observados; no es tasa de éxito ni calificación oficial.`;

	return createPageMetadata({
		title,
		description,
		path: `/abogados/${profile.slug}`,
		image: profile.identity.photoUrl,
		type: "profile",
	});
}

export default async function LawyerDetailPage({
	params,
}: LawyerDetailPageProps) {
	const { slug } = await params;
	const profile = getLawyerBySlug(slug);
	if (!profile) notFound();

	const materia = MATERIA_LABELS[profile.materiaPrincipal];

	return (
		<>
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "Person",
					name: profile.identity.fullName,
					jobTitle: "Abogado",
					url: `${site.url}/abogados/${profile.slug}`,
					image: `${site.url}${profile.identity.photoUrl}`,
					address: {
						"@type": "PostalAddress",
						addressLocality: profile.identity.sede,
						addressCountry: "PE",
						streetAddress: profile.contact.address,
					},
					knowsAbout: materia,
					description: `Ficha pública ilustrativa. Colegiatura ${profile.identity.nroColegiatura}. Los resultados observados no equivalen a una tasa de éxito.`,
				}}
			/>
			<LawyerProfileView profile={profile} />
		</>
	);
}
