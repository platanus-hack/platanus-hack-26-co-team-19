import { Inngest } from "inngest";
import config from "@/lib/config";

const devValue = config.inngest.dev?.trim() ?? "";
const isDev =
	devValue !== "" && devValue !== "0" && devValue.toLowerCase() !== "false";

export const inngest = new Inngest({
	id: "web-ui",
	isDev,
	...(config.inngest.eventKey ? { eventKey: config.inngest.eventKey } : {}),
	...(config.inngest.signingKey
		? { signingKey: config.inngest.signingKey }
		: {}),
});
