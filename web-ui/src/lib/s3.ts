import {
	GetObjectCommand,
	HeadBucketCommand,
	ListBucketsCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import config from "./config";

const PRESIGN_TTL_SECONDS = 60 * 5;

let client: S3Client | null = null;
let resolvedBucket: string | null = config.aws.bucketName?.trim() || null;

const getClient = (): S3Client => {
	if (client) return client;
	if (!config.aws.accessKeyId || !config.aws.secretAccessKey) {
		throw new Error("AWS credentials are not configured");
	}
	client = new S3Client({
		region: config.aws.region,
		credentials: {
			accessKeyId: config.aws.accessKeyId,
			secretAccessKey: config.aws.secretAccessKey,
		},
	});
	return client;
};

const resolveBucket = async (): Promise<string> => {
	if (resolvedBucket) return resolvedBucket;
	const s3 = getClient();
	const listed = await s3.send(new ListBucketsCommand({}));
	const match = (listed.Buckets ?? [])
		.map((bucket) => bucket.Name)
		.find((name) => name?.toLowerCase().includes("platanus"));
	if (!match) {
		throw new Error('No S3 bucket whose name contains "platanus"');
	}
	await s3.send(new HeadBucketCommand({ Bucket: match }));
	resolvedBucket = match;
	return match;
};

export const getPresignedGetUrl = async (key: string): Promise<string> => {
	const s3 = getClient();
	const bucket = await resolveBucket();
	const command = new GetObjectCommand({
		Bucket: bucket,
		Key: key,
		ResponseContentDisposition: "inline",
		ResponseContentType: "application/pdf",
	});
	return getSignedUrl(s3, command, { expiresIn: PRESIGN_TTL_SECONDS });
};
