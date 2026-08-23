export const parseTiposProceso = (raw: string | null | undefined): string[] => {
	if (!raw?.trim()) return [];
	const trimmed = raw.trim();
	if (trimmed.startsWith("[")) {
		try {
			const parsed: unknown = JSON.parse(trimmed);
			if (Array.isArray(parsed)) {
				return parsed
					.map((item) => String(item).trim())
					.filter(Boolean)
					.slice(0, 3);
			}
		} catch {
			// CSV fallback below
		}
	}
	return trimmed
		.split(/[,;]/)
		.map((item) => item.trim())
		.filter(Boolean)
		.slice(0, 3);
};
