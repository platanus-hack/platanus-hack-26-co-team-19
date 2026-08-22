export type VariantMeta = {
	slug: string;
	number: string;
	title: string;
	palette: string;
	idea: string;
};

export const variants: VariantMeta[] = [
	{
		slug: "sala-espera",
		number: "01",
		title: "Sala de espera",
		palette: "Roble claro · papel crema",
		idea: "Recepción amplia, serif editorial y mucho aire.",
	},
	{
		slug: "despacho",
		number: "02",
		title: "Despacho",
		palette: "Nogal · cuero · latón",
		idea: "Estudio cerrado, luz baja y acentos metálicos.",
	},
	{
		slug: "biblioteca",
		number: "03",
		title: "Biblioteca",
		palette: "Burdeos · marfil",
		idea: "Columnas como lomos de expediente.",
	},
	{
		slug: "sala-audiencias",
		number: "04",
		title: "Sala de audiencias",
		palette: "Piedra · mármol",
		idea: "Geometría vertical y cabecera de estrado.",
	},
	{
		slug: "estudio-andino",
		number: "05",
		title: "Estudio andino",
		palette: "Terracota · lino",
		idea: "Madera local y calor de despacho peruano.",
	},
	{
		slug: "confidencial",
		number: "06",
		title: "Confidencial",
		palette: "Sage · taupe · vidrio",
		idea: "Paneles acústicos y privacidad esmerilada.",
	},
	{
		slug: "gaceta",
		number: "07",
		title: "Gaceta",
		palette: "Tinta · papel periódico",
		idea: "Mancheta jurídica y datos en columnas.",
	},
	{
		slug: "firma-boutique",
		number: "08",
		title: "Firma boutique",
		palette: "Navy · oro · crema",
		idea: "Filetes dorados y composición ceremonial.",
	},
	{
		slug: "galeria-pasillo",
		number: "09",
		title: "Galería y pasillo",
		palette: "Roble · blanco · sombra",
		idea: "Zona pública frente al corredor privado.",
	},
	{
		slug: "madera-silencio",
		number: "10",
		title: "Madera y silencio",
		palette: "Veta · baffles",
		idea: "Franjas acústicas y tipografía arquitectónica.",
	},
];

export const getVariant = (slug: string) =>
	variants.find((item) => item.slug === slug);

export const getNeighborSlugs = (slug: string) => {
	const index = variants.findIndex((item) => item.slug === slug);
	if (index < 0) {
		return {
			prev: variants[variants.length - 1]?.slug,
			next: variants[0]?.slug,
		};
	}
	return {
		prev: variants[(index - 1 + variants.length) % variants.length]?.slug,
		next: variants[(index + 1) % variants.length]?.slug,
	};
};
