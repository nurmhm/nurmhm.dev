import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

const COOKIE_NAME = "portfolio_admin_session"
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

function encode(value: string) {
  return Buffer.from(value).toString("base64url")
}

function sign(payload: string) {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error("SESSION_SECRET is not configured")
  return createHmac("sha256", secret).update(payload).digest("base64url")
}

export function createSession(email: string) {
  const payload = `${encode(JSON.stringify({ email, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }))}`
  return `${payload}.${sign(payload)}`
}

export function verifySession(value: string | undefined) {
  if (!value) return null
  const [payload, signature] = value.split(".")
  if (!payload || !signature) return null

  const expected = sign(payload)
  const validSignature =
    signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  if (!validSignature) return null

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email?: string; exp?: number }
    if (!parsed.email || !parsed.exp || parsed.exp < Math.floor(Date.now() / 1000)) return null
    return { email: parsed.email }
  } catch {
    return null
  }
}

export async function getSession() {
  return verifySession((await cookies()).get(COOKIE_NAME)?.value)
}

export async function setSession(email: string) {
  ;(await cookies()).set(COOKIE_NAME, createSession(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  })
}

export async function clearSession() {
  ;(await cookies()).delete(COOKIE_NAME)
}
