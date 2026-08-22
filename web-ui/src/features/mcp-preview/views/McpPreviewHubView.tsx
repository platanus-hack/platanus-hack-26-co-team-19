import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { McpPreviewShell } from "../components/McpPreviewShell";
import { PreviewBadge } from "../components/PreviewBadge";
import { perfiles } from "../data/perfiles";
import { providencias } from "../data/providencias";
import { votos } from "../data/votos";

const datasets = [
	{
		href: "/prueba/providencias",
		tool: "search_providencias",
		title: "Providencias",
		count: providencias.length,
		description:
			"Listado como el JSON de la tool: radicado, tipo, ponente, sección y sentido.",
	},
	{
		href: "/prueba/perfiles",
		tool: "search_perfiles",
		title: "Perfiles de ponentes",
		count: perfiles.length,
		description: "Métricas de volumen, % favorable, duraciones y salvamentos.",
	},
	{
		href: "/prueba/votos",
		tool: "search_votos",
		title: "Votos",
		count: votos.length,
		description: "Salvamentos y aclaraciones por radicado y magistrado.",
	},
];

export default function McpPreviewHubView() {
	return (
		<McpPreviewShell>
			<div>
				<div className="flex flex-wrap items-center gap-3">
					<p className="text-sm text-muted-foreground">Prototipo</p>
					<PreviewBadge />
				</div>
				<h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
					Resultados como si vinieran de las tools MCP
				</h1>
				<p className="mt-3 max-w-2xl text-muted-foreground">
					Estas páginas no consultan el servidor MCP. Muestran cómo podría lucir
					el frontend después de search_providencias, search_perfiles y
					search_votos, con un recorte de los CSV.
				</p>
			</div>
			<div className="grid gap-4 sm:grid-cols-3">
				{datasets.map((dataset) => (
					<Link key={dataset.href} href={dataset.href} className="group">
						<Card className="h-full transition-colors group-hover:border-foreground/20">
							<CardHeader>
								<p className="font-mono text-xs text-muted-foreground">
									{dataset.tool}
								</p>
								<CardTitle>{dataset.title}</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col gap-2">
								<p className="text-sm text-muted-foreground">
									{dataset.description}
								</p>
								<p className="text-2xl font-semibold tabular-nums">
									{dataset.count}
								</p>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</McpPreviewShell>
	);
}
