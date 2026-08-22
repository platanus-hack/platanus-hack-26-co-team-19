import {
	type LawyerPublicProfile,
	lawyerPublicProfileSchema,
	type Materia,
} from "../schemas/lawyer-profile.schema";

const DISCLAIMER =
	"Los resultados no equivalen a una tasa de éxito ni permiten inferir desempeño profesional. El rating de capacidades es una ficha ilustrativa, no una calificación oficial.";

const quality = (
	overrides: Partial<LawyerPublicProfile["dataQuality"]> = {},
): LawyerPublicProfile["dataQuality"] => ({
	overallConfidence: 0.86,
	identityConfidence: 0.9,
	caseAssociationConfidence: 0.88,
	practiceAreaClassificationConfidence: 0.84,
	outcomeExtractionConfidence: 0.78,
	lastHumanReviewAt: "2026-08-21T18:00:00-05:00",
	needsHumanReview: true,
	...overrides,
});

const panel = (
	values: LawyerPublicProfile["resultPanel"]["values"],
): LawyerPublicProfile["resultPanel"] => ({
	title: "Resultados observables",
	displayType: "stackedBar",
	showWinRate: false,
	values,
	requiredDisclaimer: DISCLAIMER,
});

const lawyersRaw: LawyerPublicProfile[] = [
	{
		slug: "lucia-mendoza-quispe",
		identity: {
			fullName: "Lucía Mendoza Quispe",
			givenNames: "Lucía",
			paternalSurname: "Mendoza",
			maternalSurname: "Quispe",
			colegioAbogados: "Colegio de Abogados de Lima (CAL)",
			nroColegiatura: "CAL 45210",
			sede: "Lima",
			distritoJudicial: "Lima",
			aniosObservados: 11,
			photoUrl: "/lawyers/lucia-mendoza-quispe.jpg",
		},
		contact: {
			email: "lucia.mendoza@estudio.pe",
			phone: "+51 1 445 2100",
			address: "Av. Javier Prado Este 420, San Isidro, Lima",
			website: "https://estudiomendoza.pe",
		},
		ratings: {
			overall: 88,
			attributes: {
				litigacionOral: 86,
				escritos: 90,
				recursosInstancias: 84,
				conciliacion: 79,
				prueba: 87,
				derechoMaterial: 91,
				procedimiento: 88,
				especializacion: 93,
			},
		},
		materiaPrincipal: "laboral",
		materias: ["laboral", "constitucional"],
		resultPanel: panel({
			favorable: 12,
			unfavorable: 8,
			mixed: 5,
			notDeterminable: 10,
			pendingOrNoFinalDecision: 7,
		}),
		badges: [
			{
				code: "FOCO_LABORAL",
				label: "Foco laboral",
				rule: "La materia laboral representa al menos 40% de los casos observados.",
				confidence: 0.91,
			},
			{
				code: "TRAYECTORIA_CONTINUA",
				label: "Trayectoria continua",
				rule: "Actividad observada en al menos 7 años dentro del período cubierto.",
				confidence: 0.88,
			},
			{
				code: "ALTA_TRAZABILIDAD",
				label: "Alta trazabilidad",
				rule: "Al menos 90% de relaciones abogado-caso tienen evidencia documental.",
				confidence: 0.95,
			},
			{
				code: "RECORRIDO_RECURSIVO",
				label: "Recorrido recursivo",
				rule: "Existen al menos 10 casos con apelación, revisión o instancia superior observada.",
				confidence: 0.84,
			},
		],
		dataQuality: quality({
			overallConfidence: 0.87,
			caseAssociationConfidence: 0.93,
		}),
		cases: [
			{
				expediente: "01234-2023-0-1801-JR-LA-02",
				organo: "2° Juzgado Especializado de Trabajo de Lima",
				distritoJudicial: "Lima",
				materia: "laboral",
				instancia: "primera",
				resultado: "favorable",
				anio: 2023,
			},
			{
				expediente: "00891-2022-0-1801-SP-LA-01",
				organo: "1ª Sala Laboral de Lima",
				distritoJudicial: "Lima",
				materia: "laboral",
				instancia: "apelacion",
				resultado: "mixed",
				anio: 2024,
			},
			{
				expediente: "00210-2024-0-1801-JR-CI-04",
				organo: "4° Juzgado Constitucional de Lima",
				distritoJudicial: "Lima",
				materia: "constitucional",
				instancia: "amparo",
				resultado: "pendingOrNoFinalDecision",
				anio: 2024,
			},
		],
	},
	{
		slug: "diego-salazar-ramos",
		identity: {
			fullName: "Diego Salazar Ramos",
			givenNames: "Diego",
			paternalSurname: "Salazar",
			maternalSurname: "Ramos",
			colegioAbogados: "Colegio de Abogados de Lima (CAL)",
			nroColegiatura: "CAL 38102",
			sede: "Lima",
			distritoJudicial: "Lima Norte",
			aniosObservados: 8,
			photoUrl: "/lawyers/diego-salazar-ramos.jpg",
		},
		contact: {
			email: "diego.salazar@estudio.pe",
			phone: "+51 1 381 0200",
			address: "Jr. Huallaga 312, Cercado de Lima",
		},
		ratings: {
			overall: 84,
			attributes: {
				litigacionOral: 91,
				escritos: 82,
				recursosInstancias: 80,
				conciliacion: 62,
				prueba: 88,
				derechoMaterial: 86,
				procedimiento: 85,
				especializacion: 89,
			},
		},
		materiaPrincipal: "penal",
		materias: ["penal", "constitucional"],
		resultPanel: panel({
			favorable: 9,
			unfavorable: 11,
			mixed: 4,
			notDeterminable: 8,
			pendingOrNoFinalDecision: 12,
		}),
		badges: [
			{
				code: "FOCO_PENAL",
				label: "Foco penal",
				rule: "La materia penal representa al menos 40% de los casos observados.",
				confidence: 0.9,
			},
			{
				code: "ALTA_ORALIDAD",
				label: "Alta oralidad",
				rule: "Predominan audiencias y litigación oral observada en el NCPP.",
				confidence: 0.86,
			},
		],
		dataQuality: quality({ outcomeExtractionConfidence: 0.72 }),
		cases: [
			{
				expediente: "00456-2023-49-0901-JR-PE-01",
				organo: "1° Juzgado Penal Unipersonal de Lima Norte",
				distritoJudicial: "Lima Norte",
				materia: "penal",
				instancia: "primera",
				resultado: "unfavorable",
				anio: 2023,
			},
			{
				expediente: "00456-2023-49-0901-SP-PE-01",
				organo: "Sala Penal de Apelaciones de Lima Norte",
				distritoJudicial: "Lima Norte",
				materia: "penal",
				instancia: "apelacion",
				resultado: "favorable",
				anio: 2024,
			},
		],
	},
	{
		slug: "ana-torres-valdivia",
		identity: {
			fullName: "Ana Torres Valdivia",
			givenNames: "Ana",
			paternalSurname: "Torres",
			maternalSurname: "Valdivia",
			colegioAbogados: "Colegio de Abogados de Arequipa",
			nroColegiatura: "CAA 12887",
			sede: "Arequipa",
			distritoJudicial: "Arequipa",
			aniosObservados: 14,
			photoUrl: "/lawyers/ana-torres-valdivia.jpg",
		},
		contact: {
			email: "ana.torres@estudio.pe",
			phone: "+51 54 221 887",
			address: "Calle Mercaderes 328, Arequipa",
			website: "https://torresvaldivia.pe",
		},
		ratings: {
			overall: 91,
			attributes: {
				litigacionOral: 83,
				escritos: 94,
				recursosInstancias: 92,
				conciliacion: 70,
				prueba: 85,
				derechoMaterial: 95,
				procedimiento: 90,
				especializacion: 92,
			},
		},
		materiaPrincipal: "constitucional",
		materias: ["constitucional", "contenciosoAdministrativo"],
		resultPanel: panel({
			favorable: 15,
			unfavorable: 6,
			mixed: 7,
			notDeterminable: 9,
			pendingOrNoFinalDecision: 4,
		}),
		badges: [
			{
				code: "FOCO_CONSTITUCIONAL",
				label: "Foco constitucional",
				rule: "Procesos de amparo, habeas data u otros constitucionales superan el 40%.",
				confidence: 0.89,
			},
			{
				code: "RECORRIDO_RECURSIVO",
				label: "Recorrido recursivo",
				rule: "Existen al menos 10 casos con apelación, revisión o instancia superior observada.",
				confidence: 0.87,
			},
		],
		dataQuality: quality({ identityConfidence: 0.94, needsHumanReview: false }),
		cases: [
			{
				expediente: "00112-2022-0-0401-JR-CI-01",
				organo: "1° Juzgado Constitucional de Arequipa",
				distritoJudicial: "Arequipa",
				materia: "constitucional",
				instancia: "amparo",
				resultado: "favorable",
				anio: 2022,
			},
			{
				expediente: "00045-2023-0-0401-SP-CI-01",
				organo: "Sala Civil de Arequipa",
				distritoJudicial: "Arequipa",
				materia: "constitucional",
				instancia: "apelacion",
				resultado: "favorable",
				anio: 2023,
			},
			{
				expediente: "02311-2021-PA/TC",
				organo: "Tribunal Constitucional",
				distritoJudicial: "Nacional",
				materia: "constitucional",
				instancia: "otra",
				resultado: "mixed",
				anio: 2024,
			},
		],
	},
	{
		slug: "roberto-chavez-pinto",
		identity: {
			fullName: "Roberto Chávez Pinto",
			givenNames: "Roberto",
			paternalSurname: "Chávez",
			maternalSurname: "Pinto",
			colegioAbogados: "Colegio de Abogados de Lima (CAL)",
			nroColegiatura: "CAL 29440",
			sede: "Lima",
			distritoJudicial: "Lima",
			aniosObservados: 16,
			photoUrl: "/lawyers/roberto-chavez-pinto.jpg",
		},
		contact: {
			email: "roberto.chavez@estudio.pe",
			phone: "+51 1 294 4400",
			address: "Av. República de Panamá 3535, San Isidro, Lima",
		},
		ratings: {
			overall: 86,
			attributes: {
				litigacionOral: 74,
				escritos: 92,
				recursosInstancias: 88,
				conciliacion: 68,
				prueba: 81,
				derechoMaterial: 94,
				procedimiento: 87,
				especializacion: 90,
			},
		},
		materiaPrincipal: "tributario",
		materias: ["tributario", "contenciosoAdministrativo"],
		resultPanel: panel({
			favorable: 10,
			unfavorable: 9,
			mixed: 6,
			notDeterminable: 11,
			pendingOrNoFinalDecision: 5,
		}),
		badges: [
			{
				code: "FOCO_TRIBUTARIO",
				label: "Foco tributario",
				rule: "Controversias SUNAT / Tribunal Fiscal / contencioso tributario superan el 40%.",
				confidence: 0.88,
			},
		],
		dataQuality: quality({ practiceAreaClassificationConfidence: 0.9 }),
		cases: [
			{
				expediente: "00721-2023-0-1801-JR-CA-03",
				organo: "3° Juzgado Contencioso Administrativo de Lima",
				distritoJudicial: "Lima",
				materia: "tributario",
				instancia: "primera",
				resultado: "notDeterminable",
				anio: 2023,
			},
			{
				expediente: "00721-2024-0-1801-SP-CA-01",
				organo: "Sala Contencioso Administrativa de Lima",
				distritoJudicial: "Lima",
				materia: "tributario",
				instancia: "apelacion",
				resultado: "favorable",
				anio: 2024,
			},
		],
	},
	{
		slug: "mariana-flores-huaman",
		identity: {
			fullName: "Mariana Flores Huamán",
			givenNames: "Mariana",
			paternalSurname: "Flores",
			maternalSurname: "Huamán",
			colegioAbogados: "Colegio de Abogados del Cusco",
			nroColegiatura: "CAC 7712",
			sede: "Cusco",
			distritoJudicial: "Cusco",
			aniosObservados: 7,
			photoUrl: "/lawyers/mariana-flores-huaman.jpg",
		},
		contact: {
			email: "mariana.flores@estudio.pe",
			phone: "+51 84 227 712",
			address: "Av. El Sol 612, Cusco",
		},
		ratings: {
			overall: 79,
			attributes: {
				litigacionOral: 77,
				escritos: 80,
				recursosInstancias: 72,
				conciliacion: 88,
				prueba: 76,
				derechoMaterial: 81,
				procedimiento: 78,
				especializacion: 84,
			},
		},
		materiaPrincipal: "familia",
		materias: ["familia", "civil"],
		resultPanel: panel({
			favorable: 8,
			unfavorable: 5,
			mixed: 9,
			notDeterminable: 6,
			pendingOrNoFinalDecision: 8,
		}),
		badges: [
			{
				code: "FOCO_FAMILIA",
				label: "Foco familia",
				rule: "Alimentos, tenencia u otros de familia superan el 40% de los casos observados.",
				confidence: 0.85,
			},
			{
				code: "CONCILIACION",
				label: "Conciliación observada",
				rule: "Se observa uso frecuente de conciliación extrajudicial (Ley 26872).",
				confidence: 0.8,
			},
		],
		dataQuality: quality({ overallConfidence: 0.8 }),
		cases: [
			{
				expediente: "00331-2024-0-1001-JR-FC-01",
				organo: "1° Juzgado de Familia de Cusco",
				distritoJudicial: "Cusco",
				materia: "familia",
				instancia: "primera",
				resultado: "mixed",
				anio: 2024,
			},
			{
				expediente: "00902-2023-0-1001-JR-CI-02",
				organo: "2° Juzgado Civil de Cusco",
				distritoJudicial: "Cusco",
				materia: "civil",
				instancia: "primera",
				resultado: "favorable",
				anio: 2023,
			},
		],
	},
	{
		slug: "jorge-paredes-silva",
		identity: {
			fullName: "Jorge Paredes Silva",
			givenNames: "Jorge",
			paternalSurname: "Paredes",
			maternalSurname: "Silva",
			colegioAbogados: "Colegio de Abogados de La Libertad",
			nroColegiatura: "CALL 15620",
			sede: "Trujillo",
			distritoJudicial: "La Libertad",
			aniosObservados: 10,
			photoUrl: "/lawyers/jorge-paredes-silva.jpg",
		},
		contact: {
			email: "jorge.paredes@estudio.pe",
			phone: "+51 44 256 201",
			address: "Jr. Pizarro 450, Trujillo",
			website: "https://paredessilva.pe",
		},
		ratings: {
			overall: 82,
			attributes: {
				litigacionOral: 80,
				escritos: 85,
				recursosInstancias: 79,
				conciliacion: 74,
				prueba: 83,
				derechoMaterial: 86,
				procedimiento: 84,
				especializacion: 81,
			},
		},
		materiaPrincipal: "civil",
		materias: ["civil", "comercial"],
		resultPanel: panel({
			favorable: 11,
			unfavorable: 7,
			mixed: 6,
			notDeterminable: 9,
			pendingOrNoFinalDecision: 6,
		}),
		badges: [
			{
				code: "FOCO_CIVIL",
				label: "Foco civil",
				rule: "La materia civil representa al menos 40% de los casos observados.",
				confidence: 0.87,
			},
		],
		dataQuality: quality(),
		cases: [
			{
				expediente: "01502-2022-0-1601-JR-CI-03",
				organo: "3° Juzgado Civil de Trujillo",
				distritoJudicial: "La Libertad",
				materia: "civil",
				instancia: "primera",
				resultado: "favorable",
				anio: 2022,
			},
			{
				expediente: "01502-2023-0-1601-SP-CI-01",
				organo: "Sala Civil de La Libertad",
				distritoJudicial: "La Libertad",
				materia: "civil",
				instancia: "apelacion",
				resultado: "unfavorable",
				anio: 2023,
			},
			{
				expediente: "00088-2024-0-1601-JR-CO-01",
				organo: "Juzgado Comercial de Trujillo",
				distritoJudicial: "La Libertad",
				materia: "comercial",
				instancia: "primera",
				resultado: "pendingOrNoFinalDecision",
				anio: 2024,
			},
		],
	},
	{
		slug: "elena-quispe-mamani",
		identity: {
			fullName: "Elena Quispe Mamani",
			givenNames: "Elena",
			paternalSurname: "Quispe",
			maternalSurname: "Mamani",
			colegioAbogados: "Ilustre Colegio de Abogados de Puno",
			nroColegiatura: "ICAP 4410",
			sede: "Puno",
			distritoJudicial: "Puno",
			aniosObservados: 9,
			photoUrl: "/lawyers/elena-quispe-mamani.jpg",
		},
		contact: {
			email: "elena.quispe@estudio.pe",
			phone: "+51 51 364 410",
			address: "Jr. Lima 215, Puno",
		},
		ratings: {
			overall: 81,
			attributes: {
				litigacionOral: 78,
				escritos: 84,
				recursosInstancias: 83,
				conciliacion: 71,
				prueba: 80,
				derechoMaterial: 85,
				procedimiento: 88,
				especializacion: 82,
			},
		},
		materiaPrincipal: "contenciosoAdministrativo",
		materias: ["contenciosoAdministrativo", "laboral"],
		resultPanel: panel({
			favorable: 7,
			unfavorable: 8,
			mixed: 5,
			notDeterminable: 12,
			pendingOrNoFinalDecision: 9,
		}),
		badges: [
			{
				code: "FOCO_ADMINISTRATIVO",
				label: "Foco administrativo",
				rule: "Procesos contencioso-administrativos superan el 40% de los casos observados.",
				confidence: 0.83,
			},
		],
		dataQuality: quality({ outcomeExtractionConfidence: 0.74 }),
		cases: [
			{
				expediente: "00220-2023-0-2101-JR-CA-01",
				organo: "Juzgado Mixto / Contencioso Administrativo de Puno",
				distritoJudicial: "Puno",
				materia: "contenciosoAdministrativo",
				instancia: "primera",
				resultado: "notDeterminable",
				anio: 2023,
			},
			{
				expediente: "00614-2022-0-2101-JR-LA-01",
				organo: "Juzgado de Trabajo de Puno",
				distritoJudicial: "Puno",
				materia: "laboral",
				instancia: "primera",
				resultado: "favorable",
				anio: 2022,
			},
		],
	},
	{
		slug: "carlos-nunez-vega",
		identity: {
			fullName: "Carlos Núñez Vega",
			givenNames: "Carlos",
			paternalSurname: "Núñez",
			maternalSurname: "Vega",
			colegioAbogados: "Colegio de Abogados de Lima (CAL)",
			nroColegiatura: "CAL 51003",
			sede: "Lima",
			distritoJudicial: "Lima",
			aniosObservados: 6,
			photoUrl: "/lawyers/carlos-nunez-vega.jpg",
		},
		contact: {
			email: "carlos.nunez@estudio.pe",
			phone: "+51 1 510 0300",
			address: "Av. Benavides 1555, Miraflores, Lima",
			website: "https://nunezvega.pe",
		},
		ratings: {
			overall: 77,
			attributes: {
				litigacionOral: 73,
				escritos: 81,
				recursosInstancias: 70,
				conciliacion: 86,
				prueba: 75,
				derechoMaterial: 80,
				procedimiento: 76,
				especializacion: 88,
			},
		},
		materiaPrincipal: "consumidorIndecopi",
		materias: ["consumidorIndecopi", "comercial"],
		resultPanel: panel({
			favorable: 14,
			unfavorable: 4,
			mixed: 8,
			notDeterminable: 7,
			pendingOrNoFinalDecision: 3,
		}),
		badges: [
			{
				code: "FOCO_CONSUMIDOR",
				label: "Foco consumidor",
				rule: "Procedimientos INDECOPI / protección al consumidor superan el 40%.",
				confidence: 0.9,
			},
		],
		dataQuality: quality({ overallConfidence: 0.82, needsHumanReview: true }),
		cases: [
			{
				expediente: "123-2024/CPC-INDECOPI",
				organo: "Comisión de Protección al Consumidor — INDECOPI Lima",
				distritoJudicial: "Lima",
				materia: "consumidorIndecopi",
				instancia: "primera",
				resultado: "favorable",
				anio: 2024,
			},
			{
				expediente: "044-2023/SPC-INDECOPI",
				organo: "Sala Especializada de Protección al Consumidor — INDECOPI",
				distritoJudicial: "Lima",
				materia: "consumidorIndecopi",
				instancia: "apelacion",
				resultado: "mixed",
				anio: 2023,
			},
			{
				expediente: "01002-2024-0-1801-JR-CO-02",
				organo: "2° Juzgado Comercial de Lima",
				distritoJudicial: "Lima",
				materia: "comercial",
				instancia: "primera",
				resultado: "pendingOrNoFinalDecision",
				anio: 2024,
			},
		],
	},
];

