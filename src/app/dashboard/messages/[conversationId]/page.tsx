'use client';

import { api } from '@/trpc/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useUser } from '@clerk/nextjs';

const socket = io('http://localhost:9000');

export default function ChatPage() {
  const { conversationId } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { data: messages, refetch } = api.chat.getMessages.useQuery({
    conversationId: conversationId as string,
  });
  const sendMessage = api.chat.sendMessage.useMutation();
  const [content, setContent] = useState('');

  const otherUser = messages?.[0]?.conversation.users.find(
    (u) => u.id !== user?.id
  );

  useEffect(() => {
    socket.emit('join', conversationId);

    socket.on('message', () => {
      refetch();
    });

    return () => {
      socket.off('message');
    };
  }, [conversationId, refetch]);

  const handleSendMessage = () => {
    sendMessage.mutate(
      {
        conversationId: conversationId as string,
        content,
      },
      {
        onSuccess: () => {
          socket.emit('message', conversationId, content);
          setContent('');
        },
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
        <h1 className="text-xl font-semibold">{otherUser?.name}</h1>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
          onClick={handleCall}
        >
          Call
        </button>
      </div>
      <div className="flex-1 p-4 space-y-4">
        {messages?.map((message) => (
          <div key={message.id} className="flex items-start gap-2">
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
