"use client";

import type { UIMessage } from "ai";
import { useSearchParams } from "next/navigation";
import ChatThread from "@/features/chat/components/ChatThread";
import useGetConversation from "@/features/chat/hooks/useGetConversation";

const toUiMessages = (
	messages: Array<{ id: string; role: string; parts: unknown }>,
): UIMessage[] =>
	messages.map((message) => ({
		id: message.id,
		role: message.role as UIMessage["role"],
		parts: message.parts as UIMessage["parts"],
	}));

const ChatWorkspace = () => {
	const searchParams = useSearchParams();
	const selectedId = searchParams.get("id");
	const { conversation, isLoading } = useGetConversation({ id: selectedId });

	if (!selectedId) {
		return (
			<div className="flex h-[calc(100vh-8rem)] min-h-[28rem] items-center justify-center rounded-lg border text-center text-sm text-muted-foreground">
				Selecciona o crea una conversación en el menú lateral.
			</div>
		);
	}

	if (isLoading || !conversation) {
		return (
			<p className="p-4 text-sm text-muted-foreground">
				Cargando conversación…
			</p>
		);
	}

	return (
		<div className="h-[calc(100vh-8rem)] min-h-[28rem] overflow-hidden rounded-lg border">
			<ChatThread
				key={conversation.id}
				conversationId={conversation.id}
				initialMessages={toUiMessages(conversation.messages)}
			/>
		</div>
	);
};

export default ChatWorkspace;
