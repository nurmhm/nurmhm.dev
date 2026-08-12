"use server"

import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { z } from "zod"
import { connectToDatabase } from "@/lib/db"
import { AdminUser } from "@/model/user"
import { clearSession, setSession } from "@/lib/auth/session"

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) })

export async function loginAdmin(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) redirect("/admin/login?error=invalid")

  await connectToDatabase()
  const user = await AdminUser.findOne({ email: parsed.data.email.toLowerCase() }).select("+passwordHash")
  const valid = user ? await bcrypt.compare(parsed.data.password, user.passwordHash) : false
  if (!user || !valid) redirect("/admin/login?error=invalid")

  user.lastLoginAt = new Date()
  await user.save()
  await setSession(user.email)
  redirect("/admin")
}

export async function logoutAdmin() {
  await clearSession()
  redirect("/admin/login")
}
