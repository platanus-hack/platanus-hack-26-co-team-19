"use client";

import { Fragment, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { JudgeProvidencia } from "../schemas/judge-profile.schema";
import { PdfPreviewButton } from "./PdfPreviewButton";

type ProvidenciaHistoryProps = {
	items: JudgeProvidencia[];
};

export const ProvidenciaHistory = ({ items }: ProvidenciaHistoryProps) => {
	const [openKey, setOpenKey] = useState<string | null>(null);

	if (items.length === 0) {
		return null;
	}

	return (
		<section className="flex flex-col gap-3">
			<h2 className="text-lg font-semibold tracking-tight">
				Providencias observadas
			</h2>
			<div className="overflow-x-auto rounded-xl border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Radicado</TableHead>
							<TableHead>Clase</TableHead>
							<TableHead>Sentido</TableHead>
							<TableHead>Favorecido</TableHead>
							<TableHead className="w-12">PDF</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.map((item, index) => {
							const key = `${item.id ?? item.radicado ?? index}`;
							const open = openKey === key;
							const detail = [
								item.tipoDoc ? `Tipo: ${item.tipoDoc}` : null,
								item.anio != null ? `Año: ${item.anio}` : null,
								item.tono ? `Tono: ${item.tono}` : null,
								item.argumentosClave,
								item.observacion,
							]
								.filter(Boolean)
								.join("\n");
							return (
								<Fragment key={key}>
									<TableRow
										className="cursor-pointer"
										onClick={() => setOpenKey(open ? null : key)}
									>
										<TableCell className="font-mono text-xs">
											{item.radicado ?? "—"}
										</TableCell>
										<TableCell className="max-w-xs text-sm">
											{item.claseProceso ?? "—"}
										</TableCell>
										<TableCell className="text-sm">
											{item.sentido ?? "—"}
										</TableCell>
										<TableCell className="text-sm">
											{item.favorecido ?? "—"}
										</TableCell>
										<TableCell>
											<PdfPreviewButton
												id={item.id}
												radicado={item.radicado}
												hasPdf={item.hasPdf}
											/>
										</TableCell>
									</TableRow>
									{open && detail ? (
										<TableRow>
											<TableCell
												colSpan={5}
												className="whitespace-pre-wrap text-sm text-muted-foreground"
											>
												{detail}
											</TableCell>
										</TableRow>
									) : null}
								</Fragment>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</section>
	);
};
