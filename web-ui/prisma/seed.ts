import { z } from "zod";
import { hashPassword } from "@/lib/auth/email-password/password";
import config from "@/lib/config";
import s3Client from "@/lib/minio";
import prisma from "@/lib/prisma";

const ADMIN_PASSWORD = "123456789";
const CREDENTIAL_ISSUER = "local:credential";

const getPublicReadPolicy = (bucketName: string) => {
	return JSON.stringify({
		Version: "2012-10-17",
		Statement: [
			{
				Sid: "PublicReadGetObject",
				Effect: "Allow",
				Principal: "*",
				Action: ["s3:GetObject"],
				Resource: [`arn:aws:s3:::${bucketName}/*`],
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

const seedAdmins = async () => {
	const emails = config.adminEmails;
	if (emails.length === 0) {
		console.log("AMIN_EMAILS vacío: no se crean usuarios admin.");
		return;
	}

	for (const raw of emails) {
		const parsed = z.email().safeParse(raw);
		if (!parsed.success) {
			console.warn(`Email admin inválido, se omite: ${raw}`);
			continue;
		}
		const email = parsed.data;
		const name = email.split("@")[0] ?? email;

		const existingUser = await prisma.user.findUnique({ where: { email } });

		const user = existingUser
			? await prisma.user.update({
					where: { email },
					data: { emailVerified: true },
				})
			: await prisma.user.create({
					data: {
						email,
						name,
						emailVerified: true,
					},
				});

		const existingAccount = await prisma.account.findFirst({
			where: {
				userId: user.id,
				providerId: "credential",
				issuer: CREDENTIAL_ISSUER,
			},
		});

		if (existingAccount) {
			if (existingAccount.issuer !== CREDENTIAL_ISSUER) {
				await prisma.account.update({
					where: { id: existingAccount.id },
					data: { issuer: CREDENTIAL_ISSUER, accountId: user.id },
				});
			}
			console.log(`Admin ya existía, se omite insert: ${email}`);
			continue;
		}

		const legacyAccount = await prisma.account.findFirst({
			where: { userId: user.id, providerId: "credential" },
		});

		if (legacyAccount) {
			await prisma.account.update({
				where: { id: legacyAccount.id },
				data: { issuer: CREDENTIAL_ISSUER, accountId: user.id },
			});
			console.log(`Admin actualizado con issuer: ${email}`);
			continue;
		}

		const passwordHash = await hashPassword(ADMIN_PASSWORD);
		await prisma.account.create({
			data: {
				issuer: CREDENTIAL_ISSUER,
				accountId: user.id,
				providerId: "credential",
				userId: user.id,
				password: passwordHash,
			},
		});

		console.log(`Admin listo: ${email}`);
	}
};

async function seedMinio() {
	try {
		await createBucket(config.minio.bucketName, config.minio.region);
		const policy = getPublicReadPolicy(config.minio.bucketName);
		await s3Client.setBucketPolicy(config.minio.bucketName, policy);
		console.log(`Bucket policy applied for ${config.minio.bucketName}.`);
	} catch (error: unknown) {
		console.error("Minio seed omitido (admins ya procesados):", error);
	}
}

async function main() {
	await seedAdmins();
	await seedMinio();
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
