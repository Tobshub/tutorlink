import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

// TODO: Implement student profile creation and updates
export const studentRouter = createTRPCRouter({
    createProfile: protectedProcedure
        .input(z.object({
            goals: z.array(z.string()),
            learningStyle: z.array(z.string()),
            preferredTutorGender: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const existingProfile = await ctx.db.studentProfile.findUnique({
                where: { userId: ctx.user.id },
            });

            if (existingProfile) {
                return { success: false, message: "Student profile already exists" };
            }

            const profile = await ctx.db.studentProfile.create({
                data: {
                    userId: ctx.user.id,
                    goals: input.goals,
                    learningStyle: input.learningStyle,
                    preferredTutorGender: input.preferredTutorGender,
                    subjectInterests: [],
                },
            });

            return { success: true, message: "Student profile created successfully", profile };
        }),

    getProfile: protectedProcedure
        .query(async ({ ctx }) => {
            const profile = await ctx.db.studentProfile.findUnique({
                where: { userId: ctx.user.id },
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
                where: { userId: ctx.user.id },
                data: {
                    ...input,
                },
            });
            return { success: true, message: "Student profile updated successfully", profile: updatedProfile };
        }),

    // Health check
    health: publicProcedure.query(() => "Student router is healthy"),
});
