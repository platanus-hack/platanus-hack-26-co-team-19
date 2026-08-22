import type { Metadata } from "next";
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

export default function LandingPage() {
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
							logo: `${site.url}/deley-pe-logo.png`,
							description: site.defaultDescription,
						},
						{
							"@type": "WebSite",
							name: site.name,
							url: site.url,
							inLanguage: "es-PE",
							description: site.defaultDescription,
						},
					],
				}}
			/>
			<LandingView />
		</>
	);
}
