import { z } from "zod"

const serverEnvSchema = z.object({
  MONGODB_URI: z.string().min(1),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(12),
  SESSION_SECRET: z.string().min(32),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
})

export function getServerEnv() {
  return serverEnvSchema.parse({
    MONGODB_URI: process.env.MONGODB_URI,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? process.env.EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? process.env.PASSWORD,
    SESSION_SECRET: process.env.SESSION_SECRET,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  })
}
