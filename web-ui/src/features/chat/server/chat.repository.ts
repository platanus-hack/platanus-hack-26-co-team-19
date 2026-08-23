import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import {
	type ChatConversation,
	type ChatConversationWithMessages,
	type ChatMessage,
	chatGenerationStatusSchema,
} from "../schemas/chat.schema";

const conversationSelect = {
	id: true,
	userId: true,
	title: true,
	generationStatus: true,
	generationError: true,
	createdAt: true,
	updatedAt: true,
} satisfies Prisma.ChatConversationSelect;

const toGenerationStatus = (
	value: string,
): ChatConversation["generationStatus"] => {
	const parsed = chatGenerationStatusSchema.safeParse(value);
	return parsed.success ? parsed.data : "idle";
};

const mapConversation = <T extends { generationStatus: string }>(
	row: T,
): Omit<T, "generationStatus"> & {
	generationStatus: ChatConversation["generationStatus"];
} => ({
	...row,
	generationStatus: toGenerationStatus(row.generationStatus),
});

export const findAllByUser = async (
	userId: string,
): Promise<ChatConversation[]> => {
	return db.chatConversation
		.findMany({
			where: { userId },
			orderBy: { updatedAt: "desc" },
			select: conversationSelect,
		})
		.then((rows) => rows.map(mapConversation));
};

export const findByIdForUser = async (
	userId: string,
	id: string,
): Promise<ChatConversationWithMessages | null> => {
	const row = await db.chatConversation.findFirst({
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
	return row ? mapConversation(row) : null;
};

export const create = async (
	userId: string,
	title: string,
): Promise<ChatConversation> => {
	return mapConversation(
		await db.chatConversation.create({
			data: { userId, title },
			select: conversationSelect,
		}),
	);
};

export const setGenerationStatus = async (
	userId: string,
	id: string,
	generationStatus: string,
	generationError?: string | null,
): Promise<void> => {
	const result = await db.chatConversation.updateMany({
		where: { id, userId },
		data: {
			generationStatus,
			generationError: generationError ?? null,
			updatedAt: new Date(),
		},
	});
	if (result.count === 0) {
		throw new Error("Conversation not found");
	}
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
	return mapConversation(row);
};

const MAX_JSON_CHARS = 400_000;

const compactParts = (parts: unknown): unknown => {
	if (!Array.isArray(parts)) {
		return parts ?? [];
	}
	return parts.map((part) => {
		if (!part || typeof part !== "object") {
			return part;
		}
		const record = part as Record<string, unknown>;
		if (typeof record.type === "string" && record.type === "text") {
			return {
				type: "text",
				text: typeof record.text === "string" ? record.text : "",
			};
		}
		if (
			record.type === "dynamic-tool" ||
			(typeof record.type === "string" && record.type.startsWith("tool-"))
		) {
			return {
				type: record.type,
				toolName: record.toolName,
				toolCallId: record.toolCallId,
				state: record.state,
				input: record.input,
				errorText: record.errorText,
			};
		}
		if (record.type === "reasoning") {
			return {
				type: "reasoning",
				text: typeof record.text === "string" ? record.text : "",
			};
		}
		return part;
	});
};

const toJsonParts = (parts: unknown): Prisma.InputJsonValue => {
	const serialize = (value: unknown): Prisma.InputJsonValue | null => {
		try {
			const serialized = JSON.stringify(value ?? []);
			if (serialized.length > MAX_JSON_CHARS) {
				return null;
			}
			return JSON.parse(serialized) as Prisma.InputJsonValue;
		} catch {
			return null;
		}
	};

	return (
		serialize(parts) ??
		serialize(compactParts(parts)) ??
		([] as Prisma.InputJsonValue)
	);
};

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

	const createdAtBase = Date.now();

	await db.$transaction(async (tx) => {
		for (const [index, message] of uniqueMessages.entries()) {
			const parts = toJsonParts(message.parts);
			await tx.chatMessage.upsert({
				where: { id: message.id },
				create: {
					id: message.id,
					conversationId: id,
					role: message.role,
					parts,
					createdAt: new Date(createdAtBase + index),
				},
				update: { role: message.role, parts },
			});
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
