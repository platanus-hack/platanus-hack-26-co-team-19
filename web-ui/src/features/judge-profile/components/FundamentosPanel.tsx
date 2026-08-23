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
import type { JudgePublicProfile } from "../schemas/judge-profile.schema";
import { PdfPreviewButton } from "./PdfPreviewButton";

type FundamentosPanelProps = {
	profile: JudgePublicProfile;
};

export const FundamentosPanel = ({ profile }: FundamentosPanelProps) => {
	const [openKey, setOpenKey] = useState<string | null>(null);
	const hasProblemas = profile.problemas.length > 0;
	const hasDescriptores = profile.descriptores.length > 0;

	if (!hasProblemas && !hasDescriptores) {
		return null;
	}

	return (
		<div className="flex flex-col gap-6">
			{hasProblemas ? (
				<section className="flex flex-col gap-3">
					<h2 className="text-lg font-semibold tracking-tight">
						Problemas jurídicos
					</h2>
					<div className="overflow-x-auto rounded-xl border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Radicado</TableHead>
									<TableHead>Problema</TableHead>
									<TableHead>Respuesta</TableHead>
									<TableHead className="w-12">PDF</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{profile.problemas.map((item, index) => {
									const key = `${item.radicado ?? ""}-${index}`;
									const open = openKey === key;
									return (
										<Fragment key={key}>
											<TableRow
												className="cursor-pointer"
												onClick={() => setOpenKey(open ? null : key)}
											>
												<TableCell className="font-mono text-xs">
													{item.radicado ?? "—"}
												</TableCell>
												<TableCell className="max-w-sm text-sm">
													<p className="line-clamp-2">{item.problema ?? "—"}</p>
												</TableCell>
												<TableCell className="max-w-sm text-sm">
													<p className="line-clamp-2">
														{item.respuesta ?? "—"}
													</p>
												</TableCell>
												<TableCell>
													<PdfPreviewButton
														radicado={item.radicado}
														hasPdf={item.hasPdf}
													/>
												</TableCell>
											</TableRow>
											{open && item.justificacion?.trim() ? (
												<TableRow>
													<TableCell
														colSpan={4}
														className="text-sm text-muted-foreground"
													>
														<p className="whitespace-pre-wrap">
															{item.justificacion}
														</p>
														{item.status ? (
															<p className="mt-2 text-xs">
																Estado: {item.status}
															</p>
														) : null}
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
			) : null}
			{hasDescriptores ? (
				<section className="flex flex-col gap-3">
					<h2 className="text-lg font-semibold tracking-tight">Descriptores</h2>
					<div className="overflow-x-auto rounded-xl border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Radicado</TableHead>
									<TableHead>Descriptor</TableHead>
									<TableHead className="w-12">PDF</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{profile.descriptores.map((item) => (
									<TableRow
										key={`${item.radicado ?? ""}-${item.descriptor ?? ""}`}
									>
										<TableCell className="font-mono text-xs">
											{item.radicado ?? "—"}
										</TableCell>
										<TableCell className="text-sm">
											<p className="line-clamp-2">{item.descriptor ?? "—"}</p>
										</TableCell>
										<TableCell>
											<PdfPreviewButton
												radicado={item.radicado}
												hasPdf={item.hasPdf}
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</section>
			) : null}
		</div>
	);
};
