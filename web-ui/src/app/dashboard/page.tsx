import { listJueces } from "@/features/judge-profile/server/juez.repository";
import JudgeDashboardView from "@/features/judge-profile/views/JudgeDashboardView";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
	const jueces = await listJueces();
	return <JudgeDashboardView jueces={jueces} />;
}
