import { LawyerFilters } from "../components/LawyerFilters";

export default function LawyerDashboardView() {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Abogados</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Filtra el catálogo observado por nombre, materia, sede y rating
					ilustrativo. El rating no es una tasa de éxito ni una calificación
					colegial.
				</p>
			</div>
			<LawyerFilters />
		</div>
	);
}
