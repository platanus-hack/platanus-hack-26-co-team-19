// contact.service.ts

import type {
	Contact,
	CreateContactInput,
	UpdateContactInput,
} from "../schemas/contact.schema";
import * as contactRepository from "./contact.repository";

export const list = async (): Promise<Contact[]> => {
	return contactRepository.findAll();
};

export const get = async (id: string): Promise<Contact> => {
	const contact = await contactRepository.findById(id);
	if (!contact) {
		throw new Error("Contact not found");
	}
	return contact;
};

export const create = async (data: CreateContactInput): Promise<Contact> => {
	const existing = await contactRepository.findByName(data.name);
	if (existing) {
		throw new Error("Contact already exists");
	}
	return contactRepository.create(data);
};

export const update = async (
	id: string,
	data: UpdateContactInput,
): Promise<Contact> => {
	const contact = await contactRepository.findById(id);
	if (!contact) {
		throw new Error("Contact not found");
	}
	return contactRepository.update(id, data);
};

export const remove = async (id: string): Promise<void> => {
	const contact = await contactRepository.findById(id);
	if (!contact) {
		throw new Error("Contact not found");
	}
	await contactRepository.remove(id);
};
