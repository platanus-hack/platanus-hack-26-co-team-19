import type { Metadata } from "next";
import { createPageMetadata, pageSeo } from "@/features/marketing/data/site";
import AboutView from "@/features/marketing/views/AboutView";

export const metadata: Metadata = createPageMetadata(pageSeo.about);

export default function AboutPage() {
	return <AboutView />;
}
