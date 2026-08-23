import { getPresignedGetUrl } from "@/lib/s3";
import type { PresignProvidenciaPdfInput } from "../schemas/judge-profile.schema";
import * as juezRepository from "./juez.repository";

export const presignPdf = async (
	input: PresignProvidenciaPdfInput,
): Promise<{ url: string }> => {
	const key = await juezRepository.findS3KeyForPdf(input);
	if (!key) {
		throw new Error("PDF not found");
	}
	const url = await getPresignedGetUrl(key);
	return { url };
};
