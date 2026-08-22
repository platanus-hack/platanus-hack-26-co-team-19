import type { ReactNode } from "react";
import { MarketingNavbar } from "@/features/marketing/components/MarketingNavbar";

type McpPreviewShellProps = {
	children: ReactNode;
};

export const McpPreviewShell = ({ children }: McpPreviewShellProps) => (
	<div className="flex min-h-svh flex-col">
		<MarketingNavbar />
		<main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-16">
			{children}
		</main>
		<footer className="border-t py-6 text-center text-sm text-muted-foreground">
			© {new Date().getFullYear()} deley.pe. Datos de prueba, sin conexión MCP.
		</footer>
	</div>
);
