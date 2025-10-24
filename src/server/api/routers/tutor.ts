import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

// TODO: Implement tutor profile creation and updates
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
            return { success: true, message: "Tutor profile updated successfully", profile: updatedProfile };
        }),

    // Health check
    health: publicProcedure.query(() => "Tutor router is healthy"),
});
