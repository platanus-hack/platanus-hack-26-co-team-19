"use client";

import { useChat } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import ChatMessageParts from "@/features/chat/components/ChatMessageParts";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

type ChatThreadProps = {
	conversationId: string;
	initialMessages: UIMessage[];
};

const ChatThread = ({ conversationId, initialMessages }: ChatThreadProps) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const [input, setInput] = useState("");
	const transport = useMemo(
		() =>
			new DefaultChatTransport({
				api: "/api/chat",
				body: { conversationId },
			}),
		[conversationId],
	);

	const revalidateChat = useCallback(() => {
		void queryClient.invalidateQueries({
			queryKey: trpc.chat.list.queryKey(),
		});
		void queryClient.invalidateQueries({
			queryKey: trpc.chat.get.queryKey({ id: conversationId }),
		});
	}, [conversationId, queryClient, trpc]);

	const { messages, sendMessage, status, error } = useChat({
		id: conversationId,
		messages: initialMessages,
		transport,
		onFinish: () => {
			revalidateChat();
		},
		onError: (err) => {
			const isNetwork =
				err instanceof TypeError &&
				(err.message.toLowerCase().includes("fetch") ||
					err.message.toLowerCase().includes("network"));
			toast.error(
				isNetwork
					? "Se cortó la conexión al cerrar el stream. Si ves la respuesta, ya está generada."
					: err.message || "Error al enviar el mensaje",
			);
		},
	});

	const isBusy = status === "submitted" || status === "streaming";
	const lastAssistantId = [...messages]
		.reverse()
		.find((message) => message.role === "assistant")?.id;
	const hasAssistantReply = messages.some(
		(message) =>
			message.role === "assistant" &&
			message.parts.some(
				(part) =>
					(part.type === "text" && "text" in part && part.text.trim()) ||
					part.type === "reasoning" ||
					part.type === "dynamic-tool" ||
					part.type.startsWith("tool-"),
			),
	);
	const bottomRef = useRef<HTMLDivElement>(null);
	const previousStatusRef = useRef(status);

	// biome-ignore lint/correctness/useExhaustiveDependencies: scroll as new parts arrive
	useEffect(() => {
		if (status === "submitted" || status === "streaming") {
			bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
		}
	}, [status, messages]);

	useEffect(() => {
		const previous = previousStatusRef.current;
		previousStatusRef.current = status;
		const wasBusy = previous === "submitted" || previous === "streaming";
		const isSettled = status === "ready" || status === "error";
		if (wasBusy && isSettled) {
			revalidateChat();
		}
	}, [revalidateChat, status]);

	const onSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const text = input.trim();
		if (!text || isBusy) {
			return;
		}
		setInput("");
		void sendMessage({ text });
	};

	return (
		<div className="flex h-full min-h-0 flex-col">
			<ScrollArea className="min-h-0 flex-1">
				<div className="flex flex-col gap-4 p-4">
					{messages.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							Pregunta por providencias, ponentes o votos. El modelo usará el
							MCP del Consejo de Estado.
						</p>
					) : null}
					{messages.map((message) => (
						<div
							key={message.id}
							className={cn(
								"max-w-[90%] rounded-lg px-3 py-2",
								message.role === "user"
									? "ml-auto bg-primary text-primary-foreground"
									: "bg-muted",
							)}
						>
							<p className="mb-1 text-[10px] uppercase tracking-wide opacity-70">
								{message.role === "user" ? "Tú" : "Asistente"}
							</p>
							<ChatMessageParts
								message={message}
								hideAssistantTextUntilComplete={
									isBusy &&
									message.role === "assistant" &&
									message.id === lastAssistantId
								}
							/>
						</div>
					))}
					{status === "submitted" ? (
						<p className="text-sm text-muted-foreground">
							Preparando respuesta…
						</p>
					) : null}
					{error && status === "error" && !hasAssistantReply ? (
						<p className="text-sm text-destructive">
							{error.message.toLowerCase().includes("network") ||
							error.message.toLowerCase().includes("fetch")
								? "No se pudo confirmar el cierre del stream. Revisa si la respuesta ya apareció arriba."
								: error.message}
						</p>
					) : null}
					<div ref={bottomRef} />
				</div>
			</ScrollArea>
			<form onSubmit={onSubmit} className="border-t p-3">
				<Textarea
					value={input}
					onChange={(event) => setInput(event.target.value)}
					placeholder="Escribe un mensaje…"
					className="mb-2 min-h-16"
					onKeyDown={(event) => {
						if (event.key === "Enter" && !event.shiftKey) {
							event.preventDefault();
							const text = input.trim();
							if (!text || isBusy) {
								return;
							}
							setInput("");
							void sendMessage({ text });
						}
					}}
				/>
				<div className="flex justify-end">
					<Button type="submit" disabled={isBusy || !input.trim()}>
						{isBusy ? "Pensando…" : "Enviar"}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default ChatThread;
