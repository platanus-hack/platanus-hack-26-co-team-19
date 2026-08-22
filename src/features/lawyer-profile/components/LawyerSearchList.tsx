"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { searchLawyersByName } from "../data/lawyers";
import { LawyerRankList } from "./LawyerRankList";

export const LawyerSearchList = () => {
	const [query, setQuery] = useState("");
	const results = useMemo(() => {
		const matched = searchLawyersByName(query);
		return [...matched].sort((a, b) => b.ratings.overall - a.ratings.overall);
	}, [query]);

	return (
		<div className="flex flex-col gap-6">
			<Input
				value={query}
				onChange={(event) => setQuery(event.target.value)}
				placeholder="Buscar por nombre (ej. Mendoza, Núñez, Lucía)"
				aria-label="Buscar abogado por nombre"
			/>
			<LawyerRankList
				lawyers={results}
				emptyMessage={`No hay coincidencias para “${query}”.`}
			/>
		</div>
	);
};
