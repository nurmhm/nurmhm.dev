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

const testimonialsSchema = z.object({
  testimonialsHeading: requiredText.max(100),
  testimonialsDescription: requiredText.max(240),
  testimonials: z.array(z.object({
    quote: requiredText.max(1200),
    name: requiredText.max(100),
    title: requiredText.max(120),
    company: requiredText.max(120),
    avatar: urlOrPublicPath,
    rating: z.number().int().min(1).max(5),
  })).min(1).max(12),
})

const blogSchema = z.object({
  blogHeading: requiredText.max(100),
  blogDescription: requiredText.max(240),
  blogPosts: z.array(z.object({
    title: requiredText.max(240),
    date: requiredText.max(80),
    readTime: requiredText.max(40),
    excerpt: requiredText.max(1200),
    image: urlOrPublicPath,
    tags: z.array(requiredText.max(60)).min(1).max(12),
    link: z.string().trim().url(),
  })).min(1).max(12),
})

const educationSchema = z.object({
  educationHeading: requiredText.max(100),
  educationDescription: requiredText.max(240),
  education: z.array(z.object({
    degree: requiredText.max(200),
    institution: requiredText.max(160),
    location: requiredText.max(120),
    period: requiredText.max(100),
    status: requiredText.max(60),
    cgpa: z.string().trim().max(80),
    description: requiredText.max(1200),
    subjects: z.array(requiredText.max(160)).min(1).max(20),
    achievements: z.array(requiredText.max(300)).min(1).max(20),
  })).min(1).max(10),
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
        testimonialsHeading: defaultPortfolioProfile.testimonialsHeading,
        testimonialsDescription: defaultPortfolioProfile.testimonialsDescription,
        testimonials: defaultPortfolioProfile.testimonials,
        blogHeading: defaultPortfolioProfile.blogHeading,
        blogDescription: defaultPortfolioProfile.blogDescription,
        blogPosts: defaultPortfolioProfile.blogPosts,
        educationHeading: defaultPortfolioProfile.educationHeading,
        educationDescription: defaultPortfolioProfile.educationDescription,
        education: defaultPortfolioProfile.education,
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
  const {
    experienceHeading: _experienceHeading,
    experienceDescription: _experienceDescription,
    experiences: _experiences,
    ...experienceDefaults
  } = defaultPortfolioProfile
  await PortfolioProfile.findOneAndUpdate(
    { singletonKey: "primary" },
    { $set: parsed.data, $setOnInsert: experienceDefaults },
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
  const {
    projectsHeading: _projectsHeading,
    projectsDescription: _projectsDescription,
    projects: _projects,
    ...projectDefaults
  } = defaultPortfolioProfile
  await PortfolioProfile.findOneAndUpdate(
    { singletonKey: "primary" },
    { $set: parsed.data, $setOnInsert: projectDefaults },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  )
  revalidatePath("/")
  revalidatePath("/admin/projects")
  redirect("/admin/projects?saved=1")
}

export async function updatePortfolioTestimonials(formData: FormData) {
  await requireAdmin()
  const count = Math.min(Number(formData.get("testimonialCount")) || 0, 12)
  const testimonials = Array.from({ length: count }, (_, index) => ({
    quote: formData.get(`testimonialQuote${index}`),
    name: formData.get(`testimonialName${index}`),
    title: formData.get(`testimonialTitle${index}`),
    company: formData.get(`testimonialCompany${index}`),
    avatar: formData.get(`testimonialAvatar${index}`),
    rating: Number(formData.get(`testimonialRating${index}`)),
  }))
  const parsed = testimonialsSchema.safeParse({
    testimonialsHeading: formData.get("testimonialsHeading"),
    testimonialsDescription: formData.get("testimonialsSectionDescription"),
    testimonials,
  })
  if (!parsed.success) redirect("/admin/testimonials?error=invalid")
  await updateSection(parsed.data)
  revalidatePath("/admin/testimonials")
  redirect("/admin/testimonials?saved=1")
}

export async function updatePortfolioBlog(formData: FormData) {
  await requireAdmin()
  const count = Math.min(Number(formData.get("blogCount")) || 0, 12)
  const blogPosts = Array.from({ length: count }, (_, index) => ({
    title: formData.get(`blogTitle${index}`),
    date: formData.get(`blogDate${index}`),
    readTime: formData.get(`blogReadTime${index}`),
    excerpt: formData.get(`blogExcerpt${index}`),
    image: formData.get(`blogImage${index}`),
    tags: splitCommaSeparated(formData.get(`blogTags${index}`)),
    link: formData.get(`blogLink${index}`),
  }))
  const parsed = blogSchema.safeParse({
    blogHeading: formData.get("blogHeading"),
    blogDescription: formData.get("blogSectionDescription"),
    blogPosts,
  })
  if (!parsed.success) redirect("/admin/blog?error=invalid")
  await updateSection(parsed.data)
  revalidatePath("/admin/blog")
  redirect("/admin/blog?saved=1")
}

export async function updatePortfolioEducation(formData: FormData) {
  await requireAdmin()
  const count = Math.min(Number(formData.get("educationCount")) || 0, 10)
  const education = Array.from({ length: count }, (_, index) => ({
    degree: formData.get(`educationDegree${index}`),
    institution: formData.get(`educationInstitution${index}`),
    location: formData.get(`educationLocation${index}`),
    period: formData.get(`educationPeriod${index}`),
    status: formData.get(`educationStatus${index}`),
    cgpa: formData.get(`educationCgpa${index}`),
    description: formData.get(`educationDescription${index}`),
    subjects: splitLines(formData.get(`educationSubjects${index}`)),
    achievements: splitLines(formData.get(`educationAchievements${index}`)),
  }))
  const parsed = educationSchema.safeParse({
    educationHeading: formData.get("educationHeading"),
    educationDescription: formData.get("educationSectionDescription"),
    education,
  })
  if (!parsed.success) redirect("/admin/education?error=invalid")
  await updateSection(parsed.data)
  revalidatePath("/admin/education")
  redirect("/admin/education?saved=1")
}

async function updateSection(data: Record<string, unknown>) {
  await connectToDatabase()
  await PortfolioProfile.findOneAndUpdate(
    { singletonKey: "primary" },
    { $set: data, $setOnInsert: defaultPortfolioProfile },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  )
  revalidatePath("/")
  revalidatePath("/admin")
}
