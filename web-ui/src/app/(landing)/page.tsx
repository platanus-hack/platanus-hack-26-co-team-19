import type { Metadata } from "next";
import { listJueces } from "@/features/judge-profile/server/juez.repository";
import { JsonLd } from "@/features/marketing/components/JsonLd";
import {
	createPageMetadata,
	pageSeo,
	site,
} from "@/features/marketing/data/site";
import LandingView from "@/features/marketing/views/LandingView";

export const metadata: Metadata = createPageMetadata({
	...pageSeo.home,
	absoluteTitle: true,
});

export const dynamic = "force-dynamic";

export default async function LandingPage() {
	const jueces = await listJueces();
	return (
		<>
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@graph": [
						{
							"@type": "Organization",
							name: site.name,
							url: site.url,
							logo: `${site.url}/apple-icon`,
							description: site.defaultDescription,
						},
						{
							"@type": "WebSite",
							name: site.name,
							url: site.url,
							inLanguage: "es-CO",
							description: site.defaultDescription,
						},
					],
				}}
			/>
			<LandingView
				sampleJueces={jueces.slice(0, 3)}
				judgeCount={jueces.length}
			/>
		</>
	);
}
