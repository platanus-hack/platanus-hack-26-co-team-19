export const GLOSSARY = {
	overall:
		"Promedio de los cinco puntajes cualitativos (0–100). No es una tasa de éxito ni una calificación oficial.",
	tendencia:
		"Patrón predominante en la motivación de las decisiones: garantista, restrictivo o neutro frente a derechos y restricciones.",
	favoreceA:
		"A quién favorece materialmente la mayoría de los fallos: ciudadano, Estado, mixto o indeterminado.",
	tiposProceso:
		"Tipos de proceso en los que más aparece este ponente, según las providencias analizadas.",
	garantismo:
		"Qué tan garantista es en sus motivaciones. 100 = suele proteger derechos; 0 = casi nunca.",
	rigurosidad:
		"Qué tan exigente es con requisitos formales y con la carga probatoria.",
	independencia:
		"Qué tan alejado está de la postura del Estado o de la autoridad pública. 100 = muy independiente.",
	consistencia: "Qué tan predecible y uniforme es en casos similares.",
	profundidadJuridica:
		"Qué tan robusto y extenso es su sustento jurisprudencial.",
	tasaFavorableCiudadano:
		"Porcentaje estimado de fallos que favorecen materialmente al ciudadano o particular (perfil cualitativo).",
	tasaFavorableEstado:
		"Porcentaje estimado de fallos que favorecen al Estado (perfil cualitativo).",
	tasaMixto:
		"Porcentaje estimado de fallos con resultado mixto (perfil cualitativo).",
	favorable:
		"Providencias cuyo sentido scrapado se clasificó como favorable. Distinto de las tasas del perfil.",
	desfavorable:
		"Providencias cuyo sentido scrapado se clasificó como desfavorable.",
	mixtoSentido:
		"Providencias con resultado mixto en el sentido registrado al scrapear.",
	otroSentido:
		"Providencias sin sentido clasificado o con una etiqueta que no encaja en favorable, desfavorable o mixto.",
	sentencias: "Número de sentencias observadas en el corpus scrapado.",
	autos: "Número de autos observados en el corpus scrapado.",
	tutelas: "Número de tutelas observadas en el corpus scrapado.",
	pctFavorable:
		"Porcentaje de providencias con sentido favorable en el corpus scrapado, no el perfil cualitativo.",
	durPromAnios:
		"Duración promedio, en años, entre radicación y fallo en las providencias con dato.",
	salvamentosRecibidos:
		"Veces en que otros magistrados salvaron o aclararon el voto en providencias de este ponente.",
	resumen:
		"Perfil general: patrón de fallos, estilo argumentativo y postura predominante.",
	patronArgumentacion: "Cómo construye y motiva típicamente sus decisiones.",
	sesgoObservable:
		"Rasgo, inclinación o criterio recurrente y explícitamente observable en las providencias. Si no hay evidencia, se declara.",
	aFavorDe:
		"Enfoques, argumentos y estrategias con más probabilidad de éxito ante este juez.",
	inclinadoA:
		"Hacia qué argumentos, posturas y tipos de pretensiones gravita de forma natural.",
} as const;

export type GlossaryKey = keyof typeof GLOSSARY;
