import type { Metadata } from "next";
import config from "@/lib/config";
import { siteCopy } from "./copy";

const baseUrl = config.nextPublicAppUrl.replace(/\/$/, "");

export const site = {
	name: siteCopy.brand,
	url: baseUrl,
	locale: "es_PE",
	lang: "es",
	defaultTitle: siteCopy.brand,
	titleTemplate: `%s | ${siteCopy.brand}`,
	ogTitle: siteCopy.headline,
	defaultDescription: siteCopy.lead,
	ogImage: "/opengraph-image",
	keywords: [
		"abogados Perú",
		"fichas de abogados",
		"casos judiciales observados",
		"directorio jurídico",
		"deley.com",
		"métricas de litigio",
	],
} as const;

export const pageSeo = {
	home: {
		title: siteCopy.brand,
		description: siteCopy.lead,
		path: "/",
	},
	abogados: {
		title: "Buscar abogados",
		description:
			"Directorio de fichas públicas con volumen, materias y resultados observables. Sin tasas de éxito ni rankings de colegio.",
		path: "/abogados",
	},
	about: {
		title: "Acerca de deley.com",
		description:
			"deley.com resume información jurídica observable a partir de casos reales, con privacidad de despacho y sin promesas de resultado.",
		path: "/about",
	},
	contact: {
		title: "Contacto",
		description:
			"Escríbenos para consultas sobre fichas públicas, el directorio o el conector MCP de deley.com.",
		path: "/contact",
	},
	docs: {
		title: "Documentación MCP",
		description:
			"Cómo conectar el servidor MCP de deley.com para consultar providencias, perfiles y votos desde un cliente compatible.",
		path: "/docs",
	},
} as const;

export function absoluteUrl(path: string): string {
	const normalized = path.startsWith("/") ? path : `/${path}`;
	return `${site.url}${normalized}`;
}

type PageMetadataInput = {
	title: string;
	description: string;
	path: string;
	image?: string;
	type?: "website" | "article" | "profile";
	noIndex?: boolean;
	absoluteTitle?: boolean;
};

export function createPageMetadata({
	title,
	description,
	path,
	image,
	type = "website",
	noIndex = false,
	absoluteTitle = false,
}: PageMetadataInput): Metadata {
	const url = absoluteUrl(path);
	const ogImage = image ?? site.ogImage;
	const brandedTitle =
		title === site.name ? site.name : `${title} | ${site.name}`;

	return {
		title: absoluteTitle ? { absolute: brandedTitle } : title,
		description,
		alternates: { canonical: url },
		robots: noIndex
			? { index: false, follow: false }
			: { index: true, follow: true },
		openGraph: {
			title: brandedTitle,
			description,
			url,
			siteName: site.name,
			locale: site.locale,
			type,
			images: [{ url: ogImage }],
		},
		twitter: {
			card: "summary_large_image",
			title: brandedTitle,
			description,
			images: [ogImage],
		},
	};
}
