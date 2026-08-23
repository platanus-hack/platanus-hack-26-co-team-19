import type { MetadataRoute } from "next";
import { lawyers } from "@/features/lawyer-profile/data/lawyers";
import { pageSeo, site } from "@/features/marketing/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date();
	const staticRoutes = [
		{
			path: pageSeo.home.path,
			priority: 1,
			changeFrequency: "weekly" as const,
		},
		{
			path: pageSeo.abogados.path,
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
		...lawyers.map((lawyer) => ({
			url: `${site.url}/abogados/${lawyer.slug}`,
			lastModified,
			changeFrequency: "weekly" as const,
			priority: 0.7,
		})),
	];
}
