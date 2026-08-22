import ChatWorkspace from "@/features/chat/components/ChatWorkspace";

const ChatView = () => {
	return (
		<div className="flex flex-col gap-4">
			<div>
				<h1 className="font-semibold text-2xl">Chat</h1>
				<p className="text-muted-foreground text-sm">
					Conversaciones con DeepSeek y tools del MCP del Consejo de Estado.
				</p>
			</div>
			<ChatWorkspace />
		</div>
	);
};

export default ChatView;
