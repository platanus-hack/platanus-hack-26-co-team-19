import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import {
	type JudgeAgg,
	type JudgeListItem,
	type JudgePublicProfile,
	type JudgeResultCounts,
	judgePublicProfileSchema,
} from "../schemas/judge-profile.schema";
import {
	badgesFromRow,
	nullableNumber,
	overallFromScores,
	scoresFromRow,
	toListItem,
} from "./juez.mapper";
import { initialsFromName, photoUrlForSlug, slugifyPonente } from "./slug";

const num = (value: unknown) => nullableNumber(value) ?? 0;

type AggRow = {
	total: unknown;
	procesos: unknown;
	sentencias: unknown;
	autos: unknown;
	tutelas: unknown;
	favorables: unknown;
	desfavorables: unknown;
	pct_favorable: unknown;
	dur_prom_anios: unknown;
	dur_max_anios: unknown;
	veces_salvo_voto: unknown;
	salvamentos_recibidos: unknown;
};

type SentidoRow = { sentido: string | null; n: number };

type ProvidenciaRow = {
	id: string | null;
	radicado: string | null;
	tipo_doc: string | null;
	clase_proceso: string | null;
	sentido: string | null;
	favorecido: string | null;
	anio: number | null;
	seccion: string | null;
	tono: string | null;
	argumentos_clave: string | null;
	observacion: string | null;
	s3_key: string | null;
};

const rowHasPdf = (key: string | null | undefined): boolean =>
	Boolean(key?.trim());

type VotoRow = {
	id: string | null;
	radicado: string | null;
	tipo: string | null;
};

type FirmanteRow = {
	radicado: string | null;
	magistrado: string | null;
	estado: string | null;
	manifestacion: string | null;
};

type ProblemaRow = {
	radicado: string | null;
	problema: string | null;
	respuesta: string | null;
	justificacion: string | null;
	status: string | null;
};

type DescriptorRow = {
	radicado: string | null;
	descriptor: string | null;
};

const emptyAgg = (): JudgeAgg => ({
	total: 0,
	procesos: 0,
	sentencias: 0,
	autos: 0,
	tutelas: 0,
	favorables: 0,
	desfavorables: 0,
	pctFavorable: null,
	durPromAnios: null,
	durMaxAnios: null,
	vecesSalvoVoto: 0,
	salvamentosRecibidos: 0,
});

const mergeAgg = (rows: AggRow[]): JudgeAgg => {
	if (rows.length === 0) return emptyAgg();
	const acc = emptyAgg();
	let durSum = 0;
	let durN = 0;
	let pctSum = 0;
	let pctN = 0;
	for (const row of rows) {
		acc.total += num(row.total);
		acc.procesos += num(row.procesos);
		acc.sentencias += num(row.sentencias);
		acc.autos += num(row.autos);
		acc.tutelas += num(row.tutelas);
		acc.favorables += num(row.favorables);
		acc.desfavorables += num(row.desfavorables);
		acc.vecesSalvoVoto += num(row.veces_salvo_voto);
		acc.salvamentosRecibidos += num(row.salvamentos_recibidos);
		const dur = nullableNumber(row.dur_prom_anios);
		if (dur != null) {
			durSum += dur;
			durN += 1;
		}
		const pct = nullableNumber(row.pct_favorable);
		if (pct != null) {
			pctSum += pct;
			pctN += 1;
		}
		const durMax = nullableNumber(row.dur_max_anios);
		if (durMax != null) {
			acc.durMaxAnios =
				acc.durMaxAnios == null ? durMax : Math.max(acc.durMaxAnios, durMax);
		}
	}
	acc.durPromAnios = durN ? Math.round((durSum / durN) * 10) / 10 : null;
	acc.pctFavorable = pctN ? Math.round((pctSum / pctN) * 10) / 10 : null;
	return acc;
};

const countsFromSentido = (rows: SentidoRow[]): JudgeResultCounts => {
	const counts: JudgeResultCounts = {
		favorable: 0,
		desfavorable: 0,
		mixto: 0,
		otro: 0,
	};
	for (const row of rows) {
		const key = (row.sentido ?? "").toUpperCase();
		if (key.includes("FAVORABLE") && !key.includes("DES")) {
			counts.favorable += row.n;
		} else if (key.includes("DESFAVOR")) {
			counts.desfavorable += row.n;
		} else if (key.includes("MIXT")) {
			counts.mixto += row.n;
		} else {
			counts.otro += row.n;
		}
	}
	return counts;
};

export const listJueces = async (): Promise<JudgeListItem[]> => {
	const rows = await db.juezPerfil.findMany({
		orderBy: { totalCasos: "desc" },
	});
	return rows.map(toListItem);
};

export const countJueces = async (): Promise<number> => {
	return db.juezPerfil.count();
};

