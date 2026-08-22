"use client";

import { ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { CopyCode } from "../components/CopyCode";
import { MarketingNavbar } from "../components/MarketingNavbar";

const MCP_URL =
	process.env.NEXT_PUBLIC_MCP_SERVER_URL ?? "http://206.189.200.33/mcp";

const CONNECTOR_NAME = "deley.pe";

const tools = [
	{
		name: "search_providencias",
		uso: "Filtros por radicado, ponente, sección, tipo, año, sentido, tutela y texto libre",
	},
	{
		name: "get_providencia",
		uso: "Detalle por radicado o archivo",
	},
	{
		name: "search_perfiles",
		uso: "Listado de métricas de ponentes",
	},
	{
		name: "get_perfil",
		uso: "Perfil de un ponente (coincidencia parcial)",
	},
	{
		name: "search_votos",
		uso: "Salvamentos / aclaraciones por radicado o magistrado",
	},
];

function cursorConfigJson(url: string) {
	return JSON.stringify(
		{
			mcpServers: {
				"consejo-estado": {
					url,
				},
			},
		},
		null,
		2,
	);
}

function claudeDesktopJson(url: string) {
	return JSON.stringify(
		{
			mcpServers: {
				"consejo-estado": {
					url,
				},
			},
		},
		null,
		2,
	);
}

function cursorInstallHref(url: string) {
	const config = btoa(JSON.stringify({ url }));
	return `cursor://anysphere.cursor-deeplink/mcp/install?name=${encodeURIComponent("consejo-estado")}&config=${encodeURIComponent(config)}`;
}

function claudeInstallHref(url: string) {
	const params = new URLSearchParams({
		modal: "add-custom-connector",
		connectorName: CONNECTOR_NAME,
		connectorUrl: url,
	});
	return `https://claude.ai/customize/connectors?${params.toString()}`;
}

export default function McpDocsView() {
	const cursorJson = cursorConfigJson(MCP_URL);
	const desktopJson = claudeDesktopJson(MCP_URL);

	return (
		<div className="flex min-h-svh flex-col">
			<MarketingNavbar />
			<main className="mx-auto w-full max-w-5xl flex-1 px-4 py-16">
				<p className="text-sm text-muted-foreground">Documentación</p>
				<h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
					MCP del Consejo de Estado
				</h1>
				<p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
					Conecta el servidor MCP de deley.pe a agentes externos (Claude,
					ChatGPT, Cursor u otros clientes que hablen Model Context Protocol).
					Las tools consultan providencias, perfiles de ponentes y votos.
				</p>

				<Card className="mt-10">
					<CardHeader>
						<CardTitle>URL del servidor</CardTitle>
						<CardDescription>
							Transporte Streamable HTTP. El endpoint es público y no requiere
							token.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<code className="block break-all rounded-md bg-muted px-3 py-2 text-sm">
							{MCP_URL}
						</code>
						<CopyCode value={MCP_URL} label="Copiar URL" />
					</CardContent>
				</Card>

				<section className="mt-10">
					<h2 className="text-xl font-semibold tracking-tight">
						Conectar en un clic
					</h2>
					<p className="mt-2 max-w-2xl text-sm text-muted-foreground leading-relaxed">
						Claude abre el diálogo de conector con nombre y URL prellenados.
						ChatGPT no ofrece ese deep-link: copia la URL y pégala en Apps &
						Connectors. Cursor puede instalar el JSON si tienes el IDE
						instalado.
					</p>
					<div className="mt-4 flex flex-wrap gap-2">
						<Button asChild>
							<a
								href={claudeInstallHref(MCP_URL)}
								target="_blank"
								rel="noreferrer"
							>
								Añadir en Claude
								<ExternalLinkIcon className="size-4" />
							</a>
						</Button>
						<Button asChild variant="secondary">
							<a href="https://chatgpt.com/" target="_blank" rel="noreferrer">
								Abrir ChatGPT
								<ExternalLinkIcon className="size-4" />
							</a>
						</Button>
						<Button asChild variant="outline">
							<a href={cursorInstallHref(MCP_URL)}>Instalar en Cursor</a>
						</Button>
					</div>
					<p className="mt-3 text-sm text-muted-foreground">
						Claude.ai y ChatGPT suelen exigir HTTPS. Si el diálogo rechaza esta
						URL (HTTP), usa Cursor u otro cliente local, o un endpoint HTTPS
						cuando esté disponible. ChatGPT custom connectors requieren plan de
						pago y Developer Mode.
					</p>
				</section>

				<section className="mt-12 space-y-8">
					<h2 className="text-xl font-semibold tracking-tight">
						Tutorial paso a paso
					</h2>

					<div>
						<h3 className="font-medium">1. Claude.ai</h3>
						<ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-muted-foreground leading-relaxed">
							<li>
								Pulsa «Añadir en Claude» (o ve a Customize → Connectors → Add
								custom connector).
							</li>
							<li>Revisa el nombre y la URL prellenados y confirma.</li>
							<li>
								Abre un chat nuevo, activa el conector {CONNECTOR_NAME} y pide
								una búsqueda de providencias.
							</li>
						</ol>
					</div>

					<div>
						<h3 className="font-medium">2. ChatGPT</h3>
						<ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-muted-foreground leading-relaxed">
							<li>Abre ChatGPT e inicia sesión (Plus / Pro o superior).</li>
							<li>
								Settings → Apps & Connectors → Advanced Settings y activa
								Developer Mode.
							</li>
							<li>
								Create / Add custom connector. Nombre: {CONNECTOR_NAME}. URL:{" "}
								<code className="text-foreground">{MCP_URL}</code>. Auth: None.
							</li>
							<li>
								En un chat nuevo, añade el conector desde + y prueba un prompt
								de ejemplo.
							</li>
						</ol>
					</div>

					<div>
						<h3 className="font-medium">3. Cursor</h3>
						<p className="mt-2 text-sm text-muted-foreground">
							Ajustes → MCP, o crea/edita{" "}
							<code className="text-foreground">~/.cursor/mcp.json</code>:
						</p>
						<div className="mt-3 flex justify-end">
							<CopyCode value={cursorJson} label="Copiar JSON" />
						</div>
						<pre className="mt-2 overflow-x-auto rounded-lg border bg-muted p-4 text-xs">
							{cursorJson}
						</pre>
					</div>

					<div>
						<h3 className="font-medium">4. Claude Desktop</h3>
						<p className="mt-2 text-sm text-muted-foreground">
							Añade el bloque en{" "}
							<code className="text-foreground">
								claude_desktop_config.json
							</code>
							:
						</p>
						<div className="mt-3 flex justify-end">
							<CopyCode value={desktopJson} label="Copiar JSON" />
						</div>
						<pre className="mt-2 overflow-x-auto rounded-lg border bg-muted p-4 text-xs">
							{desktopJson}
						</pre>
					</div>
				</section>

				<section className="mt-12">
					<h2 className="text-xl font-semibold tracking-tight">Tools</h2>
					<div className="mt-4 overflow-x-auto rounded-lg border">
						<table className="w-full text-left text-sm">
							<thead className="border-b bg-muted/50">
								<tr>
									<th className="px-4 py-3 font-medium">Tool</th>
									<th className="px-4 py-3 font-medium">Uso</th>
								</tr>
							</thead>
							<tbody>
								{tools.map((tool) => (
									<tr key={tool.name} className="border-b last:border-0">
										<td className="px-4 py-3 font-mono text-xs">{tool.name}</td>
										<td className="px-4 py-3 text-muted-foreground">
											{tool.uso}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<p className="mt-3 text-sm text-muted-foreground">
						Recursos:{" "}
						<code className="text-foreground">dataset://perfiles</code>,{" "}
						<code className="text-foreground">dataset://providencias</code>,{" "}
						<code className="text-foreground">dataset://votos</code>.
					</p>
				</section>

				<section className="mt-12">
					<h2 className="text-xl font-semibold tracking-tight">
						Prompts de ejemplo
					</h2>
					<ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground leading-relaxed">
						<li>
							Busca providencias de tutela de 2023 y resume el sentido de las
							cinco primeras.
						</li>
						<li>
							Dame el perfil del ponente que más aparece en sección tercera.
						</li>
						<li>
							¿Hay salvamentos de voto para el radicado que indiques? Lista
							magistrado y tipo.
						</li>
					</ul>
				</section>
			</main>
			<footer className="border-t py-6 text-center text-sm text-muted-foreground">
				© {new Date().getFullYear()} deley.pe. Endpoint público; datos de
				jurisprudencia.
			</footer>
		</div>
	);
}
