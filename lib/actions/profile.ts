"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { requireAdmin } from "@/lib/auth/guards"
import { connectToDatabase } from "@/lib/db"
import { defaultPortfolioProfile } from "@/lib/profile"
import { PortfolioProfile } from "@/model/profile"

const requiredText = z.string().trim().min(1).max(2000)
const optionalText = z.string().trim().max(2000)
const urlOrPublicPath = z.string().trim().refine(
  (value) => value.startsWith("/") || z.string().url().safeParse(value).success,
  "Enter a complete URL or a public path beginning with /",
)
const optionalUrl = z.string().trim().refine(
  (value) => value === "" || z.string().url().safeParse(value).success,
  "Enter a complete URL",
)
const textList = (maxItems: number, maxLength = 300) => z.array(requiredText.max(maxLength)).min(1).max(maxItems)
const banglaList = (maxItems: number, maxLength = 400) => z.array(requiredText.max(maxLength)).max(maxItems)
const serviceIcons = ["globe", "smartphone", "bot", "cart", "building", "rocket", "palette", "plug", "monitor", "cloud", "shield", "lifebuoy", "wrench"] as const

const profileSchema = z.object({
  fullName: requiredText.max(100),
  fullNameBn: optionalText.max(120),
  professionalTitle: requiredText.max(100),
  professionalTitleBn: optionalText.max(120),
  tagline: requiredText.max(180),
  taglineBn: optionalText.max(220),
  shortBio: requiredText.max(500),
  shortBioBn: optionalText.max(700),
  aboutParagraphs: textList(5, 1200),
  aboutParagraphsBn: banglaList(5, 1500),
  currentCompany: requiredText.max(120),
  yearsExperience: requiredText.max(50),
  yearsExperienceBn: optionalText.max(60),
  email: z.string().trim().email().max(160),
  phone: requiredText.max(40),
  location: requiredText.max(120),
  locationBn: optionalText.max(140),
  responseTime: requiredText.max(100),
  responseTimeBn: optionalText.max(120),
  availableForFreelance: z.boolean(),
  openToFullTime: z.boolean(),
  githubUrl: z.string().trim().url(),
  linkedinUrl: z.string().trim().url(),
  mediumUrl: z.string().trim().url(),
  resumeUrl: urlOrPublicPath,
  portraitUrl: urlOrPublicPath,
  technologies: textList(30, 60),
  traits: textList(20, 60),
  traitsBn: banglaList(20, 80),
  heroHeadline: requiredText.max(160),
  heroHeadlineBn: optionalText.max(200),
  heroSubheadline: requiredText.max(400),
  heroSubheadlineBn: optionalText.max(500),
  availabilityNote: optionalText.max(100),
  availabilityNoteBn: optionalText.max(120),
  whatsappNumber: z.string().trim().regex(/^\d{8,15}$/, "Digits only, including country code"),
  bookingUrl: optionalUrl,
  proofStats: z.array(z.object({ value: requiredText.max(20), label: requiredText.max(80), labelBn: optionalText.max(100) })).min(1).max(6),
})

const servicesSchema = z.object({
  servicesHeading: requiredText.max(100),
  servicesHeadingBn: optionalText.max(140),
  servicesDescription: requiredText.max(240),
  servicesDescriptionBn: optionalText.max(300),
  services: z.array(z.object({
    title: requiredText.max(100),
    titleBn: optionalText.max(140),
    icon: z.enum(serviceIcons),
    summary: requiredText.max(400),
    summaryBn: optionalText.max(500),
    deliverables: textList(10, 160),
    deliverablesBn: banglaList(10, 200),
    timeline: requiredText.max(60),
    timelineBn: optionalText.max(80),
    priceBdt: z.number().int().min(0),
    priceUsd: z.number().int().min(0),
    isPlaceholder: z.boolean(),
  })).min(1).max(16),
  processSteps: z.array(z.object({
    title: requiredText.max(100),
    titleBn: optionalText.max(140),
    description: requiredText.max(400),
    descriptionBn: optionalText.max(500),
    duration: requiredText.max(60),
    durationBn: optionalText.max(80),
  })).min(1).max(10),
  faqs: z.array(z.object({
    question: requiredText.max(200),
    questionBn: optionalText.max(260),
    answer: requiredText.max(1200),
    answerBn: optionalText.max(1500),
    isPlaceholder: z.boolean(),
  })).min(1).max(20),
})

