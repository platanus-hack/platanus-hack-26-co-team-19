// user.service.ts

import type {
	CreateUserInput,
	UpdateUserInput,
	User,
} from "../schemas/user.schema";
import * as userRepository from "./user.repository";

export const list = async (): Promise<User[]> => {
	return userRepository.findAll();
};

export const get = async (id: string): Promise<User> => {
	const user = await userRepository.findById(id);
	if (!user) {
		throw new Error("User not found");
	}
	return user;
};

export const create = async (data: CreateUserInput): Promise<User> => {
	const existing = await userRepository.findByName(data.email);
	if (existing) {
		throw new Error("User already exists");
	}
	return userRepository.create(data);
};

export const update = async (
	id: string,
	data: UpdateUserInput,
): Promise<User> => {
	const user = await userRepository.findById(id);
	if (!user) {
		throw new Error("User not found");
	}
	return userRepository.update(id, data);
};

export const remove = async (id: string): Promise<void> => {
	const user = await userRepository.findById(id);
	if (!user) {
		throw new Error("User not found");
	}
	await userRepository.remove(id);
};
