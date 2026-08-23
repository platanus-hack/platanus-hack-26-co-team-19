import type { MetadataRoute } from "next";
import { listJueces } from "@/features/judge-profile/server/juez.repository";
import { pageSeo, site } from "@/features/marketing/data/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const lastModified = new Date();
	const jueces = await listJueces();
	const staticRoutes = [
		{
			path: pageSeo.home.path,
			priority: 1,
			changeFrequency: "weekly" as const,
		},
		{
			path: pageSeo.jueces.path,
			priority: 0.9,
			changeFrequency: "weekly" as const,
		},
		{
			path: pageSeo.about.path,
			priority: 0.6,
			changeFrequency: "monthly" as const,
		},
		{
			path: pageSeo.contact.path,
			priority: 0.5,
			changeFrequency: "monthly" as const,
		},
		{
			path: pageSeo.docs.path,
			priority: 0.6,
			changeFrequency: "monthly" as const,
		},
	];

	return [
		...staticRoutes.map((route) => ({
			url: `${site.url}${route.path === "/" ? "" : route.path}`,
			lastModified,
			changeFrequency: route.changeFrequency,
			priority: route.priority,
		})),
		...jueces.map((juez) => ({
			url: `${site.url}/jueces/${juez.slug}`,
			lastModified,
			changeFrequency: "weekly" as const,
			priority: 0.7,
		})),
	];
}
