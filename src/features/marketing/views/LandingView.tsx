import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MarketingNavbar } from "../components/MarketingNavbar";

export default function LandingView() {
	return (
		<div className="flex min-h-svh flex-col">
			<MarketingNavbar />
			<main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-12 px-4 py-16 md:flex-row md:items-center md:justify-between">
				<div className="flex max-w-xl flex-col">
					<p className="text-sm text-muted-foreground">deley.pe</p>
					<h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
						Métricas de abogados a partir de casos reales
					</h1>
					<p className="mt-4 text-muted-foreground">
						El desempeño se ve en el historial de casos, no en la reputación
						informal. deley.pe resume volumen, resultados y tiempos para
						estudios y coordinadores con acceso autenticado.
					</p>
					<div className="mt-8 flex flex-wrap gap-3">
						<Button asChild>
							<Link href="/dashboard">Empezar</Link>
						</Button>
						<Button asChild variant="outline">
							<Link href="/abogados">Buscar abogados</Link>
						</Button>
					</div>
				</div>
				<div className="shrink-0">
					<Image
						src="/deley-pe-logo.png"
						alt="deley.pe"
						width={320}
						height={320}
						priority
						className="rounded-2xl border bg-background shadow-sm"
					/>
				</div>
			</main>
			<footer className="border-t py-6 text-center text-sm text-muted-foreground">
				© {new Date().getFullYear()} deley.pe. Todos los derechos reservados.
			</footer>
		</div>
	);
}
