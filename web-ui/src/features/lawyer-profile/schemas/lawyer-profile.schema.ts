import { z } from "zod";

export const caseOutcomeSchema = z.enum([
	"favorable",
	"unfavorable",
	"mixed",
	"notDeterminable",
	"pendingOrNoFinalDecision",
]);

export const materiaSchema = z.enum([
	"laboral",
	"civil",
	"familia",
	"penal",
	"constitucional",
	"contenciosoAdministrativo",
	"tributario",
	"comercial",
	"consumidorIndecopi",
]);

export const instanciaSchema = z.enum([
	"primera",
	"apelacion",
	"casacion",
	"amparo",
	"otra",
]);

export const resultPanelValuesSchema = z.object({
	favorable: z.number().int().nonnegative(),
	unfavorable: z.number().int().nonnegative(),
	mixed: z.number().int().nonnegative(),
	notDeterminable: z.number().int().nonnegative(),
	pendingOrNoFinalDecision: z.number().int().nonnegative(),
});

export const resultPanelSchema = z.object({
	title: z.string().min(1),
	displayType: z.literal("stackedBar"),
	showWinRate: z.boolean(),
	values: resultPanelValuesSchema,
	requiredDisclaimer: z.string().min(1),
});

export const lawyerBadgeSchema = z.object({
	code: z.string().min(1),
	label: z.string().min(1),
	rule: z.string().min(1),
	confidence: z.number().min(0).max(1),
});

export const dataQualitySchema = z.object({
	overallConfidence: z.number().min(0).max(1),
	identityConfidence: z.number().min(0).max(1),
	caseAssociationConfidence: z.number().min(0).max(1),
	practiceAreaClassificationConfidence: z.number().min(0).max(1),
	outcomeExtractionConfidence: z.number().min(0).max(1),
	lastHumanReviewAt: z.iso.datetime({ offset: true }),
	needsHumanReview: z.boolean(),
});

export const lawyerContactSchema = z.object({
	email: z.string().email(),
	phone: z.string().min(1),
	address: z.string().min(1),
	website: z.string().url().optional(),
});

export const lawyerIdentitySchema = z.object({
	fullName: z.string().min(1),
	givenNames: z.string().min(1),
	paternalSurname: z.string().min(1),
	maternalSurname: z.string().min(1),
	colegioAbogados: z.string().min(1),
	nroColegiatura: z.string().min(1),
	sede: z.string().min(1),
	distritoJudicial: z.string().min(1),
	aniosObservados: z.number().int().positive(),
	photoUrl: z.string().min(1),
});

export const lawyerAttributesSchema = z.object({
	litigacionOral: z.number().int().min(40).max(99),
	escritos: z.number().int().min(40).max(99),
	recursosInstancias: z.number().int().min(40).max(99),
	conciliacion: z.number().int().min(40).max(99),
	prueba: z.number().int().min(40).max(99),
	derechoMaterial: z.number().int().min(40).max(99),
	procedimiento: z.number().int().min(40).max(99),
	especializacion: z.number().int().min(40).max(99),
});

export const lawyerRatingsSchema = z.object({
	overall: z.number().int().min(40).max(99),
	attributes: lawyerAttributesSchema,
});

export const lawyerCaseSchema = z.object({
	expediente: z.string().min(1),
	organo: z.string().min(1),
	distritoJudicial: z.string().min(1),
	materia: materiaSchema,
	instancia: instanciaSchema,
	resultado: caseOutcomeSchema,
	anio: z.number().int(),
});

export const lawyerPublicProfileSchema = z.object({
	slug: z.string().min(1),
	identity: lawyerIdentitySchema,
	contact: lawyerContactSchema,
	ratings: lawyerRatingsSchema,
	materiaPrincipal: materiaSchema,
	materias: z.array(materiaSchema).min(1),
	resultPanel: resultPanelSchema,
	badges: z.array(lawyerBadgeSchema),
	dataQuality: dataQualitySchema,
	cases: z.array(lawyerCaseSchema),
});

export type CaseOutcome = z.infer<typeof caseOutcomeSchema>;
export type Materia = z.infer<typeof materiaSchema>;
export type Instancia = z.infer<typeof instanciaSchema>;
export type ResultPanelValues = z.infer<typeof resultPanelValuesSchema>;
export type ResultPanel = z.infer<typeof resultPanelSchema>;
export type LawyerBadge = z.infer<typeof lawyerBadgeSchema>;
export type DataQuality = z.infer<typeof dataQualitySchema>;
export type LawyerContact = z.infer<typeof lawyerContactSchema>;
export type LawyerIdentity = z.infer<typeof lawyerIdentitySchema>;
export type LawyerAttributes = z.infer<typeof lawyerAttributesSchema>;
export type LawyerRatings = z.infer<typeof lawyerRatingsSchema>;
export type LawyerCase = z.infer<typeof lawyerCaseSchema>;
export type LawyerPublicProfile = z.infer<typeof lawyerPublicProfileSchema>;

export const MATERIA_LABELS: Record<Materia, string> = {
	laboral: "Laboral (NLPT)",
	civil: "Civil",
	familia: "Familia",
	penal: "Penal",
	constitucional: "Constitucional",
	contenciosoAdministrativo: "Contencioso-administrativo",
	tributario: "Tributario",
	comercial: "Comercial / societario",
	consumidorIndecopi: "Consumidor / INDECOPI",
};

export const INSTANCIA_LABELS: Record<Instancia, string> = {
	primera: "Primera instancia",
	apelacion: "Apelación",
	casacion: "Casación",
	amparo: "Amparo / procesos constitucionales",
	otra: "Otra",
};

export const OUTCOME_LABELS: Record<CaseOutcome, string> = {
	favorable: "Favorable",
	unfavorable: "Desfavorable",
	mixed: "Mixto",
	notDeterminable: "No determinable",
	pendingOrNoFinalDecision: "Pendiente o sin decisión final",
};

export const ATTRIBUTE_LABELS: Record<keyof LawyerAttributes, string> = {
	litigacionOral: "Litigación oral",
	escritos: "Escritos y fundamentación",
	recursosInstancias: "Recursos e instancias",
	conciliacion: "Conciliación (Ley 26872 / CEJ)",
	prueba: "Investigación probatoria",
	derechoMaterial: "Derecho material",
	procedimiento: "Procedimiento y plazos",
	especializacion: "Especialización sectorial",
};
