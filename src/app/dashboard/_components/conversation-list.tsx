"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function ConversationList() {
  const router = useRouter();
  const { user } = useUser();
  const { data: conversations, isLoading } =
    api.chat.getConversations.useQuery();
  const initiateCall = api.call.initiateCall.useMutation();

  const handleCall = (to: string, callerName: string) => {
    initiateCall.mutate({ to, callerName });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-2">
      {conversations?.length
        ? conversations?.map((conversation) => {
            const otherUser = conversation.User.find((u) => u.clerkUid !== user?.id);
            return (
              <div
                key={conversation.id}
                className="cursor-pointer rounded-lg border p-4 flex justify-between items-center"
              >
                <div
                  onClick={() =>
                    router.push(`/dashboard/messages/${conversation.id}`)
                  }
                  className="flex-grow"
                >
                  <p className="font-semibold">
                    {conversation.User.map((user) => user.name).join(", ")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {conversation.messages[0]?.content}
                  </p>
                </div>
                {otherUser && user?.fullName && (
                  <Button
                    onClick={() => handleCall(otherUser.clerkUid, user.fullName!)}
                  >
                    Call
                  </Button>
                )}
              </div>
            );
          })
        : "No conversations"}
    </div>
  );
}
