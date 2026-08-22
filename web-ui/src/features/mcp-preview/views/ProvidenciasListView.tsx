import { McpPreviewShell } from "../components/McpPreviewShell";
import { PreviewBadge } from "../components/PreviewBadge";
import { ProvidenciasList } from "../components/ProvidenciasList";

export default function ProvidenciasListView() {
	return (
		<McpPreviewShell>
			<div>
				<div className="flex flex-wrap items-center gap-3">
					<p className="text-sm text-muted-foreground">search_providencias</p>
					<PreviewBadge />
				</div>
				<h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
					Providencias
				</h1>
				<p className="mt-3 max-w-2xl text-muted-foreground">
					Filtros equivalentes a los argumentos de la tool. El detalle simula
					get_providencia.
				</p>
			</div>
			<ProvidenciasList />
		</McpPreviewShell>
	);
}
