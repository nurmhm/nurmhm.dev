import "./load-env"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import mongoose from "mongoose"
import { connectToDatabase } from "./db"
import { defaultPortfolioProfile } from "./profile-defaults"
import { PortfolioProfile } from "../model/profile"

// Usage:
//   pnpm seed                         back up the current profile, then replace it with lib/profile-defaults.ts
//   pnpm seed:restore <backup.json>   put a backup made by `pnpm seed` back
// Leads and the admin account are never touched.

const BACKUP_DIR = ".seed-backups"

async function backupCurrentProfile() {
  const current = await PortfolioProfile.findOne({ singletonKey: "primary" }).lean()
  if (!current) return null
  await mkdir(BACKUP_DIR, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, "-")
  const file = path.join(BACKUP_DIR, `profile-${stamp}.json`)
  await writeFile(file, JSON.stringify(current, null, 2), "utf8")
  return file
}

async function replaceProfile(data: Record<string, unknown>) {
  const { _id: _ignoredId, __v: _ignoredVersion, createdAt: _createdAt, updatedAt: _updatedAt, ...content } = data
  const document = { ...content, singletonKey: "primary" }
  // Validate the full document first so a bad seed never leaves the site without a profile.
  await new PortfolioProfile(document).validate()
  await PortfolioProfile.replaceOne({ singletonKey: "primary" }, document, { upsert: true })
}

async function seed() {
  const backup = await backupCurrentProfile()
  if (backup) console.log(`Backed up the existing profile to ${backup}`)
  await replaceProfile(defaultPortfolioProfile)
  const profile = defaultPortfolioProfile
  console.log("Seeded the portfolio profile:")
  console.log(`  ${profile.services.length} services · ${profile.processSteps.length} process steps · ${profile.faqs.length} FAQs`)
  console.log(`  ${profile.projects.length} projects · ${profile.experiences.length} roles · ${profile.education.length} education entries`)
  console.log(`  ${profile.testimonials.length} testimonials · ${profile.blogPosts.length} articles · English + Bangla`)
  console.log("Placeholder services and FAQs are marked “Demo — replace me” in /admin/services.")
  if (backup) console.log(`Undo with: pnpm seed:restore ${backup}`)
}

async function restore(file: string) {
  const data = JSON.parse(await readFile(file, "utf8")) as Record<string, unknown>
  await replaceProfile(data)
  console.log(`Restored the portfolio profile from ${file}`)
}

async function main() {
  const restoreIndex = process.argv.indexOf("--restore")
  await connectToDatabase()
  if (restoreIndex !== -1) {
    const file = process.argv[restoreIndex + 1]
    if (!file) throw new Error("Pass the backup file to restore, e.g. pnpm seed:restore .seed-backups/profile-….json")
    await restore(file)
  } else {
    await seed()
  }
}

main()
  .then(() => mongoose.disconnect())
  .catch(async (error) => {
    console.error("Seed failed:", error instanceof Error ? error.message : error)
    await mongoose.disconnect().catch(() => {})
    process.exit(1)
  })
