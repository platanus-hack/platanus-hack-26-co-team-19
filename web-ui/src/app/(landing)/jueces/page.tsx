import type { Metadata } from "next";
import { listJueces } from "@/features/judge-profile/server/juez.repository";
import JudgeSearchView from "@/features/judge-profile/views/JudgeSearchView";
import { createPageMetadata, pageSeo } from "@/features/marketing/data/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata(pageSeo.jueces);

export default async function JuecesPage() {
	const jueces = await listJueces();
	return <JudgeSearchView jueces={jueces} />;
}
