import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { invokeModel } from "@/server/bedrock";
import { TRPCError } from "@trpc/server";

// TODO: Implement student profile creation and updates
export const studentRouter = createTRPCRouter({
  createProfile: protectedProcedure
    .input(
      z.object({
        goals: z.array(z.string()),
        learningStyle: z.array(z.string()),
        preferredTutorGender: z.string().optional(),
        subjectsOfInterest: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const clerkUser = ctx.user;
      const name = `${clerkUser.firstName} ${clerkUser.lastName}`;
      const email = clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId,
      )?.emailAddress;

      if (!email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No primary email address found for user.",
        });
      }

      const profile = await ctx.db.$transaction(async (tx) => {
        const user = await tx.user.upsert({
          where: { clerkUid: clerkUser.id },
          update: { name, email },
          create: {
            clerkUid: clerkUser.id,
            name,
            email,
            role: "STUDENT",
          },
        });

        const existingProfile = await tx.studentProfile.findUnique({
          where: { userId: user.id },
        });

        if (existingProfile) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Student profile already exists.",
          });
        }

        const newProfile = await tx.studentProfile.create({
          data: {
            userId: user.id,
            goals: input.goals,
            learningStyle: input.learningStyle,
            preferredTutorGender: input.preferredTutorGender,
            subjectInterests: input.subjectsOfInterest,
          },
        });

        const embeddingText = `
                    This text describes a student profile for an AI tutoring match system.
                    Learning Goals:
                    ${input.goals.map((g) => `- ${g}`).join("\n")}
                    Subjects of Interest:
                    ${input.subjectsOfInterest.map((s) => `- ${s}`).join("\n")}
                    Preferred Learning Styles:
                    ${input.learningStyle.map((l) => `- ${l}`).join("\n")}
                `;

        const { embedding } = await invokeModel(embeddingText);

        await tx.studentProfile.update({
          where: { id: newProfile.id },
          data: { embedding },
        });

        return newProfile;
      }, { timeout: 10_000 });

      return {
        success: true,
        message: "Student profile created successfully",
        profile,
      };
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkUid: ctx.user.id },
    });
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
    }
    const profile = await ctx.db.studentProfile.findUnique({
      where: { userId: user.id },
    });
    return profile;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        goals: z.array(z.string()).optional(),
        learningStyle: z.array(z.string()).optional(),
        preferredTutorGender: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkUid: ctx.user.id },
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
      }

      const updatedProfile = await ctx.db.studentProfile.update({
        where: { userId: user.id },
        data: {
          ...input,
        },
      });

      const { embedding } = await invokeModel(`
This text describes a student profile for an AI tutoring match system.

Learning Goals:
${updatedProfile.goals.map((g) => `- ${g}`).join("\n")}

Subjects of Interest:
${updatedProfile.subjectInterests.map((s) => `- ${s}`).join("\n")}

Preferred Learning Styles:
${updatedProfile.learningStyle.map((l) => `- ${l}`).join("\n")}
`);
      await ctx.db.studentProfile.update({
        where: { id: updatedProfile.id },
        data: { embedding },
      });
      return {
        success: true,
        message: "Student profile updated successfully",
        profile: updatedProfile,
      };
    }),

  // Health check
  health: publicProcedure.query(() => "Student router is healthy"),

  getTutorMatches: protectedProcedure.query(async ({ ctx }) => {
    // const studentProfile = await ctx.db.studentProfile.findFirst({
    //   where: { user: { clerkUid: ctx.user.id } },
    // });
    //
    // if (!studentProfile) {
    //   throw new TRPCError({
    //     code: "NOT_FOUND",
    //     message: "Student profile not found",
    //   });
    // }
    //
    // const tutors = await ctx.db.$queryRaw<
    //   { id: string; userId: string; name: string; email: string; similarity: number; yearsOfExperience: number; }[]
    // >`
    //             SELECT "TutorProfile".*, "User"."name", "User"."email", 1 - ("TutorProfile"."embedding"::vector <=> (SELECT "embedding"::vector FROM "StudentProfile" WHERE "id" = ${studentProfile.id})) as similarity
    //             FROM "TutorProfile"
    //             JOIN "User" ON "TutorProfile"."userId" = "User"."id"
    //             ORDER BY similarity DESC
    //             LIMIT 15
    //         `;
    const tutors = await ctx.db.tutorProfile.findMany({ take: 10, include: { user: true } });

    return tutors;
  }),
});
