"use client";

import { Eye } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import useGetProvidenciaPdf from "../hooks/useGetProvidenciaPdf";

type PdfPreviewButtonProps = {
	id?: string | null;
	radicado?: string | null;
	hasPdf: boolean;
};

export const PdfPreviewButton = ({
	id,
	radicado,
	hasPdf,
}: PdfPreviewButtonProps) => {
	const [open, setOpen] = useState(false);
	const { url, isLoading, error } = useGetProvidenciaPdf({
		id,
		radicado,
		enabled: open,
	});

	if (!hasPdf) {
		return <span className="text-xs text-muted-foreground">—</span>;
	}

	return (
		<>
			<Button
				type="button"
				variant="ghost"
				size="icon-xs"
				aria-label="Ver PDF"
				onClick={(event) => {
					event.stopPropagation();
					setOpen(true);
				}}
			>
				<Eye />
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="flex h-[85vh] max-w-4xl flex-col sm:max-w-4xl">
					<DialogHeader>
						<DialogTitle>Providencia</DialogTitle>
						<DialogDescription>
							{radicado ?? id ?? "Documento PDF"}
						</DialogDescription>
					</DialogHeader>
					{isLoading ? (
						<p className="text-sm text-muted-foreground">Cargando PDF…</p>
					) : null}
					{error ? (
						<p className="text-sm text-destructive">No se pudo abrir el PDF.</p>
					) : null}
					{url ? (
						<iframe
							title={radicado ?? "PDF"}
							src={url}
							className="min-h-0 w-full flex-1 rounded-md border bg-muted"
						/>
					) : null}
				</DialogContent>
			</Dialog>
		</>
	);
};
