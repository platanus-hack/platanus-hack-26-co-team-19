import type { Metadata } from "next";
import { createPageMetadata, pageSeo } from "@/features/marketing/data/site";
import ContactView from "@/features/marketing/views/ContactView";

export const metadata: Metadata = createPageMetadata(pageSeo.contact);

export default function ContactPage() {
	return <ContactView />;
}
