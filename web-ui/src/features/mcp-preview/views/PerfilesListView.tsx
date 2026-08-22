import { McpPreviewShell } from "../components/McpPreviewShell";
import { PerfilesList } from "../components/PerfilesList";
import { PreviewBadge } from "../components/PreviewBadge";

export default function PerfilesListView() {
	return (
		<McpPreviewShell>
			<div>
				<div className="flex flex-wrap items-center gap-3">
					<p className="text-sm text-muted-foreground">search_perfiles</p>
					<PreviewBadge />
				</div>
				<h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
					Perfiles de ponentes
				</h1>
				<p className="mt-3 max-w-2xl text-muted-foreground">
					Métricas agregadas del CSV de perfiles. El detalle simula get_perfil.
				</p>
			</div>
			<PerfilesList />
		</McpPreviewShell>
	);
}
