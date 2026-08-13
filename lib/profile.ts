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
  skillsHeading: "Technical Skills",
  skillsDescription: "Web technologies I use to build enterprise applications",
  skillCategories: [
    { title: "Frontend Technologies", skills: ["React.js", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Vite"] },
    { title: "Backend & APIs", skills: ["Node.js", "Express.js", "Django REST Framework", "REST APIs", "GraphQL", "tRPC"] },
    { title: "Database & ORM", skills: ["PostgreSQL", "Prisma", "MongoDB", "MySQL", "Firebase", "Supabase", "Redis"] },
    { title: "State & Data Fetching", skills: ["TanStack Query", "TanStack Table", "Redux", "Zustand", "React Hook Form", "Zod", "SWR"] },
    { title: "DevOps & Tools", skills: ["Git", "GitHub", "Docker", "Vercel", "Netlify", "CI/CD", "Linux"] },
    { title: "Design & UI/UX", skills: ["Figma", "Responsive Design", "Accessibility", "Design Systems", "Framer Motion"] },
  ],
  softSkills: ["Problem Solving", "Team Collaboration", "Communication", "Fast Learning", "Adaptability", "Time Management"],
  languages: [{ name: "Bengali", level: "Native" }, { name: "English", level: "Professional" }],
  experienceHeading: "Work Experience",
  experienceDescription: "My professional journey building enterprise applications",
  experiences: [
    {
      title: "Web Developer",
      company: "Trodad International",
      location: "Mohakhali (DOHS), Dhaka",
      period: "May 2025 - Present",
      employmentType: "Full-time",
      isCurrent: true,
      description: "Building enterprise-grade web applications using Next.js, Node.js, Prisma, and PostgreSQL for various business domains.",
      achievements: [
        "Architecting scalable database schemas using Prisma ORM with PostgreSQL",
        "Building RESTful APIs and server actions with Next.js App Router",
        "Implementing business logic for ERP modules and healthcare workflows",
        "Creating responsive, accessible interfaces with reliable data management",
      ],
      technologies: ["Next.js", "Node.js", "Prisma", "PostgreSQL", "TypeScript", "TanStack Query", "Tailwind CSS"],
    },
    {
      title: "Junior Frontend Developer",
      company: "Ankabut Software",
      location: "Rajshahi",
      period: "Jun 2024 - Apr 2025",
      employmentType: "Full-time",
      isCurrent: false,
      description: "Developed and delivered frontend modules for client projects and custom CMS platforms.",
      achievements: [
        "Delivered over 30 frontend modules for client projects",
        "Built responsive and performant interfaces using React.js and Tailwind CSS",
        "Integrated third-party APIs with clean, scalable frontend architecture",
        "Collaborated with design and backend teams to deliver production features",
      ],
      technologies: ["React.js", "Tailwind CSS", "JavaScript", "REST APIs", "Git", "Figma"],
    },
  ],
  projectsHeading: "Featured Projects",
  projectsDescription: "Enterprise applications and web solutions I have built",
  projects: [
    {
      title: "E-commerce ERP System",
      subtitle: "Enterprise Resource Planning for E-commerce",
      category: "E-commerce",
      description: "A comprehensive ERP solution featuring inventory management, order processing, customer management, sales analytics, and multi-vendor support.",
      image: "/ecommerce-erp-dashboard-dark-theme.jpg",
      technologies: ["Next.js", "Node.js", "Prisma", "PostgreSQL", "TypeScript", "TanStack Query", "Tailwind CSS"],
      features: ["Real-time inventory and stock management", "Automated order processing workflows", "Customer management and analytics dashboard"],
      status: "Live",
      company: "Trodad International",
      liveUrl: "https://feroza.com.bd/",
      githubUrl: "",
    },
    {
      title: "Doctor Appointment System",
      subtitle: "Healthcare Scheduling Platform",
      category: "Healthcare",
      description: "A healthcare platform for booking appointments, managing medical records, and connecting patients with doctors.",
      image: "/doctor-appointment-healthcare-dashboard-dark.jpg",
      technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "TanStack Query", "Zod", "Tailwind CSS"],
      features: ["Doctor profile and availability management", "Patient booking and appointment history", "Clinic administration dashboard"],
      status: "Live",
      company: "Trodad International",
      liveUrl: "https://medishifaa.com/",
      githubUrl: "",
    },
    {
      title: "BoiZaar",
      subtitle: "Peer-to-Peer Book Marketplace",
      category: "Marketplace",
      description: "A marketplace connecting students who want to buy and sell used academic textbooks, with search, authentication, and direct messaging.",
      image: "/book-marketplace-ecommerce-dark-theme.jpg",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "TanStack Query", "Django", "PostgreSQL"],
      features: ["Secure user authentication", "Advanced book search and filtering", "Direct buyer and seller messaging"],
      status: "In Development",
      company: "Personal Project",
      liveUrl: "https://trio-beam-boi-zaar.vercel.app",
      githubUrl: "https://github.com/nurmhm/boizaar",
    },
  ],
  testimonialsHeading: "What Colleagues Say",
  testimonialsDescription: "Feedback from professionals I've collaborated with",
  testimonials: [
    { quote: "Nur delivered exceptional work on our E-commerce ERP system. His expertise in Next.js and Prisma helped us build a robust, scalable platform. Highly professional and communicative throughout the project.", name: "MD. Ruhul Amin", title: "Senior Developer", company: "Trodad International", avatar: "/professional-man-portrait.png", rating: 5 },
    { quote: "Working with Nur on the RAJSEBA platform was a fantastic experience. He consistently delivered high-quality, pixel-perfect UIs and always went the extra mile to ensure optimal performance.", name: "Nazmul Hossain", title: "CEO", company: "Ankabut Software", avatar: "/professional-young-man.png", rating: 5 },
    { quote: "Nur's expertise in React and web development is evident in every project he touches. His attention to detail and ability to solve complex problems makes him invaluable to any development team.", name: "MD. Rafi", title: "Senior Developer", company: "Trodad International", avatar: "/professional-woman-portrait.png", rating: 5 },
  ],
  blogHeading: "Latest Articles",
  blogDescription: "Insights and tutorials on web development",
  blogPosts: [
    { title: "Goodbye Boilerplate: Why Zustand is the State Management You've Been Waiting For", date: "Dec 28, 2025", readTime: "2 min read", excerpt: "Learn how Zustand offers a compact and practical state management model for modern React applications.", image: "/database-schema-prisma-postgresql-dark-theme.jpg", tags: ["React", "State Management", "Zustand", "JavaScript"], link: "https://medium.com/@nurmhm/goodbye-boilerplate-why-zustand-is-the-state-management-youve-been-waiting-for-29bfdbd267d2" },
    { title: "Axios Explained: A Beginner-Friendly Guide to HTTP Requests in JavaScript", date: "Sep 25, 2025", readTime: "5 min read", excerpt: "A practical introduction to making and handling HTTP requests with Axios in browser and Node.js applications.", image: "/authentication-security-login-dark-theme.jpg", tags: ["Web Development", "Data Fetching", "Axios", "JavaScript"], link: "https://medium.com/@nurmhm/axios-explained-a-beginner-friendly-guide-to-http-requests-in-javascript-a281825d0fd7" },
    { title: "Unsupported color function oklch error in html2canvas within a Next.js project", date: "Jul 16, 2025", readTime: "3 min read", excerpt: "How to resolve html2canvas color parsing failures when generating PDFs from a modern Tailwind CSS interface.", image: "/erp-system-dashboard-enterprise-dark-theme.jpg", tags: ["jsPDF", "html2canvas", "Next.js", "Tailwind CSS"], link: "https://medium.com/@nurmhm/unsupported-color-function-oklch-error-in-html2canvas-within-a-next-js-project-0d69037b8e85" },
  ],
  educationHeading: "Education",
  educationDescription: "My academic journey in computer science and technology",
  education: [
    { degree: "Bachelor of Science in Computer Science & Engineering", institution: "Uttara University", location: "Dhaka, Bangladesh", period: "2024 - Present", status: "In Progress", cgpa: "", description: "Currently pursuing advanced computer science concepts with a focus on software engineering, algorithms, and modern web technologies.", subjects: ["Data Structures & Algorithms", "Software Engineering", "Database Management Systems", "Computer Networks", "Web Technologies", "Object-Oriented Programming"], achievements: ["Active participation in coding competitions", "Member of university programming club", "Contributing to open-source projects"] },
    { degree: "Diploma in Computer Technology", institution: "Jessore Polytechnic Institute", location: "Jessore, Bangladesh", period: "2019 - 2024", status: "Completed", cgpa: "3.66 out of 4.00", description: "Comprehensive study of computer systems, programming fundamentals, and practical application development.", subjects: ["Programming Fundamentals", "Computer Systems Architecture", "Database Design", "Web Development", "Software Testing", "Project Management"], achievements: ["Graduated with distinction (CGPA: 3.66/4.00)", "Led multiple group projects successfully", "Received excellence award in web development", "Completed internship with outstanding performance"] },
  ],
}

