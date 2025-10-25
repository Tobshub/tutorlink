'use client';

import { api } from '@/trpc/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';

export default function ChatPage() {
  const { conversationId } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const socketRef = useRef<WebSocket | null>(null);

  const { data: messages, refetch } = api.chat.getMessages.useQuery(
    { conversationId: conversationId as string },
    { enabled: !!conversationId }
  );

  const sendMessage = api.chat.sendMessage.useMutation();
  const [content, setContent] = useState('');

  const currentUser = messages?.find(m => m.sender.clerkUid === user?.id)?.sender;
  const otherUser = messages?.[0]?.conversation?.User.find(
    (u) => u.clerkUid !== user?.id
  );

  useEffect(() => {
    if (!currentUser?.name) {
      return;
    }

    // Connect to the Python WebSocket server
    // Assumes the server is running on localhost:8000
    const ws = new WebSocket(`ws://localhost:8000/ws/${currentUser.name}`);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data as string) as { type: string };
      // If we receive a message, refetch the history from our database
      if (message.type === 'message') {
        void refetch();
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Cleanup on component unmount
    return () => {
      ws.close();
    };
  }, [currentUser?.name, refetch]);

  const handleSendMessage = () => {
    if (!content.trim() || !otherUser?.name) return;

    // First, persist the message in our database via tRPC
    sendMessage.mutate(
      {
        conversationId: conversationId as string,
        content,
      },
      {
        onSuccess: () => {
          // After successful persistence, send it via WebSocket for real-time delivery
          const messagePayload = {
            to_username: otherUser.name,
            content: content,
          };
          socketRef.current?.send(JSON.stringify(messagePayload));
          setContent('');
        },
        onError: (error) => {
          console.error("Failed to send message:", error);
        }
      }
    );
  };

  const handleCall = () => {
    if (otherUser) {
      router.push(`/dashboard/calls?userId=${otherUser.id}`);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-semibold">{otherUser?.name ?? 'Chat'}</h1>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
          onClick={handleCall}
          disabled={!otherUser}
        >
          Call
        </button>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages?.map((message) => (
          <div key={message.id} className="flex items-start gap-2">
            {/* Placeholder for avatar */}
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
            <div>
              <p className="font-semibold">{message.sender.name}</p>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded-lg"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
