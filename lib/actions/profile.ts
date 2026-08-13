"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { requireAdmin } from "@/lib/auth/guards"
import { connectToDatabase } from "@/lib/db"
import { defaultPortfolioProfile } from "@/lib/profile"
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

const skillsSchema = z.object({
  skillsHeading: requiredText.max(100),
  skillsDescription: requiredText.max(240),
  skillCategories: z.array(z.object({
    title: requiredText.max(100),
    skills: z.array(requiredText.max(60)).min(1).max(30),
  })).length(6),
  softSkills: z.array(requiredText.max(60)).min(1).max(20),
  languages: z.array(z.object({
    name: requiredText.max(60),
    level: requiredText.max(60),
  })).min(1).max(10),
})

const experienceSchema = z.object({
  experienceHeading: requiredText.max(100),
  experienceDescription: requiredText.max(240),
  experiences: z.array(z.object({
    title: requiredText.max(120),
    company: requiredText.max(120),
    location: requiredText.max(120),
    period: requiredText.max(100),
    employmentType: requiredText.max(60),
    isCurrent: z.boolean(),
    description: requiredText.max(1000),
    achievements: z.array(requiredText.max(300)).min(1).max(12),
    technologies: z.array(requiredText.max(60)).min(1).max(30),
  })).min(1).max(10),
})

const optionalUrl = z.string().trim().refine(
  (value) => value === "" || z.string().url().safeParse(value).success,
  "Enter a complete URL",
)

const projectsSchema = z.object({
  projectsHeading: requiredText.max(100),
  projectsDescription: requiredText.max(240),
  projects: z.array(z.object({
    title: requiredText.max(120),
    subtitle: requiredText.max(180),
    category: requiredText.max(80),
    description: requiredText.max(1200),
    image: urlOrPublicPath,
    technologies: z.array(requiredText.max(60)).min(1).max(30),
    features: z.array(requiredText.max(300)).min(1).max(12),
    status: requiredText.max(60),
    company: z.string().trim().max(120),
    liveUrl: optionalUrl,
    githubUrl: optionalUrl,
  })).min(1).max(12),
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
    {
      $set: parsed.data,
      $setOnInsert: {
        singletonKey: "primary",
        skillsHeading: defaultPortfolioProfile.skillsHeading,
        skillsDescription: defaultPortfolioProfile.skillsDescription,
        skillCategories: defaultPortfolioProfile.skillCategories,
        softSkills: defaultPortfolioProfile.softSkills,
        languages: defaultPortfolioProfile.languages,
        experienceHeading: defaultPortfolioProfile.experienceHeading,
        experienceDescription: defaultPortfolioProfile.experienceDescription,
        experiences: defaultPortfolioProfile.experiences,
        projectsHeading: defaultPortfolioProfile.projectsHeading,
        projectsDescription: defaultPortfolioProfile.projectsDescription,
        projects: defaultPortfolioProfile.projects,
      },
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  )

  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/admin/personal-information")
  redirect("/admin/personal-information?saved=1")
}

export async function updatePortfolioSkills(formData: FormData) {
  await requireAdmin()

  const skillCategories = Array.from({ length: 6 }, (_, index) => ({
    title: String(formData.get(`categoryTitle${index}`) ?? ""),
    skills: splitLines(formData.get(`categorySkills${index}`)),
  }))
  const languages = splitLines(formData.get("languages")).map((line) => {
    const [name, ...levelParts] = line.split("|")
    return { name: name.trim(), level: levelParts.join("|").trim() }
  })
  const parsed = skillsSchema.safeParse({
    skillsHeading: formData.get("skillsHeading"),
    skillsDescription: formData.get("skillsDescription"),
    skillCategories,
    softSkills: splitCommaSeparated(formData.get("softSkills")),
    languages,
  })

  if (!parsed.success) redirect("/admin/skills?error=invalid")

  await connectToDatabase()
  const {
    skillsHeading: _skillsHeading,
    skillsDescription: _skillsDescription,
    skillCategories: _skillCategories,
    softSkills: _softSkills,
    languages: _languages,
    ...personalDefaults
  } = defaultPortfolioProfile
  await PortfolioProfile.findOneAndUpdate(
    { singletonKey: "primary" },
    { $set: parsed.data, $setOnInsert: personalDefaults },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  )
  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/admin/skills")
  redirect("/admin/skills?saved=1")
}

export async function updatePortfolioExperience(formData: FormData) {
  await requireAdmin()
  const count = Math.min(Number(formData.get("experienceCount")) || 0, 10)
  const experiences = Array.from({ length: count }, (_, index) => ({
    title: formData.get(`experienceTitle${index}`),
    company: formData.get(`experienceCompany${index}`),
    location: formData.get(`experienceLocation${index}`),
    period: formData.get(`experiencePeriod${index}`),
    employmentType: formData.get(`experienceType${index}`),
    isCurrent: formData.get(`experienceCurrent${index}`) === "on",
    description: formData.get(`experienceDescription${index}`),
    achievements: splitLines(formData.get(`experienceAchievements${index}`)),
    technologies: splitCommaSeparated(formData.get(`experienceTechnologies${index}`)),
  }))
  const parsed = experienceSchema.safeParse({
    experienceHeading: formData.get("experienceHeading"),
    experienceDescription: formData.get("experienceSectionDescription"),
    experiences,
  })

  if (!parsed.success) redirect("/admin/experience?error=invalid")
  await connectToDatabase()
  await PortfolioProfile.findOneAndUpdate(
    { singletonKey: "primary" },
    { $set: parsed.data, $setOnInsert: defaultPortfolioProfile },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  )
  revalidatePath("/")
  revalidatePath("/admin/experience")
  redirect("/admin/experience?saved=1")
}

export async function updatePortfolioProjects(formData: FormData) {
  await requireAdmin()
  const count = Math.min(Number(formData.get("projectCount")) || 0, 12)
  const projects = Array.from({ length: count }, (_, index) => ({
    title: formData.get(`projectTitle${index}`),
    subtitle: formData.get(`projectSubtitle${index}`),
    category: formData.get(`projectCategory${index}`),
    description: formData.get(`projectDescription${index}`),
    image: formData.get(`projectImage${index}`),
    technologies: splitCommaSeparated(formData.get(`projectTechnologies${index}`)),
    features: splitLines(formData.get(`projectFeatures${index}`)),
    status: formData.get(`projectStatus${index}`),
    company: formData.get(`projectCompany${index}`),
    liveUrl: formData.get(`projectLiveUrl${index}`),
    githubUrl: formData.get(`projectGithubUrl${index}`),
  }))
  const parsed = projectsSchema.safeParse({
    projectsHeading: formData.get("projectsHeading"),
    projectsDescription: formData.get("projectsSectionDescription"),
    projects,
  })

  if (!parsed.success) redirect("/admin/projects?error=invalid")
  await connectToDatabase()
  await PortfolioProfile.findOneAndUpdate(
    { singletonKey: "primary" },
    { $set: parsed.data, $setOnInsert: defaultPortfolioProfile },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  )
  revalidatePath("/")
  revalidatePath("/admin/projects")
  redirect("/admin/projects?saved=1")
}
