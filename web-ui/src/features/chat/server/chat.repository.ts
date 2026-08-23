import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import type {
	ChatConversation,
	ChatConversationWithMessages,
	ChatMessage,
} from "../schemas/chat.schema";

const conversationSelect = {
	id: true,
	userId: true,
	title: true,
	createdAt: true,
	updatedAt: true,
} satisfies Prisma.ChatConversationSelect;

export const findAllByUser = async (
	userId: string,
): Promise<ChatConversation[]> => {
	return db.chatConversation.findMany({
		where: { userId },
		orderBy: { updatedAt: "desc" },
		select: conversationSelect,
	});
};

export const findByIdForUser = async (
	userId: string,
	id: string,
): Promise<ChatConversationWithMessages | null> => {
	return db.chatConversation.findFirst({
		where: { id, userId },
		select: {
			...conversationSelect,
			messages: {
				orderBy: { createdAt: "asc" },
				select: {
					id: true,
					conversationId: true,
					role: true,
					parts: true,
					createdAt: true,
				},
			},
		},
	});
};

export const create = async (
	userId: string,
	title: string,
): Promise<ChatConversation> => {
	return db.chatConversation.create({
		data: { userId, title },
		select: conversationSelect,
	});
};

export const updateTitle = async (
	userId: string,
	id: string,
	title: string,
): Promise<ChatConversation> => {
	await db.chatConversation.updateMany({
		where: { id, userId },
		data: { title },
	});
	const row = await db.chatConversation.findFirst({
		where: { id, userId },
		select: conversationSelect,
	});
	if (!row) {
		throw new Error("Conversation not found");
	}
	return row;
};

const toJsonParts = (parts: unknown): Prisma.InputJsonValue =>
	JSON.parse(JSON.stringify(parts ?? [])) as Prisma.InputJsonValue;

export const upsertMessages = async (
	userId: string,
	id: string,
	messages: Array<{ id: string; role: string; parts: unknown }>,
	title?: string,
): Promise<void> => {
	const existing = await db.chatConversation.findFirst({
		where: { id, userId },
		select: { id: true, title: true },
	});
	if (!existing) {
		throw new Error("Conversation not found");
	}

	const uniqueMessages = [
		...new Map(messages.map((message) => [message.id, message])).values(),
	];
	if (uniqueMessages.length === 0) {
		return;
	}

	const stored = await db.chatMessage.findMany({
		where: { conversationId: id },
		select: { id: true },
	});
	const storedIds = new Set(stored.map((row) => row.id));
	const createdAtBase = Date.now();

	await db.$transaction(async (tx) => {
		for (const [index, message] of uniqueMessages.entries()) {
			const parts = toJsonParts(message.parts);
			if (storedIds.has(message.id)) {
				await tx.chatMessage.update({
					where: { id: message.id },
					data: { role: message.role, parts },
				});
				continue;
			}
			await tx.chatMessage.create({
				data: {
					id: message.id,
					conversationId: id,
					role: message.role,
					parts,
					createdAt: new Date(createdAtBase + index),
				},
			});
			storedIds.add(message.id);
		}

		const shouldSetTitle =
			Boolean(title) && existing.title === "Nueva conversación";

		await tx.chatConversation.update({
			where: { id },
			data: {
				...(shouldSetTitle ? { title } : {}),
				updatedAt: new Date(),
			},
		});
	});
};

export const replaceMessages = upsertMessages;

export const remove = async (userId: string, id: string): Promise<void> => {
	const result = await db.chatConversation.deleteMany({
		where: { id, userId },
	});
	if (result.count === 0) {
		throw new Error("Conversation not found");
	}
};

export type { ChatMessage };
