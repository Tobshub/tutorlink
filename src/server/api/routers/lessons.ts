
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const lessonsRouter = createTRPCRouter({
    createLesson: protectedProcedure
        .input(z.object({
            studentId: z.string(),
            tutorId: z.string(),
            startTime: z.date(),
            endTime: z.date(),
        }))
        .mutation(async ({ ctx, input }) => {
            const lesson = await ctx.db.lesson.create({
                data: {
                    studentId: input.studentId,
                    tutorId: input.tutorId,
                    startTime: input.startTime,
                    endTime: input.endTime,
                },
            });
            return { success: true, message: "Lesson created successfully", lesson };
        }),

    getLessons: protectedProcedure
        .query(async ({ ctx }) => {
            const lessons = await ctx.db.lesson.findMany({
                where: {
                    OR: [
                        { studentId: ctx.userId },
                        { tutorId: ctx.userId },
                    ],
                },
            });
            return lessons;
        }),

    // Health check
    health: publicProcedure.query(() => "Lessons router is healthy"),
});
