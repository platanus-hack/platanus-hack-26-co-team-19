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
import { providencias } from "@/features/mcp-preview/data/providencias";
import { searchProvidencias } from "@/features/mcp-preview/lib/search";

export const ProvidenciasList = () => {
	const [radicado, setRadicado] = useState("");
	const [ponente, setPonente] = useState("");
	const [seccion, setSeccion] = useState("");
	const [tipoDoc, setTipoDoc] = useState("");
	const [sentido, setSentido] = useState("");
	const [q, setQ] = useState("");
	const [tutela, setTutela] = useState<"all" | "yes" | "no">("all");

	const rows = useMemo(
		() =>
			searchProvidencias(providencias, {
				radicado: radicado || undefined,
				ponente: ponente || undefined,
				seccion: seccion || undefined,
				tipo_doc: tipoDoc || undefined,
				sentido: sentido || undefined,
				q: q || undefined,
				es_tutela: tutela === "all" ? undefined : tutela === "yes",
				limit: 50,
			}),
		[radicado, ponente, seccion, tipoDoc, sentido, q, tutela],
	);

	return (
		<div className="flex flex-col gap-6">
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				<div className="grid gap-1.5">
					<Label htmlFor="radicado">Radicado</Label>
					<Input
						id="radicado"
						value={radicado}
						onChange={(e) => setRadicado(e.target.value)}
						placeholder="110010315…"
					/>
				</div>
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
						placeholder="CUARTA"
					/>
				</div>
				<div className="grid gap-1.5">
					<Label htmlFor="tipo">Tipo</Label>
					<Input
						id="tipo"
						value={tipoDoc}
						onChange={(e) => setTipoDoc(e.target.value)}
						placeholder="SENTENCIA, AUTO…"
					/>
				</div>
				<div className="grid gap-1.5">
					<Label htmlFor="sentido">Sentido</Label>
					<Input
						id="sentido"
						value={sentido}
						onChange={(e) => setSentido(e.target.value)}
					/>
				</div>
				<div className="grid gap-1.5">
					<Label htmlFor="q">Texto libre (q)</Label>
					<Input
						id="q"
						value={q}
						onChange={(e) => setQ(e.target.value)}
						placeholder="temas, actor, resolutiva"
					/>
				</div>
			</div>
			<div className="flex flex-wrap items-center gap-2">
				<span className="text-sm text-muted-foreground">Tutela</span>
				<Button
					type="button"
					size="sm"
					variant={tutela === "all" ? "default" : "outline"}
					onClick={() => setTutela("all")}
				>
					Todas
				</Button>
				<Button
					type="button"
					size="sm"
					variant={tutela === "yes" ? "default" : "outline"}
					onClick={() => setTutela("yes")}
				>
					Sí
				</Button>
				<Button
					type="button"
					size="sm"
					variant={tutela === "no" ? "default" : "outline"}
					onClick={() => setTutela("no")}
				>
					No
				</Button>
				<p className="ml-auto text-sm text-muted-foreground">
					{rows.length} resultado{rows.length === 1 ? "" : "s"} · tool
					search_providencias
				</p>
			</div>
			{rows.length === 0 ? (
				<Empty className="border">
					<EmptyHeader>
						<EmptyTitle>Sin providencias</EmptyTitle>
						<EmptyDescription>
							Ajusta los filtros. Este listado usa un recorte estático del CSV.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			) : (
				<div className="overflow-x-auto rounded-lg border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Radicado</TableHead>
								<TableHead>Tipo</TableHead>
								<TableHead>Ponente</TableHead>
								<TableHead>Sección</TableHead>
								<TableHead>Fecha</TableHead>
								<TableHead />
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.map((row) => (
								<TableRow key={row.archivo || row.radicado}>
									<TableCell className="font-mono text-xs">
										{row.radicado || "—"}
									</TableCell>
									<TableCell>
										<div className="flex flex-wrap gap-1">
											<Badge variant="secondary">{row.tipo_doc || "—"}</Badge>
											{row.es_tutela ? (
												<Badge variant="outline">tutela</Badge>
											) : null}
											{row.hay_salvamento ? <Badge>salvamento</Badge> : null}
										</div>
									</TableCell>
									<TableCell className="max-w-[180px] truncate">
										{row.ponente || row.suscribe || "—"}
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{row.seccion || "—"}
									</TableCell>
									<TableCell className="tabular-nums text-sm">
										{row.fecha || "—"}
									</TableCell>
									<TableCell className="text-right">
										<Button asChild size="sm" variant="ghost">
											<Link
												href={`/prueba/providencias/${encodeURIComponent(row.radicado)}`}
											>
												Ver
											</Link>
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
