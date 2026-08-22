import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Pool } from "pg";
import { PrismaClient } from "@/generated/prisma/client";
import config from "./config";

const globalForPrisma = global as unknown as {
	prisma: PrismaClient;
};

const prismaClientSingleton = () => {
	const url = new URL(config.databaseUrl);
	const sslMode = url.searchParams.get("sslmode");
	url.searchParams.delete("sslmode");
	const pool = new Pool({
		connectionString: url.toString(),
		ssl:
			sslMode === "require" || sslMode === "verify-full"
				? { rejectUnauthorized: false }
				: undefined,
	});
	const adapter = new PrismaPg(pool);
	return new PrismaClient({ adapter }).$extends(withAccelerate());
};

const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (config.nodeEnv !== "production") globalForPrisma.prisma = prisma;

export default prisma;