export const findJuezBySlug = async (
	slug: string,
): Promise<JudgePublicProfile | null> => {
	const rows = await db.juezPerfil.findMany();
	const row = rows.find((item) => slugifyPonente(item.ponente) === slug);
	if (!row) return null;

	const ponente = row.ponente;

	const [
		aggRows,
		sentidoRows,
		providencias,
		votos,
		firmantes,
		problemas,
		descriptores,
	] = await Promise.all([
		db.$queryRaw<AggRow[]>(Prisma.sql`
			SELECT total, procesos, sentencias, autos, tutelas, favorables, desfavorables,
				pct_favorable, dur_prom_anios, dur_max_anios, veces_salvo_voto, salvamentos_recibidos
			FROM corte.perfiles
			WHERE ponente = ${ponente}
		`),
		db.$queryRaw<SentidoRow[]>(Prisma.sql`
			SELECT sentido, COUNT(*)::int AS n
			FROM corte.providencias
			WHERE ponente = ${ponente}
			GROUP BY sentido
		`),
		db.$queryRaw<ProvidenciaRow[]>(Prisma.sql`
			SELECT id, radicado, tipo_doc, clase_proceso, sentido, favorecido,
				COALESCE(anio_fallo, anio_radicado) AS anio,
				seccion, tono, argumentos_clave, observacion, s3_key
			FROM corte.providencias
			WHERE ponente = ${ponente}
			ORDER BY fecha_providencia DESC NULLS LAST, radicado
			LIMIT 80
		`),
		db.$queryRaw<VotoRow[]>(Prisma.sql`
			SELECT id, radicado, tipo
			FROM corte.votos
			WHERE magistrado = ${ponente}
			ORDER BY radicado
			LIMIT 80
		`),
		db.$queryRaw<FirmanteRow[]>(Prisma.sql`
			SELECT f.radicado, f.magistrado, f.estado, f.manifestacion
			FROM corte.firmantes f
			WHERE f.id IN (
				SELECT p.id FROM corte.providencias p WHERE p.ponente = ${ponente}
			)
			ORDER BY f.radicado, f.magistrado
			LIMIT 80
		`),
		db.$queryRaw<ProblemaRow[]>(Prisma.sql`
			SELECT pr.radicado, pr.problema, pr.respuesta, pr.justificacion, pr.status
			FROM corte.problemas pr
			WHERE pr.id IN (
				SELECT p.id FROM corte.providencias p WHERE p.ponente = ${ponente}
			)
			ORDER BY pr.radicado
			LIMIT 80
		`),
		db.$queryRaw<DescriptorRow[]>(Prisma.sql`
			SELECT d.radicado, d.descriptor
			FROM corte.descriptores d
			WHERE d.id IN (
				SELECT p.id FROM corte.providencias p WHERE p.ponente = ${ponente}
			)
			ORDER BY d.radicado
			LIMIT 80
		`),
	]);

	const scores = scoresFromRow(row);
	const pdfRadicados = new Set(
		providencias
			.filter((item) => rowHasPdf(item.s3_key) && item.radicado)
			.map((item) => item.radicado as string),
	);
	const radicadoHasPdf = (radicado: string | null) =>
		Boolean(radicado && pdfRadicados.has(radicado));
	const profile: JudgePublicProfile = {
		slug,
		ponente: row.ponente,
		initials: initialsFromName(row.ponente),
		photoUrl: photoUrlForSlug(slug),
		sala: row.sala,
		seccion: row.seccion,
		subseccion: row.subseccion,
		totalCasos: row.totalCasos,
		tendencia: row.tendencia,
		favoreceA: row.favoreceA,
		inclinadoA: row.inclinadoA,
		aFavorDe: row.aFavorDe,
		tiposProcesoFrecuentes: row.tiposProcesoFrecuentes,
		resumen: row.resumen,
		patronArgumentacion: row.patronArgumentacion,
		sesgoObservable: row.sesgoObservable,
		tasaFavorableCiudadano: row.tasaFavorableCiudadano,
		tasaFavorableEstado: row.tasaFavorableEstado,
		tasaMixto: row.tasaMixto,
		scores,
		overall: overallFromScores(scores),
		badges: badgesFromRow(row),
		aggregates: mergeAgg(aggRows),
		resultCounts: countsFromSentido(sentidoRows),
		providencias: providencias.map((item) => ({
			id: item.id,
			radicado: item.radicado,
			tipoDoc: item.tipo_doc,
			claseProceso: item.clase_proceso,
			sentido: item.sentido,
			favorecido: item.favorecido,
			anio: item.anio,
			seccion: item.seccion,
			tono: item.tono,
			argumentosClave: item.argumentos_clave,
			observacion: item.observacion,
			hasPdf: rowHasPdf(item.s3_key),
		})),
		votos: votos.map((item) => ({
			id: item.id,
			radicado: item.radicado,
			tipo: item.tipo,
			hasPdf: radicadoHasPdf(item.radicado),
		})),
		firmantes: firmantes.map((item) => ({
			radicado: item.radicado,
			magistrado: item.magistrado,
			estado: item.estado,
			manifestacion: item.manifestacion,
			hasPdf: radicadoHasPdf(item.radicado),
		})),
		problemas: problemas.map((item) => ({
			radicado: item.radicado,
			problema: item.problema,
			respuesta: item.respuesta,
			justificacion: item.justificacion,
			status: item.status,
			hasPdf: radicadoHasPdf(item.radicado),
		})),
		descriptores: descriptores.map((item) => ({
			radicado: item.radicado,
			descriptor: item.descriptor,
			hasPdf: radicadoHasPdf(item.radicado),
		})),
	};

	return judgePublicProfileSchema.parse(profile);
};

export const findS3KeyForPdf = async (input: {
	id?: string;
	radicado?: string;
}): Promise<string | null> => {
	if (input.id) {
		const rows = await db.$queryRaw<{ s3_key: string | null }[]>(Prisma.sql`
			SELECT s3_key
			FROM corte.providencias
			WHERE id = ${input.id}
				AND s3_key IS NOT NULL
				AND btrim(s3_key) <> ''
			LIMIT 1
		`);
		return rows[0]?.s3_key?.trim() || null;
	}
	if (input.radicado) {
		const rows = await db.$queryRaw<{ s3_key: string | null }[]>(Prisma.sql`
			SELECT s3_key
			FROM corte.providencias
			WHERE radicado = ${input.radicado}
				AND s3_key IS NOT NULL
				AND btrim(s3_key) <> ''
			LIMIT 1
		`);
		return rows[0]?.s3_key?.trim() || null;
	}
	return null;
};
