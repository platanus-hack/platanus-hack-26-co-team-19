// contact.repository.ts
import { db } from "@/lib/db";
import type {
	Contact,
	CreateContactInput,
	UpdateContactInput,
} from "../schemas/contact.schema";

export const findAll = async (): Promise<Contact[]> => {
	return db.contact.findMany({
		orderBy: { createdAt: "desc" },
	});
};

export const findById = async (id: string): Promise<Contact | null> => {
	return db.contact.findUnique({
		where: { id },
	});
};

export const findByName = async (name: string): Promise<Contact | null> => {
	return db.contact.findFirst({
		where: { name },
	});
};

export const create = async (data: CreateContactInput): Promise<Contact> => {
	return db.contact.create({
		data,
	});
};

export const update = async (
	id: string,
	data: UpdateContactInput,
): Promise<Contact> => {
	const { id: _id, ...rest } = data;
	return db.contact.update({
		where: { id },
		data: rest,
	});
};

export const remove = async (id: string): Promise<void> => {
	await db.contact.delete({
		where: { id },
	});
};
