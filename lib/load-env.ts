import dotenv from "dotenv"

// CLI scripts run outside Next.js, so load the same env files Next would. dotenv never overrides a variable that
// is already set, so values in .env.local win over .env, and real environment variables win over both.
dotenv.config({ path: ".env.local", quiet: true })
dotenv.config({ path: ".env", quiet: true })
