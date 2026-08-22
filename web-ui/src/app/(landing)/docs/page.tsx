import type { Metadata } from "next";
import { JsonLd } from "@/features/marketing/components/JsonLd";
import {
	createPageMetadata,
	pageSeo,
	site,
} from "@/features/marketing/data/site";
import McpDocsView from "@/features/marketing/views/McpDocsView";

export const metadata: Metadata = createPageMetadata(pageSeo.docs);

export default function DocsPage() {
	return (
		<>
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "TechArticle",
					headline: pageSeo.docs.title,
					description: pageSeo.docs.description,
					url: `${site.url}${pageSeo.docs.path}`,
					inLanguage: "es-PE",
					publisher: {
						"@type": "Organization",
						name: site.name,
						url: site.url,
					},
				}}
			/>
			<McpDocsView />
		</>
	);
}
