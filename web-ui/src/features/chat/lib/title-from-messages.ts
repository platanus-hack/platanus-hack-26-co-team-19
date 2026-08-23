import type { UIMessage } from "ai";

const MAX_TITLE_LENGTH = 43;

const shortenTitle = (text: string): string => {
	const firstLine = text.split(/\r?\n/, 1)[0] ?? text;
	const normalized = firstLine.replace(/\s+/g, " ").trim();
	if (normalized.length <= MAX_TITLE_LENGTH) {
		return normalized;
	}

	const slice = normalized.slice(0, MAX_TITLE_LENGTH);
	const lastSpace = slice.lastIndexOf(" ");
	const cut = lastSpace >= 19 ? slice.slice(0, lastSpace) : slice;
	return `${cut.trimEnd()}…`;
};

export const titleFromMessages = (
	messages: UIMessage[],
): string | undefined => {
	const user = messages.find((message) => message.role === "user");
	if (!user) {
		return undefined;
	}
	const text = user.parts
		.filter((part) => part.type === "text")
		.map((part) => ("text" in part ? part.text : ""))
		.join(" ")
		.trim();
	if (!text) {
		return undefined;
	}
	return shortenTitle(text);
};
