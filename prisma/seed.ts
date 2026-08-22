import config from "@/lib/config";
import s3Client from "@/lib/minio";
import prisma from "@/lib/prisma";

const getPublicReadPolicy = (bucketName: string) => {
	return JSON.stringify({
		Version: "2012-10-17",
		Statement: [
			{
				Sid: "PublicReadGetObject",
				Effect: "Allow",
				Principal: "*", // Permite el acceso a cualquier persona
				Action: ["s3:GetObject"], // Solo permite leer/descargar, NO escribir ni borrar
				Resource: [`arn:aws:s3:::${bucketName}/*`], // Aplica a todos los objetos dentro del bucket
			},
		],
	});
};

function getErrorCode(error: unknown): string | undefined {
	if (typeof error === "object" && error !== null && "code" in error) {
		const code = (error as { code?: unknown }).code;
		return typeof code === "string" ? code : undefined;
	}
	return undefined;
}

async function createBucket(bucketName: string, bucketRegion: string) {
	try {
		const bucketExists = await s3Client.bucketExists(bucketName);
		if (!bucketExists) {
			await s3Client.makeBucket(bucketName, bucketRegion);
			console.log(`Bucket ${bucketName} created.`);
		} else {
			console.log(`Bucket ${bucketName} already exists.`);
		}
	} catch (error: unknown) {
		const code = getErrorCode(error);
		if (code === "BucketAlreadyOwnedByYou" || code === "BucketAlreadyExists") {
			console.log(`Bucket ${bucketName} already exists.`);
		} else {
			console.error("Error creating bucket:", error);
			throw error;
		}
	}
}

async function main() {
	await createBucket(config.minio.bucketName, config.minio.region);

	try {
		const policy = getPublicReadPolicy(config.minio.bucketName);
		await s3Client.setBucketPolicy(config.minio.bucketName, policy);
		console.log(`Bucket policy applied for ${config.minio.bucketName}.`);
	} catch (error: unknown) {
		console.error("Error setting bucket policy:", error);
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
