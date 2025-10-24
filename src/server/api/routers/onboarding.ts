import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

export const onboardingRouter = createTRPCRouter({
  saveOnboardingProfile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        subjectInterests: z.array(z.string()),
        goals: z.array(z.string()),
        learningStyles: z.array(z.string()),
        preferredTutorGender: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          name: input.name,
        },
      });

      await db.studentProfile.upsert({
        where: {
          userId: ctx.user.id,
        },
        update: {
          subjectInterests: input.subjectInterests,
          goals: input.goals,
          learningStyle: input.learningStyles,
          preferredTutorGender: input.preferredTutorGender,
        },
        create: {
          userId: ctx.user.id,
          subjectInterests: input.subjectInterests,
          goals: input.goals,
          learningStyle: input.learningStyles,
          preferredTutorGender: input.preferredTutorGender,
        },
      });
    }),

  getOnboardingProfile: protectedProcedure.query(async ({ ctx }) => {
    return await db.user.findUnique({
      where: {
        id: ctx.user.id,
      },
      include: {
        studentProfile: true,
      },
    });
  }),
});

