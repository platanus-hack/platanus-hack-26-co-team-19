"use client";

import type { UIMessage } from "ai";
import { Loader2 } from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ChatMarkdown from "@/features/chat/components/ChatMarkdown";
import { formatMcpOutput } from "@/features/chat/lib/format-mcp-output";

type ChatMessagePartsProps = {
	message: UIMessage;
	hideAssistantTextUntilComplete?: boolean;
};

const PREVIEW_MAX = 120;

const isToolPart = (part: UIMessage["parts"][number]) =>
	part.type === "dynamic-tool" || part.type.startsWith("tool-");

const truncatePreview = (value: string) => {
	const compact = value.replace(/\s+/g, " ").trim();
	if (compact.length <= PREVIEW_MAX) {
		return compact;
	}
	return `${compact.slice(0, PREVIEW_MAX)}…`;
};

const mcpStateLabel = (state: string) => {
	if (state === "output-available") {
		return "Listo";
	}
	if (state === "output-error" || state === "output-denied") {
		return "Error";
	}
	if (
		state === "input-streaming" ||
		state === "input-available" ||
		state === "approval-requested"
	) {
		return "Consultando…";
	}
	return state;
};

const ChatMessageParts = ({
	message,
	hideAssistantTextUntilComplete = false,
}: ChatMessagePartsProps) => {
	let assistantTextLoaderShown = false;
	let textOrdinal = 0;

	return (
		<div className="flex flex-col gap-2">
			{message.parts.map((part) => {
				if (part.type === "text") {
					const textKey = `${message.id}-text-${textOrdinal}`;
					textOrdinal += 1;
					if (message.role === "assistant") {
						if (hideAssistantTextUntilComplete) {
							if (assistantTextLoaderShown) {
								return null;
							}
							assistantTextLoaderShown = true;
							return (
								<p
									key={`${message.id}-text-loading`}
									className="flex items-center gap-2 text-sm text-muted-foreground"
								>
									<Loader2 className="size-4 animate-spin" />
									Cargando…
								</p>
							);
						}
						return <ChatMarkdown key={textKey} text={part.text} />;
					}
					return (
						<div
							key={textKey}
							className="whitespace-pre-wrap text-sm leading-relaxed"
						>
							{part.text}
						</div>
					);
				}

				if (part.type === "reasoning") {
					const isStreaming = part.state === "streaming";
					const preview = truncatePreview(part.text ?? "");
					return (
						<Collapsible
							key={`${message.id}-reasoning-${part.id ?? "0"}`}
							defaultOpen={false}
							className="rounded-md border border-dashed bg-background/60"
						>
							<CollapsibleTrigger className="flex w-full items-start justify-between gap-2 px-3 py-2 text-left text-xs font-medium">
								<span className="flex min-w-0 flex-1 items-center gap-2">
									{isStreaming ? (
										<Loader2 className="size-3 shrink-0 animate-spin" />
									) : null}
									<span className="shrink-0">
										{isStreaming ? "Pensando…" : "Razonamiento"}
									</span>
									{preview ? (
										<span className="truncate font-normal text-muted-foreground">
											{preview}
										</span>
									) : null}
								</span>
								<span className="shrink-0 text-muted-foreground">
									ver contenido
								</span>
							</CollapsibleTrigger>
							<CollapsibleContent className="border-t px-3 py-2">
								<p className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
									{part.text || (isStreaming ? "Generando pensamiento…" : "")}
								</p>
							</CollapsibleContent>
						</Collapsible>
					);
				}

				if (isToolPart(part)) {
					const toolName =
						part.type === "dynamic-tool"
							? part.toolName
							: part.type.replace(/^tool-/, "");
					const toolCallId =
						"toolCallId" in part ? String(part.toolCallId) : toolName;
					const state = "state" in part ? String(part.state) : "unknown";
					const input = "input" in part ? part.input : undefined;
					const output = "output" in part ? part.output : undefined;
					const errorText = "errorText" in part ? part.errorText : undefined;
					const formatted = formatMcpOutput(output);
					const isPending = !formatted && !errorText;
					const label = mcpStateLabel(state);
					const previewSource = errorText ?? formatted ?? "";
					const preview = previewSource
						? truncatePreview(previewSource)
						: "Consultando…";

					return (
						<Collapsible
							key={`${message.id}-tool-${toolCallId}`}
							defaultOpen={false}
							className="rounded-md border bg-muted/40"
						>
							<CollapsibleTrigger className="flex w-full items-start justify-between gap-2 px-3 py-2 text-left text-xs font-medium">
								<span className="flex min-w-0 flex-1 flex-col gap-0.5">
									<span className="flex items-center gap-2">
										{isPending ? (
											<Loader2 className="size-3 shrink-0 animate-spin" />
										) : null}
										MCP · {toolName} · {label}
									</span>
									<span className="truncate font-normal text-muted-foreground">
										{preview}
									</span>
								</span>
								<span className="shrink-0 text-muted-foreground">
									ver contenido
								</span>
							</CollapsibleTrigger>
							<CollapsibleContent className="border-t px-3 py-2">
								{input != null ? (
									<div className="mb-2">
										<p className="mb-1 text-xs font-medium text-muted-foreground">
											Argumentos
										</p>
										<pre className="max-h-64 overflow-auto whitespace-pre-wrap break-all rounded bg-background p-2 text-xs">
											{JSON.stringify(input, null, 2)}
										</pre>
									</div>
								) : null}
								{isPending ? (
									<p className="flex items-center gap-2 text-xs text-muted-foreground">
										<Loader2 className="size-3 animate-spin" />
										Cargando resultado MCP…
									</p>
								) : null}
								{errorText ? (
									<pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap break-all rounded bg-background p-2 text-xs text-destructive">
										{errorText}
									</pre>
								) : null}
								{formatted ? (
									<div>
										<p className="mb-1 text-xs font-medium text-muted-foreground">
											Resultado MCP (completo)
										</p>
										<pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap break-all rounded bg-background p-2 text-xs">
											{formatted}
										</pre>
									</div>
								) : null}
							</CollapsibleContent>
						</Collapsible>
					);
				}

				return null;
			})}
			{hideAssistantTextUntilComplete &&
			message.role === "assistant" &&
			!assistantTextLoaderShown ? (
				<p className="flex items-center gap-2 text-sm text-muted-foreground">
					<Loader2 className="size-4 animate-spin" />
					Cargando…
				</p>
			) : null}
		</div>
	);
};

export default ChatMessageParts;
