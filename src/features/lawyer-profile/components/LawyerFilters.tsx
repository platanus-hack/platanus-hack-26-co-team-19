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
import { filterLawyers, lawyerSedes } from "../data/lawyers";
import {
	MATERIA_LABELS,
	type Materia,
	materiaSchema,
} from "../schemas/lawyer-profile.schema";
import { LawyerRankList } from "./LawyerRankList";

const ALL = "all";
const MIN_OVERALL_OPTIONS = [0, 70, 80, 85, 90];

export const LawyerFilters = () => {
	const [query, setQuery] = useState("");
	const [materia, setMateria] = useState<Materia | typeof ALL>(ALL);
	const [sede, setSede] = useState<string>(ALL);
	const [minOverall, setMinOverall] = useState(0);

	const results = useMemo(
		() => filterLawyers({ query, materia, sede, minOverall }),
		[query, materia, sede, minOverall],
	);

	return (
		<div className="flex flex-col gap-6">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div className="flex flex-col gap-2">
					<Label htmlFor="lawyer-query">Nombre</Label>
					<Input
						id="lawyer-query"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Mendoza, Núñez, Lucía"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label>Materia</Label>
					<Select
						value={materia}
						onValueChange={(value) => {
							if (value === ALL) {
								setMateria(ALL);
								return;
							}
							setMateria(materiaSchema.parse(value));
						}}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Todas" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ALL}>Todas</SelectItem>
							{materiaSchema.options.map((option) => (
								<SelectItem key={option} value={option}>
									{MATERIA_LABELS[option]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-2">
					<Label>Sede</Label>
					<Select value={sede} onValueChange={setSede}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Todas" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={ALL}>Todas</SelectItem>
							{lawyerSedes.map((option) => (
								<SelectItem key={option} value={option}>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-2">
					<Label>Rating mínimo</Label>
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
			<LawyerRankList
				lawyers={results}
				emptyMessage="No hay coincidencias con esos filtros."
			/>
		</div>
	);
};
