import mongoose, { type Model } from "mongoose"

// Every client-facing text field has an optional `…Bn` sibling holding its Bangla version. English fields keep
// their original required rules; Bangla and freelance-era fields are optional so older documents stay valid.

export interface PortfolioProfileDocument extends mongoose.Document {
  singletonKey: "primary"
  fullName: string
  fullNameBn?: string
  professionalTitle: string
  professionalTitleBn?: string
  tagline: string
  taglineBn?: string
  shortBio: string
  shortBioBn?: string
  aboutParagraphs: string[]
  aboutParagraphsBn?: string[]
  currentCompany: string
  yearsExperience: string
  yearsExperienceBn?: string
  email: string
  phone: string
  location: string
  locationBn?: string
  responseTime: string
  responseTimeBn?: string
  availableForFreelance: boolean
  openToFullTime: boolean
  githubUrl: string
  linkedinUrl: string
  mediumUrl: string
  resumeUrl: string
  portraitUrl: string
  technologies: string[]
  traits: string[]
  traitsBn?: string[]
  heroHeadline?: string
  heroHeadlineBn?: string
  heroSubheadline?: string
  heroSubheadlineBn?: string
  availabilityNote?: string
  availabilityNoteBn?: string
  whatsappNumber?: string
  bookingUrl?: string
  proofStats?: { value: string; label: string; labelBn?: string }[]
  servicesHeading?: string
  servicesHeadingBn?: string
  servicesDescription?: string
  servicesDescriptionBn?: string
  services?: {
    title: string
    titleBn?: string
    icon: string
    summary: string
    summaryBn?: string
    deliverables: string[]
    deliverablesBn?: string[]
    timeline: string
    timelineBn?: string
    priceBdt: number
    priceUsd: number
    isPlaceholder?: boolean
  }[]
  processSteps?: { title: string; titleBn?: string; description: string; descriptionBn?: string; duration: string; durationBn?: string }[]
  faqs?: { question: string; questionBn?: string; answer: string; answerBn?: string; isPlaceholder?: boolean }[]
  skillsHeading: string
  skillsHeadingBn?: string
  skillsDescription: string
  skillsDescriptionBn?: string
  skillCategories: { title: string; titleBn?: string; skills: string[] }[]
  softSkills: string[]
  softSkillsBn?: string[]
  languages: { name: string; nameBn?: string; level: string; levelBn?: string }[]
  experienceHeading: string
  experienceHeadingBn?: string
  experienceDescription: string
  experienceDescriptionBn?: string
  experiences: {
    title: string
    titleBn?: string
    company: string
    location: string
    locationBn?: string
    period: string
    periodBn?: string
    employmentType: string
    employmentTypeBn?: string
    isCurrent: boolean
    description: string
    descriptionBn?: string
    achievements: string[]
    achievementsBn?: string[]
    technologies: string[]
  }[]
  projectsHeading: string
  projectsHeadingBn?: string
  projectsDescription: string
  projectsDescriptionBn?: string
  projects: {
    title: string
    subtitle: string
    subtitleBn?: string
    category: string
    categoryBn?: string
    description: string
    descriptionBn?: string
    image: string
    technologies: string[]
    features: string[]
    featuresBn?: string[]
    status: string
    statusBn?: string
    company: string
    liveUrl: string
    githubUrl: string
    problem?: string
    problemBn?: string
    approach?: string
    approachBn?: string
    result?: string
    resultBn?: string
    soloBuilt?: boolean
  }[]
  testimonialsHeading: string
  testimonialsHeadingBn?: string
  testimonialsDescription: string
  testimonialsDescriptionBn?: string
  testimonials: { quote: string; name: string; title: string; company: string; avatar: string; rating: number }[]
  blogHeading: string
  blogHeadingBn?: string
  blogDescription: string
  blogDescriptionBn?: string
  blogPosts: { title: string; date: string; readTime: string; excerpt: string; image: string; tags: string[]; link: string }[]
  educationHeading: string
  educationHeadingBn?: string
  educationDescription: string
  educationDescriptionBn?: string
  education: {
    degree: string
    degreeBn?: string
    institution: string
    institutionBn?: string
    location: string
    locationBn?: string
    period: string
    periodBn?: string
    status: string
    statusBn?: string
    cgpa: string
    description: string
    descriptionBn?: string
    subjects: string[]
    subjectsBn?: string[]
    achievements: string[]
    achievementsBn?: string[]
  }[]
  createdAt: Date
  updatedAt: Date
}

const text = { type: String, required: true, trim: true }
const optionalText = { type: String, trim: true }
const textList = { type: [String], required: true }
// `default: undefined` keeps unset arrays absent instead of saving [], so "never translated" stays distinguishable.
const optionalList = { type: [String], default: undefined }
const list = <T>(item: T) => ({ type: [item], required: true })
const optionalObjectList = <T>(item: T) => ({ type: [item], default: undefined })

