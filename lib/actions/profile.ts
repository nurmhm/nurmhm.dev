"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { requireAdmin } from "@/lib/auth/guards"
import { connectToDatabase } from "@/lib/db"
import { PortfolioProfile } from "@/model/profile"

const requiredText = z.string().trim().min(1).max(2000)
const urlOrPublicPath = z.string().trim().refine(
  (value) => value.startsWith("/") || z.string().url().safeParse(value).success,
  "Enter a complete URL or a public path beginning with /",
)

const profileSchema = z.object({
  fullName: requiredText.max(100),
  professionalTitle: requiredText.max(100),
  tagline: requiredText.max(180),
  shortBio: requiredText.max(500),
  aboutParagraphs: z.array(requiredText.max(1200)).min(1).max(5),
  currentCompany: requiredText.max(120),
  yearsExperience: requiredText.max(50),
  email: z.string().trim().email().max(160),
  phone: requiredText.max(40),
  location: requiredText.max(120),
  responseTime: requiredText.max(100),
  availableForFreelance: z.boolean(),
  openToFullTime: z.boolean(),
  githubUrl: z.string().trim().url(),
  linkedinUrl: z.string().trim().url(),
  mediumUrl: z.string().trim().url(),
  resumeUrl: urlOrPublicPath,
  portraitUrl: urlOrPublicPath,
  technologies: z.array(requiredText.max(60)).min(1).max(30),
  traits: z.array(requiredText.max(60)).min(1).max(20),
})

function splitLines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
}

function splitCommaSeparated(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

export async function updatePortfolioProfile(formData: FormData) {
  await requireAdmin()

  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    professionalTitle: formData.get("professionalTitle"),
    tagline: formData.get("tagline"),
    shortBio: formData.get("shortBio"),
    aboutParagraphs: splitLines(formData.get("aboutParagraphs")),
    currentCompany: formData.get("currentCompany"),
    yearsExperience: formData.get("yearsExperience"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    location: formData.get("location"),
    responseTime: formData.get("responseTime"),
    availableForFreelance: formData.get("availableForFreelance") === "on",
    openToFullTime: formData.get("openToFullTime") === "on",
    githubUrl: formData.get("githubUrl"),
    linkedinUrl: formData.get("linkedinUrl"),
    mediumUrl: formData.get("mediumUrl"),
    resumeUrl: formData.get("resumeUrl"),
    portraitUrl: formData.get("portraitUrl"),
    technologies: splitCommaSeparated(formData.get("technologies")),
    traits: splitCommaSeparated(formData.get("traits")),
  })

  if (!parsed.success) redirect("/admin/personal-information?error=invalid")

  await connectToDatabase()
  await PortfolioProfile.findOneAndUpdate(
    { singletonKey: "primary" },
    { ...parsed.data, singletonKey: "primary" },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  )

  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/admin/personal-information")
  redirect("/admin/personal-information?saved=1")
}
