import { createHash } from "node:crypto"
import { headers } from "next/headers"
import { connectToDatabase } from "@/lib/db"
import { RateLimit } from "@/model/rate-limit"

const WINDOW_SECONDS = 60 * 60

export async function getClientFingerprint() {
  const requestHeaders = await headers()
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "unknown"
  // Store a salted hash rather than the raw IP address.
  return createHash("sha256").update(`${ip}:${process.env.SESSION_SECRET ?? ""}`).digest("hex").slice(0, 32)
}

/** Fixed-window limiter backed by MongoDB. Returns false once `limit` hits in the current hour are used. */
export async function consumeRateLimit(scope: string, limit: number) {
  const fingerprint = await getClientFingerprint()
  const windowIndex = Math.floor(Date.now() / 1000 / WINDOW_SECONDS)

  await connectToDatabase()
  const entry = await RateLimit.findOneAndUpdate(
    { key: `${scope}:${fingerprint}:${windowIndex}` },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((windowIndex + 1) * WINDOW_SECONDS * 1000) } },
    { upsert: true, new: true },
  ).lean()

  return (entry?.count ?? 1) <= limit
}
