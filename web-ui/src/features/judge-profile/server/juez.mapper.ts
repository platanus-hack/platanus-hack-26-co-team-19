import type { JuezPerfil } from "@/generated/prisma/client";
import { parseTiposProceso } from "../parse-tipos-proceso";
import type {
	JudgeBadge,
	JudgeListItem,
	JudgeScore,
} from "../schemas/judge-profile.schema";
import { initialsFromName, photoUrlForSlug, slugifyPonente } from "./slug";

const toNumber = (value: unknown): number => {
	if (value == null) return 0;
	if (typeof value === "bigint") return Number(value);
	if (typeof value === "object" && value !== null && "toNumber" in value) {
		return (value as { toNumber: () => number }).toNumber();
	}
	const n = Number(value);
	return Number.isFinite(n) ? n : 0;
};

export const nullableNumber = (value: unknown): number | null => {
	if (value == null) return null;
	const n = toNumber(value);
	return Number.isFinite(n) ? n : null;
};

export const scoresFromRow = (row: JuezPerfil): JudgeScore => ({
	garantismo: row.garantismo,
	rigurosidad: row.rigurosidad,
	independencia: row.independencia,
	consistencia: row.consistencia,
	profundidadJuridica: row.profundidadJuridica,
});

export const overallFromScores = (scores: JudgeScore): number => {
	const values = Object.values(scores).filter(
		(value): value is number => value != null,
	);
	if (values.length === 0) return 0;
	return Math.round(
		values.reduce((sum, value) => sum + value, 0) / values.length,
	);
};

export const badgesFromRow = (row: JuezPerfil): JudgeBadge[] => {
	const badges: JudgeBadge[] = [];
	if (row.tendencia) {
		badges.push({
			code: "TENDENCIA",
			label: row.tendencia,
			rule: "Tendencia registrada en el perfil cualitativo del ponente.",
		});
	}
	if (row.favoreceA) {
		badges.push({
			code: "FAVORECE",
			label: `Favorece a ${row.favoreceA}`,
			rule: "Campo favorece_a del perfil de jueces.",
		});
	}
	const tipos = parseTiposProceso(row.tiposProcesoFrecuentes);
	if (tipos[0]) {
		badges.push({
			code: "PROCESOS",
			label: tipos[0],
			rule: tipos.join(", "),
		});
	}
	return badges;
};

export const toListItem = (row: JuezPerfil): JudgeListItem => {
	const scores = scoresFromRow(row);
	return {
		slug: slugifyPonente(row.ponente),
		ponente: row.ponente,
		sala: row.sala,
		seccion: row.seccion,
		subseccion: row.subseccion,
		totalCasos: row.totalCasos,
		tendencia: row.tendencia,
		favoreceA: row.favoreceA,
		overall: overallFromScores(scores),
		initials: initialsFromName(row.ponente),
		photoUrl: photoUrlForSlug(slugifyPonente(row.ponente)),
	};
};
