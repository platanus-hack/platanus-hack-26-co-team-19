"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { perfiles } from "@/features/mcp-preview/data/perfiles";
import { perfilSlug, searchPerfiles } from "@/features/mcp-preview/lib/search";

export const PerfilesList = () => {
	const [ponente, setPonente] = useState("");
	const [seccion, setSeccion] = useState("");

	const rows = useMemo(
		() =>
			searchPerfiles(perfiles, {
				ponente: ponente || undefined,
				seccion: seccion || undefined,
				limit: 50,
			}).map((perfil) => {
				const index = perfiles.indexOf(perfil);
				return { perfil, slug: perfilSlug(perfil, index) };
			}),
		[ponente, seccion],
	);

	return (
		<div className="flex flex-col gap-6">
			<div className="grid gap-3 sm:grid-cols-2">
				<div className="grid gap-1.5">
					<Label htmlFor="ponente">Ponente</Label>
					<Input
						id="ponente"
						value={ponente}
						onChange={(e) => setPonente(e.target.value)}
					/>
				</div>
				<div className="grid gap-1.5">
					<Label htmlFor="seccion">Sección</Label>
					<Input
						id="seccion"
						value={seccion}
						onChange={(e) => setSeccion(e.target.value)}
						placeholder="SECCION CUARTA"
					/>
				</div>
			</div>
			<p className="text-sm text-muted-foreground">
				{rows.length} resultado{rows.length === 1 ? "" : "s"} · tool
				search_perfiles
			</p>
			{rows.length === 0 ? (
				<Empty className="border">
					<EmptyHeader>
						<EmptyTitle>Sin perfiles</EmptyTitle>
						<EmptyDescription>
							Ningún ponente coincide con esos filtros.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			) : (
				<div className="overflow-x-auto rounded-lg border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Ponente</TableHead>
								<TableHead>Sección</TableHead>
								<TableHead className="text-right">Total</TableHead>
								<TableHead className="text-right">% fav.</TableHead>
								<TableHead className="text-right">Dur. prom.</TableHead>
								<TableHead />
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.map(({ perfil, slug }) => (
								<TableRow key={slug}>
									<TableCell className="font-medium">
										{perfil.ponente}
									</TableCell>
									<TableCell>
										{perfil.seccion ? (
											<Badge variant="secondary">{perfil.seccion}</Badge>
										) : (
											<span className="text-muted-foreground">—</span>
										)}
									</TableCell>
									<TableCell className="text-right tabular-nums">
										{perfil.total}
									</TableCell>
									<TableCell className="text-right tabular-nums">
										{perfil.pct_favorable || "—"}
									</TableCell>
									<TableCell className="text-right tabular-nums">
										{perfil.dur_prom_anios || "—"}
									</TableCell>
									<TableCell className="text-right">
										<Button asChild size="sm" variant="ghost">
											<Link href={`/prueba/perfiles/${slug}`}>Ver</Link>
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
};
