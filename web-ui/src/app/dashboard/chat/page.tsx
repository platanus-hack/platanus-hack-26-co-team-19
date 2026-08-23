import { Suspense } from "react";
import ChatView from "@/features/chat/views/ChatView";

export default function ChatPage() {
	return (
		<Suspense fallback={null}>
			<ChatView />
		</Suspense>
	);
}
