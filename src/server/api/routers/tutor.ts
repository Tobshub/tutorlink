import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

// TODO: Implement tutor profile creation and updates
export const tutorRouter = createTRPCRouter({
    // TODO: Create tutor profile after onboarding completion
    createProfile: protectedProcedure
        .input(z.object({
            subjectInterests: z.array(z.string()),
            teachingLevels: z.array(z.string()),
            yearsOfExperience: z.number(),
            teachingStyle: z.array(z.string()),
            preferredSessionTypes: z.array(z.string()),
        }))
        .mutation(async ({ input }) => {
            // TODO: Implement tutor profile creation logic
            // This should create a TutorProfile record in the database
            console.log("Creating tutor profile:", input);
            return { success: true, message: "Tutor profile created successfully" };
        }),

    // TODO: Get tutor profile for current user
    getProfile: protectedProcedure
        .query(async ({ ctx }) => {
            // TODO: Implement tutor profile retrieval logic
            // This should fetch the TutorProfile for the current user
            console.log("Getting tutor profile for user:", ctx.user.id);
            return null;
        }),

    // TODO: Update tutor profile
    updateProfile: protectedProcedure
        .input(z.object({
            subjectInterests: z.array(z.string()).optional(),
            teachingLevels: z.array(z.string()).optional(),
            yearsOfExperience: z.number().optional(),
            teachingStyle: z.array(z.string()).optional(),
            preferredSessionTypes: z.array(z.string()).optional(),
        }))
        .mutation(async ({ input }) => {
            // TODO: Implement tutor profile update logic
            console.log("Updating tutor profile:", input);
            return { success: true, message: "Tutor profile updated successfully" };
        }),

    // Health check
    health: publicProcedure.query(() => "Tutor router is healthy"),
});
