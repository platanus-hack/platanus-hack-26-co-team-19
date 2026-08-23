import { MarketingNavbar } from "@/features/marketing/components/MarketingNavbar";
import { JudgeFilters } from "../components/JudgeFilters";
import type { JudgeListItem } from "../schemas/judge-profile.schema";

type JudgeSearchViewProps = {
	jueces: JudgeListItem[];
};

export default function JudgeSearchView({ jueces }: JudgeSearchViewProps) {
	return (
		<div className="flex min-h-svh flex-col">
			<MarketingNavbar />
			<main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-16">
				<div>
					<p className="text-sm text-muted-foreground">Directorio</p>
					<h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
						Jueces y magistrados ponentes
					</h1>
					<p className="mt-3 max-w-2xl text-muted-foreground">
						Fichas a partir de providencias del Consejo de Estado. El número es
						el promedio de puntajes cualitativos (0–100), no una tasa de éxito
						ni una calificación oficial.
					</p>
				</div>
				<JudgeFilters jueces={jueces} />
			</main>
			<footer className="border-t py-6 text-center text-sm text-muted-foreground">
				© {new Date().getFullYear()} deley.com. Todos los derechos reservados.
			</footer>
		</div>
	);
}
