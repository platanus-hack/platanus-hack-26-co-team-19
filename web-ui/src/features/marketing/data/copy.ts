export const siteCopy = {
	brand: "deley.com",
	kicker: "Información jurídica observable",
	headline: "Métricas de abogados a partir de casos reales",
	lead: "El desempeño se ve en el historial de casos, no en la reputación informal. deley.com resume volumen, resultados y tiempos para estudios, coordinadores y personas que necesitan elegir con datos.",
	privacyTitle: "Privacidad de despacho",
	privacy:
		"Lo público y lo confidencial no se mezclan. Mostramos lo que el expediente permite observar; el resto permanece detrás de la puerta del estudio.",
	trustTitle: "Sobriedad y confianza",
	trust:
		"Sin promesas de éxito ni rankings de colegio. Un lenguaje claro, familiar para el abogado y comprensible para quien no litiga todos los días.",
	hierarchyTitle: "Jerarquía eficiente",
	hierarchy:
		"Primero el contexto, después el dato, después la ficha. Como en un pasillo bien diseñado: se sabe dónde esperar, dónde consultar y dónde no entrar.",
	ctaPrimary: "Buscar abogados",
	ctaSecondary: "Acceso autenticado",
	footer: "deley.com. Información ilustrativa a partir de casos observados.",
	aboutKicker: "Acerca de",
	aboutTitle: "Información jurídica observable, no reputación informal",
	aboutLead:
		"deley.com resume volumen, resultados y tiempos a partir de casos que el expediente permite ver. El dato no es veredicto ni ranking de colegio.",
	aboutMissionTitle: "Misión",
	aboutMission:
		"Dar contexto medible a quien elige o coordina abogados: primero el historial observado, después la ficha, sin mezclar lo público con lo confidencial del despacho.",
	aboutProductTitle: "Producto",
	aboutProduct:
		"Directorio de fichas, búsqueda por materia y sede, y un conector MCP para consultar providencias y perfiles desde herramientas compatibles.",
	aboutTeamTitle: "Criterio",
	aboutTeam:
		"Lenguaje sobrio, disclaimers visibles y sin tasas de éxito. Lo que no se puede observar no se infiere.",
	contactKicker: "Contacto",
	contactTitle: "Escríbenos",
	contactLead:
		"Consultas sobre el directorio, fichas públicas o el conector MCP. Los mensajes se guardan para revisión desde el acceso autenticado.",
} as const;

export const stats = [
	{
		value: "8",
		label: "perfiles observados",
		hint: "Fichas públicas de ejemplo",
	},
	{ value: "11", label: "años en la muestra", hint: "Ventana de observación" },
	{ value: "0", label: "tasas de éxito", hint: "No inferimos ganadores" },
	{
		value: "100%",
		label: "disclaimer visible",
		hint: "El dato no es veredicto",
	},
] as const;

export const sampleLawyers = [
	{
		slug: "lucia-mendoza-quispe",
		name: "Lucía Mendoza Quispe",
		sede: "Lima",
		materia: "Laboral",
		colegio: "CAL 45210",
	},
	{
		slug: "diego-salazar-ramos",
		name: "Diego Salazar Ramos",
		sede: "Lima",
		materia: "Civil",
		colegio: "CAL 38102",
	},
	{
		slug: "ana-torres-valdivia",
		name: "Ana Torres Valdivia",
		sede: "Arequipa",
		materia: "Penal",
		colegio: "CAA 12887",
	},
] as const;
