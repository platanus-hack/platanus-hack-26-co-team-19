"use client";

import { MessageSquarePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatConversation } from "@/features/chat/schemas/chat.schema";
import { cn } from "@/lib/utils";

type ConversationHistoryProps = {
	conversations: ChatConversation[];
	selectedId: string | null;
	onSelect: (id: string) => void;
	onCreate: () => void;
	onDelete: (id: string) => void;
	isCreating: boolean;
	errorMessage?: string | null;
	className?: string;
};

const ConversationHistory = ({
	conversations,
	selectedId,
	onSelect,
	onCreate,
	onDelete,
	isCreating,
	errorMessage,
	className,
}: ConversationHistoryProps) => {
	return (
		<div className={cn("flex h-full min-h-0 w-full flex-col", className)}>
			<div className="flex items-center justify-between gap-2 p-3">
				<h2 className="font-medium text-sm">Historial</h2>
				<Button
					size="sm"
					variant="outline"
					onClick={onCreate}
					disabled={isCreating}
				>
					<MessageSquarePlus />
					Nueva
				</Button>
			</div>
			<ScrollArea className="min-h-0 flex-1">
				<div className="flex flex-col gap-1 p-2">
					{errorMessage ? (
						<p className="px-2 text-xs text-destructive">{errorMessage}</p>
					) : conversations.length === 0 ? (
						<p className="px-2 text-xs text-muted-foreground">
							Aún no hay conversaciones.
						</p>
					) : null}
					{conversations.map((conversation) => (
						<div
							key={conversation.id}
							className={cn(
								"flex items-center gap-1 rounded-md",
								selectedId === conversation.id ? "bg-muted" : "",
							)}
						>
							<button
								type="button"
								className="min-w-0 flex-1 truncate px-2 py-2 text-left text-sm"
								onClick={() => onSelect(conversation.id)}
							>
								{conversation.title}
							</button>
							<Button
								size="icon-sm"
								variant="ghost"
								onClick={() => onDelete(conversation.id)}
							>
								<Trash2 />
							</Button>
						</div>
					))}
				</div>
			</ScrollArea>
		</div>
	);
};

export default ConversationHistory;
