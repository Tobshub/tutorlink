'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Pusher from 'pusher-js';
import { CallModal } from './call-modal';
import { api } from '@/trpc/react';
import { useRouter } from 'next/navigation';

export function DashboardClientLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const router = useRouter();
  const [incomingCall, setIncomingCall] = useState<{ from: string } | null>(null);
  const answerCall = api.call.answerCall.useMutation();
  const denyCall = api.call.denyCall.useMutation();

  useEffect(() => {
    if (!user) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`private-${user.id}`);

    channel.bind('incoming-call', (data: { from: string }) => {
      setIncomingCall(data);
    });

    channel.bind('call-answered', () => {
      router.push('/dashboard/calls');
    });
    
    channel.bind('call-denied', () => {
      setIncomingCall(null);
    });

    return () => {
      pusher.unsubscribe(`private-${user.id}`);
    };
  }, [user, router]);

  const handleAnswer = () => {
    if (incomingCall) {
      answerCall.mutate({ to: incomingCall.from });
      router.push('/dashboard/calls');
      setIncomingCall(null);
    }
  };

  const handleDeny = () => {
    if (incomingCall) {
      denyCall.mutate({ to: incomingCall.from });
      setIncomingCall(null);
    }
  };

  return (
    <>
      {children}
      {incomingCall && (
        <CallModal
          callerName={incomingCall.from}
          onAnswer={handleAnswer}
          onDeny={handleDeny}
        />
      )}
    </>
  );
}
