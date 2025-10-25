// TODO: Implement tutor profile creation and updates
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { invokeModel } from "@/server/bedrock";
import { TRPCError } from "@trpc/server";

export const tutorRouter = createTRPCRouter({
    createProfile: protectedProcedure
        .input(z.object({
            subjectInterests: z.array(z.string()),
            teachingLevels: z.array(z.string()),
            yearsOfExperience: z.number(),
            teachingStyle: z.array(z.string()),
            preferredSessionTypes: z.array(z.string()),
        }))
        .mutation(async ({ ctx, input }) => {
            const existingProfile = await ctx.db.tutorProfile.findUnique({
                where: { userId: ctx.user.id },
            });

            if (existingProfile) {
                return { success: false, message: "Tutor profile already exists" };
            }

            const profile = await ctx.db.tutorProfile.create({
                data: {
                    userId: ctx.user.id,
                    subjectInterests: input.subjectInterests,
                    teachingLevels: input.teachingLevels,
                    yearsOfExperience: input.yearsOfExperience,
                    teachingStyle: input.teachingStyle,
                },
            });

            const { embedding } = await invokeModel(`
This text describes a tutor profile for an AI tutoring match system.

Subject Interests:
${input.subjectInterests.map((s) => `- ${s}`).join("\n")}

Teaching Levels:
${input.teachingLevels.map((l) => `- ${l}`).join("\n")}

Teaching Style:
${input.teachingStyle.join(", ")}
`);
            const res = await ctx.db.$executeRaw`UPDATE "TutorProfile" SET "embedding" = ${JSON.stringify(embedding)}::vector WHERE "id" = ${profile.id}`
            if (res !== 1) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update profile" });
            }

            return { success: true, message: "Tutor profile created successfully", profile };
        }),

    getProfile: protectedProcedure
        .query(async ({ ctx }) => {
            const profile = await ctx.db.tutorProfile.findUnique({
                where: { userId: ctx.user.id },
            });
            return profile;
        }),

    updateProfile: protectedProcedure
        .input(z.object({
            subjectInterests: z.array(z.string()).optional(),
            teachingLevels: z.array(z.string()).optional(),
            yearsOfExperience: z.number().optional(),
            teachingStyle: z.array(z.string()).optional(),
            preferredSessionTypes: z.array(z.string()).optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const updatedProfile = await ctx.db.tutorProfile.update({
                where: { userId: ctx.user.id },
                data: {
                    ...input,
                },
            });

            const { embedding } = await invokeModel(`
This text describes a tutor profile for an AI tutoring match system.

Subject Interests:
${updatedProfile.subjectInterests.map((s) => `- ${s}`).join("\n")}

Teaching Levels:
${updatedProfile.teachingLevels.map((l) => `- ${l}`).join("\n")}

Teaching Style:
${updatedProfile.teachingStyle.map((t) => `- ${t}`).join("\n")}
`);
            const res = await ctx.db.$executeRaw`UPDATE "TutorProfile" SET "embedding" = ${JSON.stringify(embedding)}::vector WHERE "id" = ${updatedProfile.id}`
            if (res !== 1) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update profile" });
            }

            return { success: true, message: "Tutor profile updated successfully", profile: updatedProfile };
        }),

    listRecent: publicProcedure
        .input(z.object({ limit: z.number().default(10) }))
        .query(async ({ ctx, input }) => {
            const tutors = await ctx.db.tutorProfile.findMany({
                take: input.limit,
                orderBy: { createdAt: "desc" },
            });
            return tutors;
        }),

    // Health check
    health: publicProcedure.query(() => "Tutor router is healthy"),
});
