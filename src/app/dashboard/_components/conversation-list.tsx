"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export function ConversationList() {
  const router = useRouter();
  const { data: conversations, isLoading } =
    api.chat.getConversations.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-2">
      {conversations && conversations.length
        ? conversations?.map((conversation) => (
            <div
              key={conversation.id}
              className="cursor-pointer rounded-lg border p-4"
              onClick={() =>
                router.push(`/dashboard/messages/${conversation.id}`)
              }
            >
              <p className="font-semibold">
                {conversation.users.map((user) => user.name).join(", ")}
              </p>
              <p className="text-sm text-gray-500">
                {conversation.messages[0]?.content}
              </p>
            </div>
          ))
        : "No conversations"}
    </div>
  );
}
