import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

// TODO: Implement student profile creation and updates
export const studentRouter = createTRPCRouter({
    // TODO: Create student profile after onboarding completion
    createProfile: protectedProcedure
        .input(z.object({
            goals: z.array(z.string()),
            learningStyle: z.array(z.string()),
            preferredTutorGender: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
            // TODO: Implement student profile creation logic
            // This should create a StudentProfile record in the database
            console.log("Creating student profile:", input);
            return { success: true, message: "Student profile created successfully" };
        }),

    // TODO: Get student profile for current user
    getProfile: protectedProcedure
        .query(async ({ ctx }) => {
            // TODO: Implement student profile retrieval logic
            // This should fetch the StudentProfile for the current user
            console.log("Getting student profile for user:", ctx.user.id);
            return null;
        }),

    // TODO: Update student profile
    updateProfile: protectedProcedure
        .input(z.object({
            goals: z.array(z.string()).optional(),
            learningStyle: z.array(z.string()).optional(),
            preferredTutorGender: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
            // TODO: Implement student profile update logic
            console.log("Updating student profile:", input);
            return { success: true, message: "Student profile updated successfully" };
        }),

    // Health check
    health: publicProcedure.query(() => "Student router is healthy"),
});