export type PortfolioProfileData = typeof defaultPortfolioProfile & {
  updatedAt: Date | null
  isPersisted: boolean
}

export type PublicPortfolioProfile = Omit<PortfolioProfileData, "updatedAt" | "isPersisted">

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
    skillsHeading: profile.skillsHeading ?? defaultPortfolioProfile.skillsHeading,
    skillsDescription: profile.skillsDescription ?? defaultPortfolioProfile.skillsDescription,
    skillCategories: profile.skillCategories?.length ? profile.skillCategories : defaultPortfolioProfile.skillCategories,
    softSkills: profile.softSkills?.length ? profile.softSkills : defaultPortfolioProfile.softSkills,
    languages: profile.languages?.length ? profile.languages : defaultPortfolioProfile.languages,
    experienceHeading: profile.experienceHeading ?? defaultPortfolioProfile.experienceHeading,
    experienceDescription: profile.experienceDescription ?? defaultPortfolioProfile.experienceDescription,
    experiences: profile.experiences?.length ? profile.experiences : defaultPortfolioProfile.experiences,
    projectsHeading: profile.projectsHeading ?? defaultPortfolioProfile.projectsHeading,
    projectsDescription: profile.projectsDescription ?? defaultPortfolioProfile.projectsDescription,
    projects: profile.projects?.length ? profile.projects : defaultPortfolioProfile.projects,
    testimonialsHeading: profile.testimonialsHeading ?? defaultPortfolioProfile.testimonialsHeading,
    testimonialsDescription: profile.testimonialsDescription ?? defaultPortfolioProfile.testimonialsDescription,
    testimonials: profile.testimonials?.length ? profile.testimonials : defaultPortfolioProfile.testimonials,
    blogHeading: profile.blogHeading ?? defaultPortfolioProfile.blogHeading,
    blogDescription: profile.blogDescription ?? defaultPortfolioProfile.blogDescription,
    blogPosts: profile.blogPosts?.length ? profile.blogPosts : defaultPortfolioProfile.blogPosts,
    educationHeading: profile.educationHeading ?? defaultPortfolioProfile.educationHeading,
    educationDescription: profile.educationDescription ?? defaultPortfolioProfile.educationDescription,
    education: profile.education?.length ? profile.education : defaultPortfolioProfile.education,
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
