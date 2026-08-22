import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { McpPreviewShell } from "../components/McpPreviewShell";
import { PreviewBadge } from "../components/PreviewBadge";
import { perfiles } from "../data/perfiles";
import { getPerfilBySlug } from "../lib/search";

type PerfilDetailViewProps = {
	slug: string;
};

export default function PerfilDetailView({ slug }: PerfilDetailViewProps) {
	const perfil = getPerfilBySlug(perfiles, slug);
	if (!perfil) notFound();

	const stats = [
		{ label: "Total", value: perfil.total },
		{ label: "Sentencias", value: perfil.sentencias },
		{ label: "Autos", value: perfil.autos },
		{ label: "Tutelas", value: perfil.tutelas },
		{ label: "Favorables", value: perfil.favorables },
		{ label: "Desfavorables", value: perfil.desfavorables },
		{ label: "% favorable", value: perfil.pct_favorable },
		{ label: "Dur. promedio (años)", value: perfil.dur_prom_anios },
		{ label: "Dur. máxima (años)", value: perfil.dur_max_anios },
		{ label: "Salvamentos recibidos", value: perfil.salvamentos_recibidos },
		{ label: "Veces que salvó voto", value: perfil.veces_que_salvo_voto },
	];

	return (
		<McpPreviewShell>
			<div>
				<div className="flex flex-wrap items-center gap-3">
					<p className="text-sm text-muted-foreground">get_perfil</p>
					<PreviewBadge />
				</div>
				<h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
					{perfil.ponente}
				</h1>
				<p className="mt-2 text-muted-foreground">
					{perfil.seccion || "Sin sección en el CSV"}
				</p>
				<Button asChild variant="outline" size="sm" className="mt-4">
					<Link href="/prueba/perfiles">Volver al listado</Link>
				</Button>
			</div>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{stats.map((stat) => (
					<Card key={stat.label}>
						<CardHeader>
							<CardTitle className="text-sm font-medium text-muted-foreground">
								{stat.label}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-2xl font-semibold tabular-nums">
								{stat.value || 0}
							</p>
						</CardContent>
					</Card>
				))}
			</div>
		</McpPreviewShell>
	);
}