export const lawyers: LawyerPublicProfile[] = lawyersRaw.map((lawyer) =>
	lawyerPublicProfileSchema.parse(lawyer),
);

export const normalizeSearch = (value: string) =>
	value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();

export const searchLawyersByName = (query: string) => {
	const needle = normalizeSearch(query);
	if (!needle) return lawyers;
	return lawyers.filter((lawyer) =>
		normalizeSearch(lawyer.identity.fullName).includes(needle),
	);
};

export type LawyerFilterInput = {
	query?: string;
	materia?: Materia | "all";
	sede?: string | "all";
	minOverall?: number;
};

export const lawyerSedes = [
	...new Set(lawyers.map((lawyer) => lawyer.identity.sede)),
].sort((a, b) => a.localeCompare(b, "es"));

export const filterLawyers = ({
	query = "",
	materia = "all",
	sede = "all",
	minOverall = 0,
}: LawyerFilterInput) => {
	return searchLawyersByName(query)
		.filter((lawyer) => {
			if (materia === "all") return true;
			return lawyer.materias.includes(materia);
		})
		.filter((lawyer) => {
			if (sede === "all") return true;
			return lawyer.identity.sede === sede;
		})
		.filter((lawyer) => lawyer.ratings.overall >= minOverall)
		.sort((a, b) => b.ratings.overall - a.ratings.overall);
};

export const getLawyerBySlug = (slug: string) =>
	lawyers.find((lawyer) => lawyer.slug === slug);

export const lawyersByOverallDesc = [...lawyers].sort(
	(a, b) => b.ratings.overall - a.ratings.overall,
);
