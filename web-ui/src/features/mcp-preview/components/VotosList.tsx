"use client";

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
import { votos } from "@/features/mcp-preview/data/votos";
import { searchVotos } from "@/features/mcp-preview/lib/search";

export const VotosList = () => {
	const [radicado, setRadicado] = useState("");
	const [magistrado, setMagistrado] = useState("");
	const [tipo, setTipo] = useState("");

	const rows = useMemo(() => {
		const filtered = searchVotos(votos, {
			radicado: radicado || undefined,
			magistrado: magistrado || undefined,
			tipo: tipo || undefined,
			limit: 50,
		});
		return filtered.map((voto) => ({
			voto,
			id: votos.indexOf(voto),
		}));
	}, [radicado, magistrado, tipo]);

	return (
		<div className="flex flex-col gap-6">
			<div className="grid gap-3 sm:grid-cols-3">
				<div className="grid gap-1.5">
					<Label htmlFor="radicado">Radicado</Label>
					<Input
						id="radicado"
						value={radicado}
						onChange={(e) => setRadicado(e.target.value)}
					/>
				</div>
				<div className="grid gap-1.5">
					<Label htmlFor="magistrado">Magistrado</Label>
					<Input
						id="magistrado"
						value={magistrado}
						onChange={(e) => setMagistrado(e.target.value)}
					/>
				</div>
				<div className="grid gap-1.5">
					<Label htmlFor="tipo">Tipo</Label>
					<Input
						id="tipo"
						value={tipo}
						onChange={(e) => setTipo(e.target.value)}
						placeholder="SALVAMENTO o ACLARACION"
					/>
				</div>
			</div>
			<div className="flex flex-wrap gap-2">
				<Button
					type="button"
					size="sm"
					variant={tipo === "SALVAMENTO" ? "default" : "outline"}
					onClick={() => setTipo("SALVAMENTO")}
				>
					Salvamento
				</Button>
				<Button
					type="button"
					size="sm"
					variant={tipo === "ACLARACION" ? "default" : "outline"}
					onClick={() => setTipo("ACLARACION")}
				>
					Aclaración
				</Button>
				<Button
					type="button"
					size="sm"
					variant="ghost"
					onClick={() => setTipo("")}
				>
					Limpiar tipo
				</Button>
				<p className="ml-auto text-sm text-muted-foreground">
					{rows.length} resultado{rows.length === 1 ? "" : "s"} · tool
					search_votos
				</p>
			</div>
			{rows.length === 0 ? (
				<Empty className="border">
					<EmptyHeader>
						<EmptyTitle>Sin votos</EmptyTitle>
						<EmptyDescription>
							Ningún salvamento o aclaración coincide con esos filtros.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			) : (
				<div className="overflow-x-auto rounded-lg border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Radicado</TableHead>
								<TableHead>Magistrado</TableHead>
								<TableHead>Tipo</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.map(({ voto, id }) => (
								<TableRow key={id}>
									<TableCell className="font-mono text-xs">
										{voto.radicado}
									</TableCell>
									<TableCell>{voto.magistrado}</TableCell>
									<TableCell>
										<Badge
											variant={
												voto.tipo === "SALVAMENTO" ? "default" : "secondary"
											}
										>
											{voto.tipo}
										</Badge>
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
