import { z } from "zod";

export const DISCLAIMER =
	"Métricas observadas del Consejo de Estado a partir de providencias scrapadas. No son una calificación oficial ni una tasa de éxito.";

export const judgeScoreSchema = z.object({
	garantismo: z.number().int().nullable(),
	rigurosidad: z.number().int().nullable(),
	independencia: z.number().int().nullable(),
	consistencia: z.number().int().nullable(),
	profundidadJuridica: z.number().int().nullable(),
});

export const judgeBadgeSchema = z.object({
	code: z.string().min(1),
	label: z.string().min(1),
	rule: z.string().min(1),
});

export const judgeListItemSchema = z.object({
	slug: z.string().min(1),
	ponente: z.string().min(1),
	sala: z.string().nullable(),
	seccion: z.string().nullable(),
	subseccion: z.string().nullable(),
	totalCasos: z.number().int(),
	tendencia: z.string().nullable(),
	favoreceA: z.string().nullable(),
	overall: z.number().int(),
	initials: z.string().min(1),
	photoUrl: z.string().nullable(),
});

export const judgeProvidenciaSchema = z.object({
	id: z.string().nullable(),
	radicado: z.string().nullable(),
	tipoDoc: z.string().nullable(),
	claseProceso: z.string().nullable(),
	sentido: z.string().nullable(),
	favorecido: z.string().nullable(),
	anio: z.number().int().nullable(),
	seccion: z.string().nullable(),
	tono: z.string().nullable(),
	argumentosClave: z.string().nullable(),
	observacion: z.string().nullable(),
	hasPdf: z.boolean(),
});

export const judgeVotoSchema = z.object({
	id: z.string().nullable(),
	radicado: z.string().nullable(),
	tipo: z.string().nullable(),
	hasPdf: z.boolean(),
});

export const judgeFirmanteSchema = z.object({
	radicado: z.string().nullable(),
	magistrado: z.string().nullable(),
	estado: z.string().nullable(),
	manifestacion: z.string().nullable(),
	hasPdf: z.boolean(),
});

export const judgeProblemaSchema = z.object({
	radicado: z.string().nullable(),
	problema: z.string().nullable(),
	respuesta: z.string().nullable(),
	justificacion: z.string().nullable(),
	status: z.string().nullable(),
	hasPdf: z.boolean(),
});

export const judgeDescriptorSchema = z.object({
	radicado: z.string().nullable(),
	descriptor: z.string().nullable(),
	hasPdf: z.boolean(),
});

export const presignProvidenciaPdfSchema = z
	.object({
		id: z.string().min(1).optional(),
		radicado: z.string().min(1).optional(),
	})
	.refine((value) => Boolean(value.id || value.radicado), {
		message: "id or radicado is required",
	});

export const judgeAggSchema = z.object({
	total: z.number(),
	procesos: z.number(),
	sentencias: z.number(),
	autos: z.number(),
	tutelas: z.number(),
	favorables: z.number(),
	desfavorables: z.number(),
	pctFavorable: z.number().nullable(),
	durPromAnios: z.number().nullable(),
	durMaxAnios: z.number().nullable(),
	vecesSalvoVoto: z.number(),
	salvamentosRecibidos: z.number(),
});

export const judgeResultCountsSchema = z.object({
	favorable: z.number().int(),
	desfavorable: z.number().int(),
	mixto: z.number().int(),
	otro: z.number().int(),
});

export const judgePublicProfileSchema = z.object({
	slug: z.string().min(1),
	ponente: z.string().min(1),
	initials: z.string().min(1),
	photoUrl: z.string().nullable(),
	sala: z.string().nullable(),
	seccion: z.string().nullable(),
	subseccion: z.string().nullable(),
	totalCasos: z.number().int(),
	tendencia: z.string().nullable(),
	favoreceA: z.string().nullable(),
	inclinadoA: z.string().nullable(),
	aFavorDe: z.string().nullable(),
	tiposProcesoFrecuentes: z.string().nullable(),
	resumen: z.string().nullable(),
	patronArgumentacion: z.string().nullable(),
	sesgoObservable: z.string().nullable(),
	tasaFavorableCiudadano: z.number().int().nullable(),
	tasaFavorableEstado: z.number().int().nullable(),
	tasaMixto: z.number().int().nullable(),
	scores: judgeScoreSchema,
	overall: z.number().int(),
	badges: z.array(judgeBadgeSchema),
	aggregates: judgeAggSchema,
	resultCounts: judgeResultCountsSchema,
	providencias: z.array(judgeProvidenciaSchema),
	votos: z.array(judgeVotoSchema),
	firmantes: z.array(judgeFirmanteSchema),
	problemas: z.array(judgeProblemaSchema),
	descriptores: z.array(judgeDescriptorSchema),
});

export type JudgeScore = z.infer<typeof judgeScoreSchema>;
export type JudgeBadge = z.infer<typeof judgeBadgeSchema>;
export type JudgeListItem = z.infer<typeof judgeListItemSchema>;
export type JudgeProvidencia = z.infer<typeof judgeProvidenciaSchema>;
export type JudgeVoto = z.infer<typeof judgeVotoSchema>;
export type JudgeFirmante = z.infer<typeof judgeFirmanteSchema>;
export type JudgeProblema = z.infer<typeof judgeProblemaSchema>;
export type JudgeDescriptor = z.infer<typeof judgeDescriptorSchema>;
export type JudgeAgg = z.infer<typeof judgeAggSchema>;
export type JudgeResultCounts = z.infer<typeof judgeResultCountsSchema>;
export type JudgePublicProfile = z.infer<typeof judgePublicProfileSchema>;
export type PresignProvidenciaPdfInput = z.infer<
	typeof presignProvidenciaPdfSchema
>;

export const SCORE_LABELS: Record<keyof JudgeScore, string> = {
	garantismo: "Garantismo",
	rigurosidad: "Rigurosidad",
	independencia: "Independencia",
	consistencia: "Consistencia",
	profundidadJuridica: "Profundidad jurídica",
};
