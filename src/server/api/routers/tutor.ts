// TODO: Implement tutor profile creation and updates
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { invokeModel } from "@/server/bedrock";
import { TRPCError } from "@trpc/server";

export const tutorRouter = createTRPCRouter({
    createProfile: protectedProcedure
        .input(z.object({
            subjectInterests: z.array(z.string()).min(1, "At least one subject is required"),
            teachingLevels: z.array(z.string()).min(1, "At least one teaching level is required"),
            yearsOfExperience: z.number().min(0, "Years of experience cannot be negative"),
            teachingStyle: z.array(z.string()).min(1, "At least one teaching style is required"),
            preferredSessionTypes: z.array(z.string()).min(1, "At least one session type is required"),
        }))
        .mutation(async ({ ctx, input }) => {
            const clerkUser = ctx.user;
            const name = `${clerkUser.firstName} ${clerkUser.lastName}`;
            const email = clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress;

            if (!email) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "No primary email address found for user." });
            }

            const profile = await ctx.db.$transaction(async (tx) => {
                const user = await tx.user.upsert({
                    where: { clerkUid: clerkUser.id },
                    update: { name, email, role: 'TUTOR' },
                    create: {
                        clerkUid: clerkUser.id,
                        name,
                        email,
                        role: 'TUTOR',
                    },
                });

                const existingProfile = await tx.tutorProfile.findUnique({
                    where: { userId: user.id },
                });

                if (existingProfile) {
                    throw new TRPCError({ code: "BAD_REQUEST", message: "Tutor profile already exists." });
                }

                const newProfile = await tx.tutorProfile.create({
                    data: {
                        userId: user.id,
                        subjectInterests: input.subjectInterests,
                        teachingLevels: input.teachingLevels,
                        yearsOfExperience: input.yearsOfExperience,
                        teachingStyle: input.teachingStyle,
                    },
                });

                const embeddingText = `
                    This text describes a tutor profile for an AI tutoring match system.
                    Subject Interests:
                    ${input.subjectInterests.map((s) => `- ${s}`).join("\n")}
                    Teaching Levels:
                    ${input.teachingLevels.map((l) => `- ${l}`).join("\n")}
                    Teaching Style:
                    ${input.teachingStyle.join(", ")}
                `;

                const { embedding } = await invokeModel(embeddingText);

                await ctx.db.tutorProfile.update({ where: { id: newProfile.id }, data: { embedding } });

                return newProfile;
            });

            return { success: true, message: "Tutor profile created successfully", profile };
        }),

    getProfile: protectedProcedure
        .query(async ({ ctx }) => {
            const user = await ctx.db.user.findUnique({
                where: { clerkUid: ctx.user.id },
            });
            if (!user) {
                throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
            }
            const profile = await ctx.db.tutorProfile.findUnique({
                where: { userId: user.id },
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
            const user = await ctx.db.user.findUnique({
                where: { clerkUid: ctx.user.id },
            });
            if (!user) {
                throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
            }

            const updatedProfile = await ctx.db.tutorProfile.update({
                where: { userId: user.id },
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
            await ctx.db.tutorProfile.update({ where: { id: updatedProfile.id }, data: { embedding } });

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

    searchByUsername: publicProcedure
        .input(z.object({ query: z.string().min(1).max(100) }))
        .query(async ({ ctx, input }) => {
            const tutors = await ctx.db.tutorProfile.findMany({
                where: {
                    user: {
                        name: {
                            contains: input.query,
                            mode: "insensitive",
                        },
                    },
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
                take: 20,
            });
            return tutors;
        }),

    // Health check
    health: publicProcedure.query(() => "Tutor router is healthy"),
});
