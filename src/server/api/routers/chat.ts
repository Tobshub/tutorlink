import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { z } from 'zod';

export const chatRouter = createTRPCRouter({
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.conversation.findMany({
      where: {
        User: {
          some: {
            id: ctx.user.id,
          },
        },
      },
      include: {
        User: true,
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });
  }),

  getMessages: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.message.findMany({
        where: {
          conversationId: input.conversationId,
        },
        include: {
          sender: true,
          conversation: { include: { User: true }},
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.message.create({
        data: {
          conversationId: input.conversationId,
          content: input.content,
          senderId: ctx.user.id,
        },
      });
    }),

  createConversation: protectedProcedure
    .input(z.object({ tutorId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingConversation = await ctx.db.conversation.findFirst({
        where: {
          AND: [
            {
              User: {
                some: {
                  id: ctx.user.id,
                },
              },
            },
            {
              User: {
                some: {
                  id: input.tutorId,
                },
              },
            },
          ],
        },
      });

      if (existingConversation) {
        return { conversationId: existingConversation.id };
      }

      const newConversation = await ctx.db.conversation.create({
        data: {
          User: {
            connect: [{ clerkUid: ctx.user.id }, { id: input.tutorId }],
          },
        },
      });

      return { conversationId: newConversation.id };
    }),
});
