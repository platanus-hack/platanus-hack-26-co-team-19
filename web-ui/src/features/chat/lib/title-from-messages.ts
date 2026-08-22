import type { UIMessage } from "ai";

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
	return text.length > 80 ? `${text.slice(0, 77)}...` : text;
};
