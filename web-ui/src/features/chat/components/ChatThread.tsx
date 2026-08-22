"use client";

import { useChat } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
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

	const { messages, sendMessage, status, error } = useChat({
		id: conversationId,
		messages: initialMessages,
		transport,
		onFinish: () => {
			void queryClient.invalidateQueries(trpc.chat.list.queryOptions());
			void queryClient.invalidateQueries(
				trpc.chat.get.queryOptions({ id: conversationId }),
			);
		},
		onError: (err) => {
			toast.error(err.message || "Error al enviar el mensaje");
		},
	});

	const isBusy = status === "submitted" || status === "streaming";
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (status === "submitted" || status === "streaming") {
			bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
		}
	}, [status, messages]);

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
							<ChatMessageParts message={message} />
						</div>
					))}
					{status === "submitted" ? (
						<p className="text-sm text-muted-foreground">
							Preparando respuesta…
						</p>
					) : null}
					{error ? (
						<p className="text-sm text-destructive">{error.message}</p>
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
