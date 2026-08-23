import { existsSync } from "node:fs";
import { join } from "node:path";

export const slugifyPonente = (name: string): string =>
	name
		.normalize("NFD")
		.replace(/\p{M}/gu, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

export const initialsFromName = (name: string): string => {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "?";
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

export const photoUrlForSlug = (slug: string): string | null => {
	const file = join(process.cwd(), "public", "jueces", `${slug}.png`);
	return existsSync(file) ? `/jueces/${slug}.png` : null;
};
