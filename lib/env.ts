import { z } from "zod"

const serverEnvSchema = z.object({
  MONGODB_URI: z.string().min(1),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(12),
  SESSION_SECRET: z.string().min(32),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  BRIEF_MODEL: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  LEAD_NOTIFY_EMAIL: z.string().email().optional(),
  LEAD_FROM_EMAIL: z.string().min(1).optional(),
})

export function getServerEnv() {
  return serverEnvSchema.parse({
    MONGODB_URI: process.env.MONGODB_URI,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? process.env.EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? process.env.PASSWORD,
    SESSION_SECRET: process.env.SESSION_SECRET,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || undefined,
    BRIEF_MODEL: process.env.BRIEF_MODEL || undefined,
    RESEND_API_KEY: process.env.RESEND_API_KEY || undefined,
    LEAD_NOTIFY_EMAIL: process.env.LEAD_NOTIFY_EMAIL || undefined,
    LEAD_FROM_EMAIL: process.env.LEAD_FROM_EMAIL || undefined,
  })
}
