import mongoose, { type Model } from "mongoose"

export interface PortfolioProfileDocument extends mongoose.Document {
  singletonKey: "primary"
  fullName: string
  professionalTitle: string
  tagline: string
  shortBio: string
  aboutParagraphs: string[]
  currentCompany: string
  yearsExperience: string
  email: string
  phone: string
  location: string
  responseTime: string
  availableForFreelance: boolean
  openToFullTime: boolean
  githubUrl: string
  linkedinUrl: string
  mediumUrl: string
  resumeUrl: string
  portraitUrl: string
  technologies: string[]
  traits: string[]
  skillsHeading: string
  skillsDescription: string
  skillCategories: { title: string; skills: string[] }[]
  softSkills: string[]
  languages: { name: string; level: string }[]
  experienceHeading: string
  experienceDescription: string
  experiences: {
    title: string
    company: string
    location: string
    period: string
    employmentType: string
    isCurrent: boolean
    description: string
    achievements: string[]
    technologies: string[]
  }[]
  projectsHeading: string
  projectsDescription: string
  projects: {
    title: string
    subtitle: string
    category: string
    description: string
    image: string
    technologies: string[]
    features: string[]
    status: string
    company: string
    liveUrl: string
    githubUrl: string
  }[]
  createdAt: Date
  updatedAt: Date
}

const PortfolioProfileSchema = new mongoose.Schema<PortfolioProfileDocument>(
  {
    singletonKey: { type: String, required: true, unique: true, default: "primary", immutable: true },
    fullName: { type: String, required: true, trim: true },
    professionalTitle: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, trim: true },
    shortBio: { type: String, required: true, trim: true },
    aboutParagraphs: { type: [String], required: true },
    currentCompany: { type: String, required: true, trim: true },
    yearsExperience: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    responseTime: { type: String, required: true, trim: true },
    availableForFreelance: { type: Boolean, required: true, default: true },
    openToFullTime: { type: Boolean, required: true, default: true },
    githubUrl: { type: String, required: true, trim: true },
    linkedinUrl: { type: String, required: true, trim: true },
    mediumUrl: { type: String, required: true, trim: true },
    resumeUrl: { type: String, required: true, trim: true },
    portraitUrl: { type: String, required: true, trim: true },
    technologies: { type: [String], required: true },
    traits: { type: [String], required: true },
    skillsHeading: { type: String, required: true, trim: true },
    skillsDescription: { type: String, required: true, trim: true },
    skillCategories: {
      type: [{ title: { type: String, required: true, trim: true }, skills: { type: [String], required: true } }],
      required: true,
    },
    softSkills: { type: [String], required: true },
    languages: {
      type: [{ name: { type: String, required: true, trim: true }, level: { type: String, required: true, trim: true } }],
      required: true,
    },
    experienceHeading: { type: String, required: true, trim: true },
    experienceDescription: { type: String, required: true, trim: true },
    experiences: {
      type: [{
        title: { type: String, required: true, trim: true },
        company: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },
        period: { type: String, required: true, trim: true },
        employmentType: { type: String, required: true, trim: true },
        isCurrent: { type: Boolean, required: true, default: false },
        description: { type: String, required: true, trim: true },
        achievements: { type: [String], required: true },
        technologies: { type: [String], required: true },
      }],
      required: true,
    },
    projectsHeading: { type: String, required: true, trim: true },
    projectsDescription: { type: String, required: true, trim: true },
    projects: {
      type: [{
        title: { type: String, required: true, trim: true },
        subtitle: { type: String, required: true, trim: true },
        category: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        image: { type: String, required: true, trim: true },
        technologies: { type: [String], required: true },
        features: { type: [String], required: true },
        status: { type: String, required: true, trim: true },
        company: { type: String, default: "", trim: true },
        liveUrl: { type: String, default: "", trim: true },
        githubUrl: { type: String, default: "", trim: true },
      }],
      required: true,
    },
  },
  { timestamps: true },
)

export const PortfolioProfile: Model<PortfolioProfileDocument> =
  (mongoose.models.PortfolioProfile as Model<PortfolioProfileDocument> | undefined) ??
  mongoose.model<PortfolioProfileDocument>("PortfolioProfile", PortfolioProfileSchema)
