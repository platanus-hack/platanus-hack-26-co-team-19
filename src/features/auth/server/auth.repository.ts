// auth.repository.ts
import { db } from "@/lib/db";

export type AuthUser = {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export const findById = async (id: string): Promise<AuthUser | null> => {
	return db.user.findUnique({
		where: { id },
	});
};

export const findByEmail = async (email: string): Promise<AuthUser | null> => {
	return db.user.findFirst({
		where: { email },
	});
};

export const findByName = async (name: string): Promise<AuthUser | null> => {
	return db.user.findFirst({
		where: { name },
	});
};
