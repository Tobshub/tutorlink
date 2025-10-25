import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const chatRouter = createTRPCRouter({
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({ where: { clerkUid: ctx.user.id }});
    if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });

    return ctx.db.conversation.findMany({
      where: {
        User: {
          some: {
            id: user.id,
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
      const user = await ctx.db.user.findUnique({ where: { clerkUid: ctx.user.id }});
      if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });

      return ctx.db.message.create({
        data: {
          conversationId: input.conversationId,
          content: input.content,
          senderId: user.id,
        },
      });
    }),

  createConversation: protectedProcedure
    .input(z.object({ tutorId: z.string() })) // tutorId is the CUID of the user record
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({ where: { clerkUid: ctx.user.id }});
      if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Current user not found." });

      const existingConversation = await ctx.db.conversation.findFirst({
        where: {
          AND: [
            {
              User: {
                some: {
                  id: user.id,
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
            connect: [{ id: user.id }, { id: input.tutorId }],
          },
        },
      });

      return { conversationId: newConversation.id };
    }),
});
