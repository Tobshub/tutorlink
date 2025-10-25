import { createCallerFactory, createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { tutorRouter } from "@/server/api/routers/tutor";
import { studentRouter } from "@/server/api/routers/student";
import { chatRouter } from './routers/chat';
import { signalRouter } from "@/server/api/routers/signal";
import { callRouter } from './routers/call';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => "OK"),
  tutor: tutorRouter,
  student: studentRouter,
  chat: chatRouter,
  signal: signalRouter,
  call: callRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
