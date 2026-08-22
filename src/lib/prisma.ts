import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "@/generated/prisma/client";
import config from "./config";

const globalForPrisma = global as unknown as {
	prisma: PrismaClient;
};

const prismaClientSingleton = () => {
	if (config.nodeEnv !== "production") {
		const connectionString = config.databaseUrl;
		const adapter = new PrismaPg({ connectionString });
		return new PrismaClient({ adapter }).$extends(withAccelerate());
	} else {
		const connectionString = config.databaseUrl;
		const adapter = new PrismaNeon({ connectionString });
		return new PrismaClient({ adapter }).$extends(withAccelerate());
	}
};

const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (config.nodeEnv !== "production") globalForPrisma.prisma = prisma;

export default prisma;
