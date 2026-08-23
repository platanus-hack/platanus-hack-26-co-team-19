export const formatMcpOutput = (output: unknown): string => {
	if (output == null) {
		return "";
	}

	if (typeof output === "object" && output !== null && "content" in output) {
		const content = (output as { content?: unknown }).content;
		if (Array.isArray(content)) {
			const texts = content
				.filter(
					(item): item is { text: string } =>
						Boolean(item) &&
						typeof item === "object" &&
						"text" in item &&
						typeof (item as { text: unknown }).text === "string",
				)
				.map((item) => {
					try {
						return JSON.stringify(JSON.parse(item.text), null, 2);
					} catch {
						return item.text;
					}
				});
			if (texts.length > 0) {
				return texts.join("\n\n");
			}
		}
	}

	if (typeof output === "string") {
		try {
			return JSON.stringify(JSON.parse(output), null, 2);
		} catch {
			return output;
		}
	}

	try {
		return JSON.stringify(output, null, 2);
	} catch {
		return String(output);
	}
};