const skillsSchema = z.object({
  skillsHeading: requiredText.max(100),
  skillsHeadingBn: optionalText.max(140),
  skillsDescription: requiredText.max(240),
  skillsDescriptionBn: optionalText.max(300),
  skillCategories: z.array(z.object({ title: requiredText.max(100), titleBn: optionalText.max(140), skills: textList(30, 60) })).length(6),
  softSkills: textList(20, 60),
  softSkillsBn: banglaList(20, 80),
  languages: z.array(z.object({ name: requiredText.max(60), nameBn: optionalText.max(80), level: requiredText.max(60), levelBn: optionalText.max(80) })).min(1).max(10),
})

const experienceSchema = z.object({
  experienceHeading: requiredText.max(100),
  experienceHeadingBn: optionalText.max(140),
  experienceDescription: requiredText.max(240),
  experienceDescriptionBn: optionalText.max(300),
  experiences: z.array(z.object({
    title: requiredText.max(120),
    titleBn: optionalText.max(160),
    company: requiredText.max(120),
    location: requiredText.max(120),
    locationBn: optionalText.max(160),
    period: requiredText.max(100),
    periodBn: optionalText.max(120),
    employmentType: requiredText.max(60),
    employmentTypeBn: optionalText.max(80),
    isCurrent: z.boolean(),
    description: requiredText.max(1000),
    descriptionBn: optionalText.max(1300),
    achievements: textList(12),
    achievementsBn: banglaList(12),
    technologies: textList(30, 60),
  })).min(1).max(10),
})

const projectsSchema = z.object({
  projectsHeading: requiredText.max(100),
  projectsHeadingBn: optionalText.max(140),
  projectsDescription: requiredText.max(240),
  projectsDescriptionBn: optionalText.max(300),
  projects: z.array(z.object({
    title: requiredText.max(120),
    subtitle: requiredText.max(180),
    subtitleBn: optionalText.max(240),
    category: requiredText.max(80),
    categoryBn: optionalText.max(100),
    description: requiredText.max(1200),
    descriptionBn: optionalText.max(1500),
    image: urlOrPublicPath,
    technologies: textList(30, 60),
    features: textList(12),
    featuresBn: banglaList(12),
    status: requiredText.max(60),
    statusBn: optionalText.max(80),
    company: z.string().trim().max(120),
    liveUrl: optionalUrl,
    githubUrl: optionalUrl,
    problem: optionalText.max(600),
    problemBn: optionalText.max(800),
    approach: optionalText.max(800),
    approachBn: optionalText.max(1000),
    result: optionalText.max(400),
    resultBn: optionalText.max(600),
    soloBuilt: z.boolean(),
  })).min(1).max(12),
})

const testimonialsSchema = z.object({
  testimonialsHeading: requiredText.max(100),
  testimonialsHeadingBn: optionalText.max(140),
  testimonialsDescription: requiredText.max(240),
  testimonialsDescriptionBn: optionalText.max(300),
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
  blogHeadingBn: optionalText.max(140),
  blogDescription: requiredText.max(240),
  blogDescriptionBn: optionalText.max(300),
  blogPosts: z.array(z.object({
    title: requiredText.max(240),
    date: requiredText.max(80),
    readTime: requiredText.max(40),
    excerpt: requiredText.max(1200),
    image: urlOrPublicPath,
    tags: textList(12, 60),
    link: z.string().trim().url(),
  })).min(1).max(12),
})

