"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ConversationHistory from "@/features/chat/components/ConversationHistory";
import useCreateConversation from "@/features/chat/hooks/useCreateConversation";
import useDeleteConversation from "@/features/chat/hooks/useDeleteConversation";
import useListConversations from "@/features/chat/hooks/useListConversations";

const ChatSidebarHistory = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const selectedId = searchParams.get("id");
	const { conversations, error } = useListConversations();
	const createConversation = useCreateConversation({
		onSuccess: (id) => router.push(`/dashboard/chat?id=${id}`),
	});
	const deleteConversation = useDeleteConversation({
		onSuccess: () => {
			if (selectedId) {
				router.push("/dashboard/chat");
			}
		},
	});

	return (
		<ConversationHistory
			conversations={conversations}
			selectedId={selectedId}
			onSelect={(id) => router.push(`/dashboard/chat?id=${id}`)}
			onCreate={() => createConversation.mutate({})}
			onDelete={(id) => deleteConversation.mutate({ id })}
			isCreating={createConversation.isPending}
			errorMessage={
				error instanceof Error ? error.message : error ? String(error) : null
			}
		/>
	);
};

export default ChatSidebarHistory;
