"use client";

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

type VotosFirmasPanelProps = {
	profile: JudgePublicProfile;
};

export const VotosFirmasPanel = ({ profile }: VotosFirmasPanelProps) => {
	const hasVotos = profile.votos.length > 0;
	const hasFirmantes = profile.firmantes.length > 0;

	if (!hasVotos && !hasFirmantes) {
		return null;
	}

	return (
		<div className="flex flex-col gap-6">
			{hasVotos ? (
				<section className="flex flex-col gap-3">
					<h2 className="text-lg font-semibold tracking-tight">Votos</h2>
					<div className="overflow-x-auto rounded-xl border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Radicado</TableHead>
									<TableHead>Tipo</TableHead>
									<TableHead className="w-12">PDF</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{profile.votos.map((item, index) => (
									<TableRow key={`${item.id ?? item.radicado ?? index}`}>
										<TableCell className="font-mono text-xs">
											{item.radicado ?? "—"}
										</TableCell>
										<TableCell>{item.tipo ?? "—"}</TableCell>
										<TableCell>
											<PdfPreviewButton
												id={item.id}
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
			{hasFirmantes ? (
				<section className="flex flex-col gap-3">
					<h2 className="text-lg font-semibold tracking-tight">Firmantes</h2>
					<div className="overflow-x-auto rounded-xl border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Radicado</TableHead>
									<TableHead>Magistrado</TableHead>
									<TableHead>Estado</TableHead>
									<TableHead>Manifestación</TableHead>
									<TableHead className="w-12">PDF</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{profile.firmantes.map((item, index) => (
									<TableRow
										key={`${item.radicado ?? ""}-${item.magistrado ?? index}`}
									>
										<TableCell className="font-mono text-xs">
											{item.radicado ?? "—"}
										</TableCell>
										<TableCell>{item.magistrado ?? "—"}</TableCell>
										<TableCell>{item.estado ?? "—"}</TableCell>
										<TableCell className="max-w-xs text-sm">
											<p className="line-clamp-2">
												{item.manifestacion ?? "—"}
											</p>
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
