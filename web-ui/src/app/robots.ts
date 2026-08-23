import type { MetadataRoute } from "next";
import { site } from "@/features/marketing/data/site";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/dashboard", "/sign-in", "/sign-up", "/prueba"],
		},
		sitemap: `${site.url}/sitemap.xml`,
	};
}