const PortfolioProfileSchema = new mongoose.Schema<PortfolioProfileDocument>(
  {
    singletonKey: { type: String, required: true, unique: true, default: "primary", immutable: true },
    fullName: text,
    fullNameBn: optionalText,
    professionalTitle: text,
    professionalTitleBn: optionalText,
    tagline: text,
    taglineBn: optionalText,
    shortBio: text,
    shortBioBn: optionalText,
    aboutParagraphs: textList,
    aboutParagraphsBn: optionalList,
    currentCompany: text,
    yearsExperience: text,
    yearsExperienceBn: optionalText,
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: text,
    location: text,
    locationBn: optionalText,
    responseTime: text,
    responseTimeBn: optionalText,
    availableForFreelance: { type: Boolean, required: true, default: true },
    openToFullTime: { type: Boolean, required: true, default: true },
    githubUrl: text,
    linkedinUrl: text,
    mediumUrl: text,
    resumeUrl: text,
    portraitUrl: text,
    technologies: textList,
    traits: textList,
    traitsBn: optionalList,
    heroHeadline: optionalText,
    heroHeadlineBn: optionalText,
    heroSubheadline: optionalText,
    heroSubheadlineBn: optionalText,
    availabilityNote: optionalText,
    availabilityNoteBn: optionalText,
    whatsappNumber: optionalText,
    bookingUrl: optionalText,
    proofStats: optionalObjectList({ value: text, label: text, labelBn: optionalText }),
    servicesHeading: optionalText,
    servicesHeadingBn: optionalText,
    servicesDescription: optionalText,
    servicesDescriptionBn: optionalText,
    services: optionalObjectList({
      title: text,
      titleBn: optionalText,
      icon: text,
      summary: text,
      summaryBn: optionalText,
      deliverables: textList,
      deliverablesBn: optionalList,
      timeline: text,
      timelineBn: optionalText,
      priceBdt: { type: Number, required: true, min: 0 },
      priceUsd: { type: Number, required: true, min: 0 },
      isPlaceholder: { type: Boolean, default: false },
    }),
    processSteps: optionalObjectList({
      title: text,
      titleBn: optionalText,
      description: text,
      descriptionBn: optionalText,
      duration: text,
      durationBn: optionalText,
    }),
    faqs: optionalObjectList({
      question: text,
      questionBn: optionalText,
      answer: text,
      answerBn: optionalText,
      isPlaceholder: { type: Boolean, default: false },
    }),
    skillsHeading: text,
    skillsHeadingBn: optionalText,
    skillsDescription: text,
    skillsDescriptionBn: optionalText,
    skillCategories: list({ title: text, titleBn: optionalText, skills: textList }),
    softSkills: textList,
    softSkillsBn: optionalList,
    languages: list({ name: text, nameBn: optionalText, level: text, levelBn: optionalText }),
    experienceHeading: text,
    experienceHeadingBn: optionalText,
    experienceDescription: text,
    experienceDescriptionBn: optionalText,
    experiences: list({
      title: text,
      titleBn: optionalText,
      company: text,
      location: text,
      locationBn: optionalText,
      period: text,
      periodBn: optionalText,
      employmentType: text,
      employmentTypeBn: optionalText,
      isCurrent: { type: Boolean, required: true, default: false },
      description: text,
      descriptionBn: optionalText,
      achievements: textList,
      achievementsBn: optionalList,
      technologies: textList,
    }),
    projectsHeading: text,
    projectsHeadingBn: optionalText,
    projectsDescription: text,
    projectsDescriptionBn: optionalText,
    projects: list({
      title: text,
      subtitle: text,
      subtitleBn: optionalText,
      category: text,
      categoryBn: optionalText,
      description: text,
      descriptionBn: optionalText,
      image: text,
      technologies: textList,
      features: textList,
      featuresBn: optionalList,
      status: text,
      statusBn: optionalText,
      company: { type: String, default: "", trim: true },
      liveUrl: { type: String, default: "", trim: true },
      githubUrl: { type: String, default: "", trim: true },
      problem: { type: String, default: "", trim: true },
      problemBn: optionalText,
      approach: { type: String, default: "", trim: true },
      approachBn: optionalText,
      result: { type: String, default: "", trim: true },
      resultBn: optionalText,
      soloBuilt: { type: Boolean, default: false },
    }),
    testimonialsHeading: text,
    testimonialsHeadingBn: optionalText,
    testimonialsDescription: text,
    testimonialsDescriptionBn: optionalText,
    testimonials: list({
      quote: text,
      name: text,
      title: text,
      company: text,
      avatar: text,
      rating: { type: Number, required: true, min: 1, max: 5 },
    }),
    blogHeading: text,
    blogHeadingBn: optionalText,
    blogDescription: text,
    blogDescriptionBn: optionalText,
    blogPosts: list({ title: text, date: text, readTime: text, excerpt: text, image: text, tags: textList, link: text }),
    educationHeading: text,
    educationHeadingBn: optionalText,
    educationDescription: text,
    educationDescriptionBn: optionalText,
    education: list({
      degree: text,
      degreeBn: optionalText,
      institution: text,
      institutionBn: optionalText,
      location: text,
      locationBn: optionalText,
      period: text,
      periodBn: optionalText,
      status: text,
      statusBn: optionalText,
      cgpa: { type: String, default: "", trim: true },
      description: text,
      descriptionBn: optionalText,
      subjects: textList,
      subjectsBn: optionalList,
      achievements: textList,
      achievementsBn: optionalList,
    }),
  },
  { timestamps: true },
)

export const PortfolioProfile: Model<PortfolioProfileDocument> =
  (mongoose.models.PortfolioProfile as Model<PortfolioProfileDocument> | undefined) ??
  mongoose.model<PortfolioProfileDocument>("PortfolioProfile", PortfolioProfileSchema)
