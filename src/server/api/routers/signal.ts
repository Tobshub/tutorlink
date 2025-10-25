import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { broadcastToTutors, notifyStudent } from "@/server/wsBridge";

//implement signals from users to tutors

export const signalRouter = createTRPCRouter({
    // Returns the current viewer's role for conditional UI rendering
    getViewerRole: protectedProcedure.query(async ({ ctx }) => {
        // Check if user has a tutor profile in DB
        const tutorProfile = await ctx.db.tutorProfile.findUnique({
            where: { userId: ctx.user.id },
            select: { id: true },
        });

        // If they have a tutor profile, they're a tutor; otherwise student
        return tutorProfile ? "TUTOR" : "STUDENT";
    }),

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
            await ctx.db.signal.update({
                where: { id: input.signalId },
                data: {
                    ...input,
                }
            });
            return { success: true, message: "Tutor profile updated successfully", };
        }),
    getSignals: protectedProcedure
        .query(async ({ ctx }) => {
            // Fetch pending signals - frontend gates visibility based on role
            // (only tutors will call this via enabled flag in useQuery)
            const signals = await ctx.db.signal.findMany({
                where: { status: "pending" },
                orderBy: { createdAt: "desc" },
                take: 50,
            });
            return signals;
        }),

    // List signals created by the current user (student)
    getMySignals: protectedProcedure.query(async ({ ctx }) => {
        const signals = await ctx.db.signal.findMany({
            where: { studentId: ctx.user.id },
            orderBy: { createdAt: "desc" },
        });
        return signals;
    }),

    // Cancel (delete) a signal owned by the current user when still pending
    deleteSignal: protectedProcedure
        .input(z.object({ signalId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const signal = await ctx.db.signal.findUnique({ where: { id: input.signalId } });
            if (!signal) throw new TRPCError({ code: "NOT_FOUND", message: "Signal not found" });
            if (signal.studentId !== ctx.user.id) {
                throw new TRPCError({ code: "FORBIDDEN", message: "You can only cancel your own signals" });
            }
            if (signal.status !== "pending") {
                throw new TRPCError({ code: "CONFLICT", message: "Only pending signals can be cancelled" });
            }
            await ctx.db.signal.delete({ where: { id: input.signalId } });
            return { success: true, message: "Signal cancelled" };
        }),

    acceptSignal: protectedProcedure
        .input(z.object({ signalId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            // Guard: Only tutors can accept signals - check DB role
            const me = await ctx.db.user.findUnique({
                where: { id: ctx.user.id },
                select: { id: true, role: true },
            });
            if (me?.role !== "TUTOR") {
                throw new TRPCError({ code: "FORBIDDEN", message: "Only tutors can accept signals" });
            }

            // Fetch signal
            const signal = await ctx.db.signal.findUnique({ where: { id: input.signalId } });
            if (!signal) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Signal not found" });
            }
            if (signal.status !== "pending") {
                throw new TRPCError({ code: "CONFLICT", message: "Signal already handled" });
            }

            // TODO: Add transactional handling, concurrency locks to avoid double-accept
            // Create or reuse a conversation between tutor (me.id) and student (signal.studentId)
            const conversation = await ctx.db.conversation.create({
                data: {
                    User: {
                        connect: [
                            { id: me.id },
                            { id: signal.studentId },
                        ],
                    },
                },
            });

            // Update signal status
            await ctx.db.signal.update({
                where: { id: input.signalId },
                data: { status: "accepted" },
            });

            // Notify student via WS bridge (best-effort)
            try {
                await notifyStudent(signal.studentId, {
                    event: "signal-accepted",
                    data: { signalId: input.signalId, tutorId: me.id, conversationId: conversation.id },
                });
            } catch (e) {
                // non-fatal
                console.warn("notifyStudent failed", e);
            }

            return {
                success: true,
                message: "Signal accepted",
                conversationId: conversation.id,
                redirectTo: `/dashboard/messages/${conversation.id}`,
            };
        }),
    health: publicProcedure.query(() => "Signal router is healthy"),
});

