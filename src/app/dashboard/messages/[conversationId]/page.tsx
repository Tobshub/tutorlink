/* eslint-disable */
'use client';

import { api } from '@/trpc/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import type { AppRouter } from '@/server/api/root';
import type { inferRouterOutputs } from '@trpc/server';
import { toast } from 'sonner';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Message = any;

export default function ChatPage() {
  const { conversationId } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const socketRef = useRef<WebSocket | null>(null);

  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);

  const { data: messages, refetch } = api.chat.getMessages.useQuery(
    { conversationId: conversationId as string },
    { 
      enabled: !!conversationId,
      // @ts-expect-error help
      onSuccess: (data) => {
        // eslint-disable-next-line
        setOptimisticMessages(data);
      }
    }
  );

  const sendMessage = api.chat.sendMessage.useMutation();
  const [content, setContent] = useState('');

  const participants = messages?.[0]?.conversation?.User;
  const currentUser = participants?.find((u) => u.clerkUid === user?.id);
  const otherUser = participants?.find((u) => u.clerkUid !== user?.id);

  useEffect(() => {
    if (!currentUser?.name) {
      return;
    }

    const ws = new WebSocket(`ws://localhost:8000/ws/${currentUser.name}`);
    socketRef.current = ws;

    ws.onopen = () => console.log('WebSocket connection established');
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'message') {
        void refetch();
      }
    };
    ws.onerror = (error) => console.error('WebSocket error:', error);
    ws.onclose = () => console.log('WebSocket connection closed');

    return () => ws.close();
  }, [currentUser?.name, refetch]);

  const handleSendMessage = () => {
    if (!content.trim() || !otherUser?.name || !currentUser) return;

    const tempId = `temp-${Date.now()}`;
    const newMessage: Message = {
      id: tempId,
      content: content,
      sender: currentUser,
      senderId: currentUser.id,
      conversationId: conversationId as string,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sending',
      conversation: {
        id: conversationId as string,
        createdAt: new Date(),
        updatedAt: new Date(),
        User: [],
      },
    };

    // Optimistically add to state
    setOptimisticMessages(prev => [...prev, newMessage]);
    setContent('');

    sendMessage.mutate(
      {
        conversationId: conversationId as string,
        content,
      },
      {
        onSuccess: () => {
          // On success, the query will refetch and replace the temp message.
          // We also send it over WebSocket for the other user.
          const messagePayload = {
            to_username: otherUser.name,
            content: content,
          };
          socketRef.current?.send(JSON.stringify(messagePayload));
          void refetch();
        },
        onError: (error) => {
          toast.error("Failed to send message.");
          // Mark the optimistic message as failed
          setOptimisticMessages(prev => prev.map(msg => 
            msg.id === tempId ? { ...msg, status: 'failed' } : msg
          ));
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
        {optimisticMessages.map((message) => (
          <div key={message.id} className={`flex items-start gap-2 ${message.status === 'sending' ? 'opacity-50' : ''}`}>
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
            <div>
              <p className="font-semibold">{message.sender.name}</p>
              <p>{message.content}</p>
              {message.status === 'failed' && <span className="text-xs text-red-500">Failed to send</span>}
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
