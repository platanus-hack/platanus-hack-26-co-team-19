import { MarketingNavbar } from "@/features/marketing/components/MarketingNavbar";
import { LawyerSearchList } from "../components/LawyerSearchList";

export default function LawyerSearchView() {
	return (
		<div className="flex min-h-svh flex-col">
			<MarketingNavbar />
			<main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-16">
				<div>
					<p className="text-sm text-muted-foreground">Buscador</p>
					<h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
						Abogados observados
					</h1>
					<p className="mt-3 max-w-2xl text-muted-foreground">
						Busca por nombre. El número grande es un rating ilustrativo de
						capacidades (estilo ficha de videojuego), no una tasa de éxito ni
						una calificación del Colegio de Abogados.
					</p>
				</div>
				<LawyerSearchList />
			</main>
			<footer className="border-t py-6 text-center text-sm text-muted-foreground">
				© {new Date().getFullYear()} deley.com. Todos los derechos reservados.
			</footer>
		</div>
	);
}