const educationSchema = z.object({
  educationHeading: requiredText.max(100),
  educationHeadingBn: optionalText.max(140),
  educationDescription: requiredText.max(240),
  educationDescriptionBn: optionalText.max(300),
  education: z.array(z.object({
    degree: requiredText.max(200),
    degreeBn: optionalText.max(260),
    institution: requiredText.max(160),
    institutionBn: optionalText.max(200),
    location: requiredText.max(120),
    locationBn: optionalText.max(160),
    period: requiredText.max(100),
    periodBn: optionalText.max(120),
    status: requiredText.max(60),
    statusBn: optionalText.max(80),
    cgpa: z.string().trim().max(80),
    description: requiredText.max(1200),
    descriptionBn: optionalText.max(1500),
    subjects: textList(20, 160),
    subjectsBn: banglaList(20, 200),
    achievements: textList(20),
    achievementsBn: banglaList(20),
  })).min(1).max(10),
})

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "")
}

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

/** Splits "a | b | c" lines into trimmed parts, padding missing parts with "". */
function splitPipes(value: FormDataEntryValue | null, parts: number) {
  return splitLines(value).map((line) => {
    const values = line.split("|").map((part) => part.trim())
    return Array.from({ length: parts }, (_, index) => values[index] ?? "")
  })
}

function parsePrice(value: FormDataEntryValue | null) {
  return Number(String(value ?? "").replace(/[^\d]/g, "")) || 0
}

function itemCount(formData: FormData, name: string, max: number) {
  return Math.min(Number(formData.get(name)) || 0, max)
}

// $set and $setOnInsert may not touch the same path, so insert defaults must exclude the fields being saved.
function omitKeys<T extends Record<string, unknown>>(source: T, keys: string[]) {
  return Object.fromEntries(Object.entries(source).filter(([key]) => !keys.includes(key))) as Partial<T>
}

async function saveSection(data: Record<string, unknown>, adminPath: string) {
  await connectToDatabase()
  await PortfolioProfile.findOneAndUpdate(
    { singletonKey: "primary" },
    { $set: data, $setOnInsert: omitKeys(defaultPortfolioProfile, Object.keys(data)) },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  )
  revalidatePath("/")
  revalidatePath("/bn")
  revalidatePath("/admin")
  revalidatePath(adminPath)
  redirect(`${adminPath}?saved=1`)
}

