// user.repository.ts
import { db } from "@/lib/db";
import type {
	CreateUserInput,
	UpdateUserInput,
	User,
} from "../schemas/user.schema";

export const findAll = async (): Promise<User[]> => {
	return db.user.findMany({
		orderBy: { createdAt: "desc" },
	});
};

export const findById = async (id: string): Promise<User | null> => {
	return db.user.findUnique({
		where: { id },
	});
};

export const findByName = async (name: string): Promise<User | null> => {
	return db.user.findFirst({
		where: { email: name },
	});
};

export const create = async (data: CreateUserInput): Promise<User> => {
	return db.user.create({
		data,
	});
};

export const update = async (
	id: string,
	data: UpdateUserInput,
): Promise<User> => {
	const { id: _id, ...rest } = data;
	return db.user.update({
		where: { id },
		data: rest,
	});
};

export const remove = async (id: string): Promise<void> => {
	await db.user.delete({
		where: { id },
	});
};
