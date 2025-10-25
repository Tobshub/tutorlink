import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { invokeModel } from "@/server/bedrock";
import { TRPCError } from "@trpc/server";

// TODO: Implement student profile creation and updates
export const studentRouter = createTRPCRouter({
    createProfile: protectedProcedure
        .input(z.object({
            goals: z.array(z.string()),
            learningStyle: z.array(z.string()),
            preferredTutorGender: z.string().optional(),
            subjectsOfInterest: z.array(z.string()),
        }))
        .mutation(async ({ ctx, input }) => {
            const existingProfile = await ctx.db.studentProfile.findUnique({
                where: { userId: ctx.userId },
            });

            if (existingProfile) {
                return { success: false, message: "Student profile already exists" };
            }

            const profile = await ctx.db.studentProfile.create({
                data: {
                    userId: ctx.userId,
                    goals: input.goals,
                    learningStyle: input.learningStyle,
                    preferredTutorGender: input.preferredTutorGender,
                    subjectInterests: [],
                },
            });

            const { embedding } = await invokeModel(`
This text describes a student profile for an AI tutoring match system.

Learning Goals:
${input.goals.map((g) => `- ${g}`).join("\n")}

Subjects of Interest:
${input.subjectsOfInterest.map((s) => `- ${s}`).join("\n")}

Preferred Learning Styles:
${input.learningStyle.map((l) => `- ${l}`).join("\n")}
`);
            const res = await ctx.db.$executeRaw`UPDATE "StudentProfile" SET "embedding" = ${JSON.stringify(embedding)}::vector WHERE "id" = ${profile.id}`
            if (res !== 1) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update profile" });
            }

            return { success: true, message: "Student profile created successfully", profile };
        }),

    getProfile: protectedProcedure
        .query(async ({ ctx }) => {
            const profile = await ctx.db.studentProfile.findUnique({
                where: { userId: ctx.userId },
            });
            return profile;
        }),

    updateProfile: protectedProcedure
        .input(z.object({
            goals: z.array(z.string()).optional(),
            learningStyle: z.array(z.string()).optional(),
            preferredTutorGender: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const updatedProfile = await ctx.db.studentProfile.update({
                where: { userId: ctx.userId },
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
            const res = await ctx.db.$executeRaw`UPDATE "StudentProfile" SET "embedding" = ${JSON.stringify(embedding)}::vector WHERE "id" = ${updatedProfile.id}`
            if (res !== 1) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update profile" });
            }
            return { success: true, message: "Student profile updated successfully", profile: updatedProfile };
        }),

    // Health check
    health: publicProcedure.query(() => "Student router is healthy"),

    getTutorMatches: protectedProcedure
        .query(async ({ ctx }) => {
            const studentProfile = await ctx.db.studentProfile.findUnique({
                where: { userId: ctx.userId },
            });

            if (!studentProfile) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Student profile not found" });
            }

            const tutors = await ctx.db.$queryRaw<{ id: string; name: string; email: string; similarity: number }[]>`
                SELECT "TutorProfile".*, "User"."name", "User"."email", 1 - ("TutorProfile"."embedding" <=> (SELECT "embedding" FROM "StudentProfile" WHERE "id" = ${studentProfile.id})) as similarity
                FROM "TutorProfile"
                JOIN "User" ON "TutorProfile"."userId" = "User"."id"
                ORDER BY similarity DESC
                LIMIT 10
            `;

            return tutors;
        }),
});
