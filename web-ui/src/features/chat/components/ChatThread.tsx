"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { UIMessage } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import ChatMessageParts from "@/features/chat/components/ChatMessageParts";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

type ChatThreadProps = {
	conversationId: string;
	messages: UIMessage[];
	generationStatus: "idle" | "running" | "error";
	generationError: string | null;
};

const ChatThread = ({
	conversationId,
	messages,
	generationStatus,
	generationError,
}: ChatThreadProps) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const [input, setInput] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const revalidateChat = useCallback(() => {
		void queryClient.invalidateQueries({
			queryKey: trpc.chat.list.queryKey(),
		});
		void queryClient.invalidateQueries({
			queryKey: trpc.chat.get.queryKey({ id: conversationId }),
		});
	}, [conversationId, queryClient, trpc]);

	const isBusy = generationStatus === "running" || isSubmitting;
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: scroll as new parts arrive
	useEffect(() => {
		if (isBusy) {
			bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
		}
	}, [isBusy, messages]);

	const send = async (text: string) => {
		if (!text || isBusy) {
			return;
		}
		setIsSubmitting(true);
		const userMessage: UIMessage = {
			id: crypto.randomUUID(),
			role: "user",
			parts: [{ type: "text", text }],
		};
		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					conversationId,
					messages: [...messages, userMessage],
				}),
			});
			if (response.status === 409) {
				toast.error("Esta conversación ya está generando una respuesta.");
				revalidateChat();
				return;
			}
			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Error al enviar el mensaje");
			}
			revalidateChat();
		} catch (err) {
			toast.error(
				err instanceof Error ? err.message : "Error al enviar el mensaje",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const onSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const text = input.trim();
		if (!text || isBusy) {
			return;
		}
		setInput("");
		void send(text);
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
					{generationStatus === "running" && !hasAssistantReply ? (
						<p className="text-sm text-muted-foreground">
							Preparando respuesta…
						</p>
					) : null}
					{generationStatus === "error" && generationError ? (
						<p className="text-sm text-destructive">{generationError}</p>
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
							void send(text);
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
