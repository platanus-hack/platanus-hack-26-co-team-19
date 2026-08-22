import { McpPreviewShell } from "../components/McpPreviewShell";
import { PreviewBadge } from "../components/PreviewBadge";
import { VotosList } from "../components/VotosList";

export default function VotosListView() {
	return (
		<McpPreviewShell>
			<div>
				<div className="flex flex-wrap items-center gap-3">
					<p className="text-sm text-muted-foreground">search_votos</p>
					<PreviewBadge />
				</div>
				<h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
					Salvamentos y aclaraciones
				</h1>
				<p className="mt-3 max-w-2xl text-muted-foreground">
					Listado equivalente a search_votos. El CSV de votos no tiene ficha
					aparte.
				</p>
			</div>
			<VotosList />
		</McpPreviewShell>
	);
}