export async function updatePortfolioProfile(formData: FormData) {
  await requireAdmin()
  const parsed = profileSchema.safeParse({
    fullName: text(formData, "fullName"),
    fullNameBn: text(formData, "fullNameBn"),
    professionalTitle: text(formData, "professionalTitle"),
    professionalTitleBn: text(formData, "professionalTitleBn"),
    tagline: text(formData, "tagline"),
    taglineBn: text(formData, "taglineBn"),
    shortBio: text(formData, "shortBio"),
    shortBioBn: text(formData, "shortBioBn"),
    aboutParagraphs: splitLines(formData.get("aboutParagraphs")),
    aboutParagraphsBn: splitLines(formData.get("aboutParagraphsBn")),
    currentCompany: text(formData, "currentCompany"),
    yearsExperience: text(formData, "yearsExperience"),
    yearsExperienceBn: text(formData, "yearsExperienceBn"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    location: text(formData, "location"),
    locationBn: text(formData, "locationBn"),
    responseTime: text(formData, "responseTime"),
    responseTimeBn: text(formData, "responseTimeBn"),
    availableForFreelance: formData.get("availableForFreelance") === "on",
    openToFullTime: formData.get("openToFullTime") === "on",
    githubUrl: text(formData, "githubUrl"),
    linkedinUrl: text(formData, "linkedinUrl"),
    mediumUrl: text(formData, "mediumUrl"),
    resumeUrl: text(formData, "resumeUrl"),
    portraitUrl: text(formData, "portraitUrl"),
    technologies: splitCommaSeparated(formData.get("technologies")),
    traits: splitCommaSeparated(formData.get("traits")),
    traitsBn: splitCommaSeparated(formData.get("traitsBn")),
    heroHeadline: text(formData, "heroHeadline"),
    heroHeadlineBn: text(formData, "heroHeadlineBn"),
    heroSubheadline: text(formData, "heroSubheadline"),
    heroSubheadlineBn: text(formData, "heroSubheadlineBn"),
    availabilityNote: text(formData, "availabilityNote"),
    availabilityNoteBn: text(formData, "availabilityNoteBn"),
    whatsappNumber: text(formData, "whatsappNumber").replace(/\D/g, ""),
    bookingUrl: text(formData, "bookingUrl"),
    proofStats: splitPipes(formData.get("proofStats"), 3).map(([value, label, labelBn]) => ({ value, label, labelBn })),
  })
  if (!parsed.success) redirect("/admin/personal-information?error=invalid")
  await saveSection(parsed.data, "/admin/personal-information")
}

export async function updatePortfolioServices(formData: FormData) {
  await requireAdmin()
  // Each list renders one extra blank slot in the admin form; entries left without a title are dropped.
  const services = Array.from({ length: itemCount(formData, "serviceCount", 16) }, (_, index) => ({
    title: text(formData, `serviceTitle${index}`),
    titleBn: text(formData, `serviceTitleBn${index}`),
    icon: text(formData, `serviceIcon${index}`),
    summary: text(formData, `serviceSummary${index}`),
    summaryBn: text(formData, `serviceSummaryBn${index}`),
    deliverables: splitLines(formData.get(`serviceDeliverables${index}`)),
    deliverablesBn: splitLines(formData.get(`serviceDeliverablesBn${index}`)),
    timeline: text(formData, `serviceTimeline${index}`),
    timelineBn: text(formData, `serviceTimelineBn${index}`),
    priceBdt: parsePrice(formData.get(`servicePriceBdt${index}`)),
    priceUsd: parsePrice(formData.get(`servicePriceUsd${index}`)),
    isPlaceholder: formData.get(`servicePlaceholder${index}`) === "on",
  })).filter((service) => service.title.trim())
  const processSteps = Array.from({ length: itemCount(formData, "stepCount", 10) }, (_, index) => ({
    title: text(formData, `stepTitle${index}`),
    titleBn: text(formData, `stepTitleBn${index}`),
    description: text(formData, `stepDescription${index}`),
    descriptionBn: text(formData, `stepDescriptionBn${index}`),
    duration: text(formData, `stepDuration${index}`),
    durationBn: text(formData, `stepDurationBn${index}`),
  })).filter((step) => step.title.trim())
  const faqs = Array.from({ length: itemCount(formData, "faqCount", 20) }, (_, index) => ({
    question: text(formData, `faqQuestion${index}`),
    questionBn: text(formData, `faqQuestionBn${index}`),
    answer: text(formData, `faqAnswer${index}`),
    answerBn: text(formData, `faqAnswerBn${index}`),
    isPlaceholder: formData.get(`faqPlaceholder${index}`) === "on",
  })).filter((faq) => faq.question.trim())
  const parsed = servicesSchema.safeParse({
    servicesHeading: text(formData, "servicesHeading"),
    servicesHeadingBn: text(formData, "servicesHeadingBn"),
    servicesDescription: text(formData, "servicesDescription"),
    servicesDescriptionBn: text(formData, "servicesDescriptionBn"),
    services,
    processSteps,
    faqs,
  })
  if (!parsed.success) redirect("/admin/services?error=invalid")
  await saveSection(parsed.data, "/admin/services")
}

export async function updatePortfolioSkills(formData: FormData) {
  await requireAdmin()
  const parsed = skillsSchema.safeParse({
    skillsHeading: text(formData, "skillsHeading"),
    skillsHeadingBn: text(formData, "skillsHeadingBn"),
    skillsDescription: text(formData, "skillsDescription"),
    skillsDescriptionBn: text(formData, "skillsDescriptionBn"),
    skillCategories: Array.from({ length: 6 }, (_, index) => ({
      title: text(formData, `categoryTitle${index}`),
      titleBn: text(formData, `categoryTitleBn${index}`),
      skills: splitLines(formData.get(`categorySkills${index}`)),
    })),
    softSkills: splitCommaSeparated(formData.get("softSkills")),
    softSkillsBn: splitCommaSeparated(formData.get("softSkillsBn")),
    languages: splitPipes(formData.get("languages"), 4).map(([name, level, nameBn, levelBn]) => ({ name, level, nameBn, levelBn })),
  })
  if (!parsed.success) redirect("/admin/skills?error=invalid")
  await saveSection(parsed.data, "/admin/skills")
}

export async function updatePortfolioExperience(formData: FormData) {
  await requireAdmin()
  const experiences = Array.from({ length: itemCount(formData, "experienceCount", 10) }, (_, index) => ({
    title: text(formData, `experienceTitle${index}`),
    titleBn: text(formData, `experienceTitleBn${index}`),
    company: text(formData, `experienceCompany${index}`),
    location: text(formData, `experienceLocation${index}`),
    locationBn: text(formData, `experienceLocationBn${index}`),
    period: text(formData, `experiencePeriod${index}`),
    periodBn: text(formData, `experiencePeriodBn${index}`),
    employmentType: text(formData, `experienceType${index}`),
    employmentTypeBn: text(formData, `experienceTypeBn${index}`),
    isCurrent: formData.get(`experienceCurrent${index}`) === "on",
    description: text(formData, `experienceDescription${index}`),
    descriptionBn: text(formData, `experienceDescriptionBn${index}`),
    achievements: splitLines(formData.get(`experienceAchievements${index}`)),
    achievementsBn: splitLines(formData.get(`experienceAchievementsBn${index}`)),
    technologies: splitCommaSeparated(formData.get(`experienceTechnologies${index}`)),
  }))
  const parsed = experienceSchema.safeParse({
    experienceHeading: text(formData, "experienceHeading"),
    experienceHeadingBn: text(formData, "experienceHeadingBn"),
    experienceDescription: text(formData, "experienceSectionDescription"),
    experienceDescriptionBn: text(formData, "experienceSectionDescriptionBn"),
    experiences,
  })
  if (!parsed.success) redirect("/admin/experience?error=invalid")
  await saveSection(parsed.data, "/admin/experience")
}

export async function updatePortfolioProjects(formData: FormData) {
  await requireAdmin()
  const projects = Array.from({ length: itemCount(formData, "projectCount", 12) }, (_, index) => ({
    title: text(formData, `projectTitle${index}`),
    subtitle: text(formData, `projectSubtitle${index}`),
    subtitleBn: text(formData, `projectSubtitleBn${index}`),
    category: text(formData, `projectCategory${index}`),
    categoryBn: text(formData, `projectCategoryBn${index}`),
    description: text(formData, `projectDescription${index}`),
    descriptionBn: text(formData, `projectDescriptionBn${index}`),
    image: text(formData, `projectImage${index}`),
    technologies: splitCommaSeparated(formData.get(`projectTechnologies${index}`)),
    features: splitLines(formData.get(`projectFeatures${index}`)),
    featuresBn: splitLines(formData.get(`projectFeaturesBn${index}`)),
    status: text(formData, `projectStatus${index}`),
    statusBn: text(formData, `projectStatusBn${index}`),
    company: text(formData, `projectCompany${index}`),
    liveUrl: text(formData, `projectLiveUrl${index}`),
    githubUrl: text(formData, `projectGithubUrl${index}`),
    problem: text(formData, `projectProblem${index}`),
    problemBn: text(formData, `projectProblemBn${index}`),
    approach: text(formData, `projectApproach${index}`),
    approachBn: text(formData, `projectApproachBn${index}`),
    result: text(formData, `projectResult${index}`),
    resultBn: text(formData, `projectResultBn${index}`),
    soloBuilt: formData.get(`projectSoloBuilt${index}`) === "on",
  }))
  const parsed = projectsSchema.safeParse({
    projectsHeading: text(formData, "projectsHeading"),
    projectsHeadingBn: text(formData, "projectsHeadingBn"),
    projectsDescription: text(formData, "projectsSectionDescription"),
    projectsDescriptionBn: text(formData, "projectsSectionDescriptionBn"),
    projects,
  })
  if (!parsed.success) redirect("/admin/projects?error=invalid")
  await saveSection(parsed.data, "/admin/projects")
}

export async function updatePortfolioTestimonials(formData: FormData) {
  await requireAdmin()
  const testimonials = Array.from({ length: itemCount(formData, "testimonialCount", 12) }, (_, index) => ({
    quote: text(formData, `testimonialQuote${index}`),
    name: text(formData, `testimonialName${index}`),
    title: text(formData, `testimonialTitle${index}`),
    company: text(formData, `testimonialCompany${index}`),
    avatar: text(formData, `testimonialAvatar${index}`),
    rating: Number(formData.get(`testimonialRating${index}`)),
  }))
  const parsed = testimonialsSchema.safeParse({
    testimonialsHeading: text(formData, "testimonialsHeading"),
    testimonialsHeadingBn: text(formData, "testimonialsHeadingBn"),
    testimonialsDescription: text(formData, "testimonialsSectionDescription"),
    testimonialsDescriptionBn: text(formData, "testimonialsSectionDescriptionBn"),
    testimonials,
  })
  if (!parsed.success) redirect("/admin/testimonials?error=invalid")
  await saveSection(parsed.data, "/admin/testimonials")
}

export async function updatePortfolioBlog(formData: FormData) {
  await requireAdmin()
  const blogPosts = Array.from({ length: itemCount(formData, "blogCount", 12) }, (_, index) => ({
    title: text(formData, `blogTitle${index}`),
    date: text(formData, `blogDate${index}`),
    readTime: text(formData, `blogReadTime${index}`),
    excerpt: text(formData, `blogExcerpt${index}`),
    image: text(formData, `blogImage${index}`),
    tags: splitCommaSeparated(formData.get(`blogTags${index}`)),
    link: text(formData, `blogLink${index}`),
  }))
  const parsed = blogSchema.safeParse({
    blogHeading: text(formData, "blogHeading"),
    blogHeadingBn: text(formData, "blogHeadingBn"),
    blogDescription: text(formData, "blogSectionDescription"),
    blogDescriptionBn: text(formData, "blogSectionDescriptionBn"),
    blogPosts,
  })
  if (!parsed.success) redirect("/admin/blog?error=invalid")
  await saveSection(parsed.data, "/admin/blog")
}

export async function updatePortfolioEducation(formData: FormData) {
  await requireAdmin()
  const education = Array.from({ length: itemCount(formData, "educationCount", 10) }, (_, index) => ({
    degree: text(formData, `educationDegree${index}`),
    degreeBn: text(formData, `educationDegreeBn${index}`),
    institution: text(formData, `educationInstitution${index}`),
    institutionBn: text(formData, `educationInstitutionBn${index}`),
    location: text(formData, `educationLocation${index}`),
    locationBn: text(formData, `educationLocationBn${index}`),
    period: text(formData, `educationPeriod${index}`),
    periodBn: text(formData, `educationPeriodBn${index}`),
    status: text(formData, `educationStatus${index}`),
    statusBn: text(formData, `educationStatusBn${index}`),
    cgpa: text(formData, `educationCgpa${index}`),
    description: text(formData, `educationDescription${index}`),
    descriptionBn: text(formData, `educationDescriptionBn${index}`),
    subjects: splitLines(formData.get(`educationSubjects${index}`)),
    subjectsBn: splitLines(formData.get(`educationSubjectsBn${index}`)),
    achievements: splitLines(formData.get(`educationAchievements${index}`)),
    achievementsBn: splitLines(formData.get(`educationAchievementsBn${index}`)),
  }))
  const parsed = educationSchema.safeParse({
    educationHeading: text(formData, "educationHeading"),
    educationHeadingBn: text(formData, "educationHeadingBn"),
    educationDescription: text(formData, "educationSectionDescription"),
    educationDescriptionBn: text(formData, "educationSectionDescriptionBn"),
    education,
  })
  if (!parsed.success) redirect("/admin/education?error=invalid")
  await saveSection(parsed.data, "/admin/education")
}
