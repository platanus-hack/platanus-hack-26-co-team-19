"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { JudgeListItem } from "../schemas/judge-profile.schema";
import { JudgeRankList } from "./JudgeRankList";

const ALL = "all";
const MIN_OVERALL_OPTIONS = [0, 50, 60, 70, 80];

type JudgeFiltersProps = {
	jueces: JudgeListItem[];
};

const normalize = (value: string) =>
	value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

export const JudgeFilters = ({ jueces }: JudgeFiltersProps) => {
	const [query, setQuery] = useState("");
	const [seccion, setSeccion] = useState(ALL);
	const [tendencia, setTendencia] = useState(ALL);
	const [minOverall, setMinOverall] = useState(0);

	const secciones = useMemo(
		() =>
			[
				...new Set(jueces.map((juez) => juez.seccion).filter(Boolean)),
			].sort() as string[],
		[jueces],
	);
	const tendencias = useMemo(
		() =>
			[
				...new Set(jueces.map((juez) => juez.tendencia).filter(Boolean)),
			].sort() as string[],
		[jueces],
	);

	const results = useMemo(() => {
		const needle = normalize(query.trim());
		return jueces
			.filter((juez) => {
				if (!needle) return true;
				return normalize(juez.ponente).includes(needle);
			})
			.filter((juez) => (seccion === ALL ? true : juez.seccion === seccion))
			.filter((juez) =>
				tendencia === ALL ? true : juez.tendencia === tendencia,
			)
			.filter((juez) => juez.overall >= minOverall)
			.sort((a, b) => b.overall - a.overall);
	}, [jueces, query, seccion, tendencia, minOverall]);

	return (
		<div className="flex flex-col gap-6">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div className="flex flex-col gap-2">
					<Label htmlFor="juez-query">Nombre</Label>
					<Input
						id="juez-query"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Apellido o nombre"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label>Sección</Label>
					<Select value={seccion} onValueChange={setSeccion}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Todas" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ALL}>Todas</SelectItem>
							{secciones.map((option) => (
								<SelectItem key={option} value={option}>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-2">
					<Label>Tendencia</Label>
					<Select value={tendencia} onValueChange={setTendencia}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Todas" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ALL}>Todas</SelectItem>
							{tendencias.map((option) => (
								<SelectItem key={option} value={option}>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-2">
					<Label>Puntaje mínimo</Label>
					<Select
						value={String(minOverall)}
						onValueChange={(value) => setMinOverall(Number(value))}
					>
						<SelectTrigger className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{MIN_OVERALL_OPTIONS.map((option) => (
								<SelectItem key={option} value={String(option)}>
									{option === 0 ? "Cualquiera" : `${option}+`}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
			<JudgeRankList
				jueces={results}
				emptyMessage="No hay coincidencias con esos filtros."
			/>
		</div>
	);
};
