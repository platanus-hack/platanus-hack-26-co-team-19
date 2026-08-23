import type { Metadata } from "next";
import LawyerSearchView from "@/features/lawyer-profile/views/LawyerSearchView";
import { createPageMetadata, pageSeo } from "@/features/marketing/data/site";

export const metadata: Metadata = createPageMetadata(pageSeo.abogados);

export default function AbogadosPage() {
	return <LawyerSearchView />;
}
