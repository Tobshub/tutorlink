import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { z } from 'zod';
import { pusher } from '@/server/pusher';

export const callRouter = createTRPCRouter({
  initiateCall: protectedProcedure
    .input(z.object({ to: z.string(), callerName: z.string() }))
    .mutation(({ input }) => {
      pusher.trigger(`private-${input.to}`, 'incoming-call', {
        from: input.callerName,
      });
      return { success: true };
    }),

  answerCall: protectedProcedure
    .input(z.object({ to: z.string() }))
    .mutation(({ input }) => {
      pusher.trigger(`private-${input.to}`, 'call-answered', {});
      return { success: true };
    }),

  denyCall: protectedProcedure
    .input(z.object({ to: z.string() }))
    .mutation(({ input }) => {
      pusher.trigger(`private-${input.to}`, 'call-denied', {});
      return { success: true };
    }),
});
