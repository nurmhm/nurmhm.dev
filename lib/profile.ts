import { connectToDatabase } from "@/lib/db"
import { PortfolioProfile } from "@/model/profile"

export const defaultPortfolioProfile = {
  singletonKey: "primary" as const,
  fullName: "Nur Mohammad",
  professionalTitle: "Web Developer",
  tagline: "Next.js, Node.js, Prisma, and PostgreSQL specialist",
  shortBio:
    "Web Developer with 2+ years of experience building enterprise-grade applications and thoughtful digital products.",
  aboutParagraphs: [
    "I'm a Web Developer specializing in building enterprise-grade applications with modern technologies. Currently working at Trodad International, where I develop E-commerce ERP, Doctor Appointment, Hospital Portfolio, and Business Management platforms.",
    "My tech stack includes Next.js, Node.js, Prisma ORM, and PostgreSQL for building scalable, type-safe applications. I focus on clean architecture, efficient database design, and high-quality user experiences.",
    "I believe in writing maintainable code, following best practices, and continuously learning to deliver enterprise solutions that make a real impact.",
  ],
  currentCompany: "Trodad International",
  yearsExperience: "2+ years",
  email: "nurmhm.dev@gmail.com",
  phone: "+8801770514004",
  location: "Dhaka, Bangladesh",
  responseTime: "Within 24 hours",
  availableForFreelance: true,
  openToFullTime: true,
  githubUrl: "https://github.com/nurmhm",
  linkedinUrl: "https://linkedin.com/in/nurmhm7228",
  mediumUrl: "https://medium.com/@nurmhm",
  resumeUrl: "/nur_resume.pdf",
  portraitUrl: "/professional-developer-portrait.png",
  technologies: ["Next.js", "Node.js", "Prisma", "PostgreSQL", "TypeScript", "React"],
  traits: ["Web", "Problem Solver", "Team Player", "Fast Learner", "Detail Oriented"],
}

export type PortfolioProfileData = typeof defaultPortfolioProfile & {
  updatedAt: Date | null
  isPersisted: boolean
}

export async function getPortfolioProfile(): Promise<PortfolioProfileData> {
  await connectToDatabase()
  const profile = await PortfolioProfile.findOne({ singletonKey: "primary" }).lean()

  if (!profile) {
    return { ...defaultPortfolioProfile, updatedAt: null, isPersisted: false }
  }

  return {
    ...defaultPortfolioProfile,
    fullName: profile.fullName,
    professionalTitle: profile.professionalTitle,
    tagline: profile.tagline,
    shortBio: profile.shortBio,
    aboutParagraphs: profile.aboutParagraphs,
    currentCompany: profile.currentCompany,
    yearsExperience: profile.yearsExperience,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    responseTime: profile.responseTime,
    availableForFreelance: profile.availableForFreelance,
    openToFullTime: profile.openToFullTime,
    githubUrl: profile.githubUrl,
    linkedinUrl: profile.linkedinUrl,
    mediumUrl: profile.mediumUrl,
    resumeUrl: profile.resumeUrl,
    portraitUrl: profile.portraitUrl,
    technologies: profile.technologies,
    traits: profile.traits,
    updatedAt: profile.updatedAt,
    isPersisted: true,
  }
}

export function getProfileCompleteness(profile: PortfolioProfileData) {
  const values = [
    profile.fullName,
    profile.professionalTitle,
    profile.tagline,
    profile.shortBio,
    ...profile.aboutParagraphs,
    profile.currentCompany,
    profile.yearsExperience,
    profile.email,
    profile.phone,
    profile.location,
    profile.githubUrl,
    profile.linkedinUrl,
    profile.resumeUrl,
    profile.portraitUrl,
    ...profile.technologies,
  ]
  return Math.round((values.filter((value) => value.trim().length > 0).length / values.length) * 100)
}
