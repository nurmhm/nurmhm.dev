import "./load-env"
import bcrypt from "bcryptjs"
import mongoose from "mongoose"
import { connectToDatabase } from "./db"
import { AdminUser } from "../model/user"

// Creates the single admin account, or resets its password, from ADMIN_EMAIL / ADMIN_PASSWORD
// (EMAIL / PASSWORD are accepted too, matching lib/env.ts).

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL ?? process.env.EMAIL ?? "").trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD ?? process.env.PASSWORD ?? ""

  if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env or .env.local")
  if (password.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters")

  await connectToDatabase()
  const passwordHash = await bcrypt.hash(password, 12)
  const user = await AdminUser.findOneAndUpdate(
    { email },
    { email, passwordHash },
    { upsert: true, new: true, runValidators: true },
  )
  console.log(`Admin user ready: ${user.email}`)
}

seedAdmin()
  .then(() => mongoose.disconnect())
  .catch(async (error) => {
    console.error("Seed failed:", error instanceof Error ? error.message : error)
    await mongoose.disconnect().catch(() => {})
    process.exit(1)
  })
