import type {
	Perfil,
	Providencia,
	SearchPerfilesQuery,
	SearchProvidenciasQuery,
	SearchVotosQuery,
	Voto,
} from "../types";

export const normalizeText = (value: string): string =>
	value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();

export const includesNormalized = (
	haystack: string,
	needle: string,
): boolean => {
	if (!needle) return true;
	return normalizeText(haystack).includes(normalizeText(needle));
};

export const searchProvidencias = (
	rows: Providencia[],
	query: SearchProvidenciasQuery,
): Providencia[] =>
	rows
		.filter((p) => {
			if (query.radicado && !includesNormalized(p.radicado, query.radicado))
				return false;
			if (query.ponente && !includesNormalized(p.ponente, query.ponente))
				return false;
			if (query.suscribe && !includesNormalized(p.suscribe, query.suscribe))
				return false;
			if (query.seccion && !includesNormalized(p.seccion, query.seccion))
				return false;
			if (query.tipo_doc && !includesNormalized(p.tipo_doc, query.tipo_doc))
				return false;
			if (query.sentido && !includesNormalized(p.sentido, query.sentido))
				return false;
			if (query.anio_fallo !== undefined && p.anio_fallo !== query.anio_fallo)
				return false;
			if (
				query.anio_radicado !== undefined &&
				p.anio_radicado !== query.anio_radicado
			) {
				return false;
			}
			if (query.es_tutela !== undefined && p.es_tutela !== query.es_tutela)
				return false;
			if (query.q) {
				const blob = `${p.temas} ${p.actor} ${p.pasivo} ${p.resolutiva}`;
				if (!includesNormalized(blob, query.q)) return false;
			}
			return true;
		})
		.slice(0, query.limit);

export const getProvidencia = (
	rows: Providencia[],
	params: { radicado?: string; archivo?: string },
): Providencia | null => {
	if (params.archivo) {
		const byArchivo = rows.find((p) =>
			includesNormalized(p.archivo, params.archivo ?? ""),
		);
		if (byArchivo) return byArchivo;
	}
	if (!params.radicado) return null;
	return (
		rows.find((p) => includesNormalized(p.radicado, params.radicado ?? "")) ??
		null
	);
};

export const searchPerfiles = (
	rows: Perfil[],
	query: SearchPerfilesQuery,
): Perfil[] =>
	rows
		.filter((p) => {
			if (query.ponente && !includesNormalized(p.ponente, query.ponente))
				return false;
			if (query.seccion && !includesNormalized(p.seccion, query.seccion))
				return false;
			return true;
		})
		.slice(0, query.limit);

export const perfilSlug = (perfil: Perfil, index: number): string => {
	const base = normalizeText(perfil.ponente)
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
	const seccion = normalizeText(perfil.seccion)
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
	return `${index}-${base || "ponente"}${seccion ? `-${seccion}` : ""}`;
};

export const getPerfilBySlug = (
	rows: Perfil[],
	slug: string,
): Perfil | null => {
	const match = rows
		.map((perfil, index) => ({ perfil, slug: perfilSlug(perfil, index) }))
		.find((item) => item.slug === slug);
	return match?.perfil ?? null;
};

export const searchVotos = (rows: Voto[], query: SearchVotosQuery): Voto[] =>
	rows
		.filter((v) => {
			if (query.radicado && !includesNormalized(v.radicado, query.radicado))
				return false;
			if (
				query.magistrado &&
				!includesNormalized(v.magistrado, query.magistrado)
			)
				return false;
			if (query.tipo && !includesNormalized(v.tipo, query.tipo)) return false;
			return true;
		})
		.slice(0, query.limit);
