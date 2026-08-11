import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
import bcrypt from "bcryptjs";
import User from "../model/user";
import dbConnect from "./mongodb";

async function seedAdmin() {
  await dbConnect();

  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;

  if (!email || !password) {
    throw new Error("EMAIL and PASSWORD must be set");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.findOneAndUpdate(
    { email },
    {
      email,
      password: hashedPassword,
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    }
  );

  console.log(`Admin user ready: ${user.email}`);

  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});