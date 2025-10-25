import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    BEDROCK_ACCESS_KEY_ID: z.string(),
    BEDROCK_SECRET_ACCESS_KEY: z.string(),
    CLERK_SECRET_KEY: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_PEER_HOST: z.string().default("localhost"),
    NEXT_PUBLIC_PEER_PORT: z.number({ coerce: true }).optional(),
    NEXT_PUBLIC_STUN_SERVER: z.string().optional(),
    NEXT_PUBLIC_ICE_SERVER: z.string().optional(),
    NEXT_PUBLIC_ICE_USER: z.string().optional(),
    NEXT_PUBLIC_ICE_CRED: z.string().optional(),
    NEXT_PUBLIC_CONTACT_PHONE_PRIMARY: z.string().optional(),
    NEXT_PUBLIC_CONTACT_PHONE_SECONDARY: z.string().optional(),
    NEXT_PUBLIC_WEBSOCKET_URL: z.string().url(),
    NEXT_PUBLIC_WEBSOCKET_NOTIFICATION_URL: z.string().url(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    BEDROCK_ACCESS_KEY_ID: process.env.BEDROCK_ACCESS_KEY_ID,
    BEDROCK_SECRET_ACCESS_KEY: process.env.BEDROCK_SECRET_ACCESS_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_PEER_HOST: process.env.NEXT_PUBLIC_PEER_HOST,
    NEXT_PUBLIC_PEER_PORT: process.env.NEXT_PUBLIC_PEER_PORT,
    NEXT_PUBLIC_STUN_SERVER: process.env.NEXT_PUBLIC_STUN_SERVER,
    NEXT_PUBLIC_ICE_SERVER: process.env.NEXT_PUBLIC_ICE_SERVER,
    NEXT_PUBLIC_ICE_USER: process.env.NEXT_PUBLIC_ICE_USER,
    NEXT_PUBLIC_ICE_CRED: process.env.NEXT_PUBLIC_ICE_CRED,
    NEXT_PUBLIC_CONTACT_PHONE_PRIMARY: process.env.NEXT_PUBLIC_CONTACT_PHONE_PRIMARY,
    NEXT_PUBLIC_CONTACT_PHONE_SECONDARY: process.env.NEXT_PUBLIC_CONTACT_PHONE_SECONDARY,
    NEXT_PUBLIC_WEBSOCKET_URL: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
    NEXT_PUBLIC_WEBSOCKET_NOTIFICATION_URL: process.env.NEXT_PUBLIC_WEBSOCKET_NOTIFICATION_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
