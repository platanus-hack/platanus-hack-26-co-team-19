import type {
	ChatConversation,
	ChatConversationWithMessages,
} from "../schemas/chat.schema";
import * as chatRepository from "./chat.repository";

export const list = async (userId: string): Promise<ChatConversation[]> => {
	return chatRepository.findAllByUser(userId);
};

export const get = async (
	userId: string,
	id: string,
): Promise<ChatConversationWithMessages> => {
	const conversation = await chatRepository.findByIdForUser(userId, id);
	if (!conversation) {
		throw new Error("Conversation not found");
	}
	return conversation;
};

export const create = async (
	userId: string,
	title?: string,
): Promise<ChatConversation> => {
	return chatRepository.create(userId, title ?? "Nueva conversación");
};

export const updateTitle = async (
	userId: string,
	id: string,
	title: string,
): Promise<ChatConversation> => {
	return chatRepository.updateTitle(userId, id, title);
};

export const upsertMessages = async (
	userId: string,
	id: string,
	messages: Array<{ id: string; role: string; parts: unknown }>,
	title?: string,
): Promise<void> => {
	await get(userId, id);
	await chatRepository.upsertMessages(userId, id, messages, title);
};

export const replaceMessages = upsertMessages;

export const remove = async (userId: string, id: string): Promise<void> => {
	await get(userId, id);
	await chatRepository.remove(userId, id);
};
