import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })
import bcrypt from "bcryptjs"
import { AdminUser } from "../model/user"
import dbConnect from "./mongodb"

async function seedAdmin() {
  await dbConnect()

  const email = "nurmhm@gmail.com"
  const password = "admin123"

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set")
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await AdminUser.findOneAndUpdate(
    { email },
    {
      email,
      passwordHash: hashedPassword,
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    },
  )

  console.log(`Admin user ready: ${user.email}`)

  process.exit(0)
}

seedAdmin().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})