import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { McpPreviewShell } from "../components/McpPreviewShell";
import { PreviewBadge } from "../components/PreviewBadge";
import { providencias } from "../data/providencias";
import { getProvidencia } from "../lib/search";

type ProvidenciaDetailViewProps = {
	radicado: string;
};

export default function ProvidenciaDetailView({
	radicado,
}: ProvidenciaDetailViewProps) {
	const row = getProvidencia(providencias, { radicado });
	if (!row) notFound();

	return (
		<McpPreviewShell>
			<div className="flex flex-col gap-4">
				<div className="flex flex-wrap items-center gap-3">
					<p className="text-sm text-muted-foreground">get_providencia</p>
					<PreviewBadge />
				</div>
				<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
					{row.radicado || "Providencia"}
				</h1>
				<div className="flex flex-wrap gap-2">
					{row.tipo_doc ? <Badge>{row.tipo_doc}</Badge> : null}
					{row.seccion ? (
						<Badge variant="secondary">{row.seccion}</Badge>
					) : null}
					{row.es_tutela ? <Badge variant="outline">tutela</Badge> : null}
					{row.hay_salvamento ? <Badge>hay salvamento</Badge> : null}
				</div>
				<Button asChild variant="outline" size="sm" className="w-fit">
					<Link href="/prueba/providencias">Volver al listado</Link>
				</Button>
			</div>
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Identificación</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-2 text-sm">
						<p>
							<span className="text-muted-foreground">Ponente: </span>
							{row.ponente || "—"}
						</p>
						<p>
							<span className="text-muted-foreground">Suscribe: </span>
							{row.suscribe || "—"}
						</p>
						<p>
							<span className="text-muted-foreground">Fecha: </span>
							{row.fecha || "—"}
						</p>
						<p>
							<span className="text-muted-foreground">Duración (años): </span>
							{row.duracion_anios ?? "—"}
						</p>
						<p className="break-all">
							<span className="text-muted-foreground">Archivo: </span>
							{row.archivo || "—"}
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Partes</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-2 text-sm">
						<p>
							<span className="text-muted-foreground">Actor: </span>
							{row.actor || "—"}
						</p>
						<p>
							<span className="text-muted-foreground">Pasivo: </span>
							{row.pasivo || "—"}
						</p>
						<p>
							<span className="text-muted-foreground">Sentido: </span>
							{row.sentido || "—"}
						</p>
						<p>
							<span className="text-muted-foreground">Verbo: </span>
							{row.verbo || "—"}
						</p>
					</CardContent>
				</Card>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Temas</CardTitle>
				</CardHeader>
				<CardContent className="text-sm leading-relaxed">
					{row.temas || "Sin temas en el recorte de prueba."}
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Resolutiva</CardTitle>
				</CardHeader>
				<CardContent className="text-sm leading-relaxed whitespace-pre-wrap">
					{row.resolutiva || "Sin resolutiva en el recorte de prueba."}
				</CardContent>
			</Card>
		</McpPreviewShell>
	);
}
