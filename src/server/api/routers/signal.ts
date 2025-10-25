import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { broadcastToTutors, notifyStudent } from "@/server/wsBridge";

//implement signals from users to tutors

export const signalRouter = createTRPCRouter({
    createSignal: protectedProcedure
        .input(z.object({
            message: z.string().min(1),
            subject: z.string().min(1),
            urgency: z.number().min(1).max(5),
            status: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            const studentId = ctx.user.id;
            const signalData = { ...input, studentId, createdAt: new Date().toISOString() };
            await ctx.db.signal.create({
                data: signalData
            });
            console.log("Signal created:", signalData);
            await broadcastToTutors({ event: "new-signal", data: signalData });
            return { success: true, message: "Signal created and broadcast successfully" };
        }),

    updateSignal: protectedProcedure
        .input(z.object({ signalId: z.string(), studentId: z.string(), status: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const signal = await ctx.db.signal.findUnique({ where: { id: input.signalId } });
            if (input.status == "accepted") {
                await notifyStudent(input.studentId, {
                    event: "signal-accepted",
                    data: { signalId: input.signalId, tutorId: ctx.user.id },
                });
                await ctx.db.signal.update({ where: { id: input.signalId }, data: { status: "accepted" } })
                return { success: true, message: "Signal accepted" };
            } else {
                await notifyStudent(input.studentId, {
                    event: "signal-rejected",
                    data: { signalId: input.signalId, tutorId: ctx.user.id },
                });
                await ctx.db.signal.update({ where: { id: input.signalId }, data: { status: "rejected" } });
            }
            return { success: true, message: "Tutor profile updated successfully", };
        }),

    verifySignal: protectedProcedure
        .input(z.object({
            signalId: z.string(), status: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const updatedSignal = await ctx.db.signal.update({
                where: { id: input.signalId },
                data: {
                    ...input,
                }
            });
            return { success: true, message: "Tutor profile updated successfully", };
        }),
    getSignals: protectedProcedure
        .query(async ({ ctx }) => {
            const signals = await ctx.db.signal.findMany({
                where: { status: "pending" },
            });
            return signals;
        }),
    health: publicProcedure.query(() => "Signal router is healthy"),
});

