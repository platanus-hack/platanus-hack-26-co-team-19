import { JudgeFilters } from "../components/JudgeFilters";
import type { JudgeListItem } from "../schemas/judge-profile.schema";

type JudgeDashboardViewProps = {
	jueces: JudgeListItem[];
};

export default function JudgeDashboardView({
	jueces,
}: JudgeDashboardViewProps) {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Jueces</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Filtra perfiles reales por nombre, sección y tendencia. El puntaje no
					es tasa de éxito.
				</p>
			</div>
			<JudgeFilters jueces={jueces} />
		</div>
	);
}
