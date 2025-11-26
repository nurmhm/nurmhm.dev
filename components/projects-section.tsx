"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ExternalLink,
  Github,
  Server,
  ShoppingCart,
  Stethoscope,
  Building,
  Briefcase,
  BookOpen,
  Layout,
} from "lucide-react"

const projects = [
  {
    title: "E-commerce ERP System",
    subtitle: "Enterprise Resource Planning for E-commerce",
    icon: ShoppingCart,
    description:
      "A comprehensive ERP solution for e-commerce businesses featuring inventory management, order processing, customer relationship management, sales analytics, and multi-vendor support.",
    image: "/ecommerce-erp-dashboard-dark-theme.jpg",
    technologies: ["Next.js", "Node.js", "Prisma", "PostgreSQL", "TypeScript", "TanStack Query", "Tailwind CSS"],
    features: [
      "Real-time inventory tracking and stock management",
      "Order processing with automated workflow",
      "Customer management and analytics dashboard",
      "Multi-vendor marketplace support",
      "Sales reports and business intelligence",
    ],
    status: "In Development",
    statusColor: "bg-amber-600",
    company: "Trodad International",
    stats: {
      modules: "15+",
      tables: "40+",
      apis: "50+",
    },
  },
  {
    title: "Doctor Appointment System",
    subtitle: "Healthcare Scheduling Platform",
    icon: Stethoscope,
    description:
      "A full-featured healthcare platform enabling patients to book appointments, manage medical records, and connect with doctors. Includes doctor profiles, availability management, and appointment reminders.",
    image: "/doctor-appointment-healthcare-dashboard-dark.jpg",
    technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "TanStack Query", "Zod", "Tailwind CSS"],
    features: [
      "Doctor profile and availability management",
      "Patient appointment booking and history",
      "Automated email/SMS reminders",
      "Medical record management",
      "Admin dashboard for clinic management",
    ],
    status: "In Development",
    statusColor: "bg-amber-600",
    company: "Trodad International",
    stats: {
      features: "20+",
      screens: "25+",
      integrations: "5+",
    },
  },
  {
    title: "Hospital Portfolio System",
    subtitle: "Hospital Management & Showcase",
    icon: Building,
    description:
      "A comprehensive hospital management and portfolio platform showcasing hospital services, departments, doctors, and facilities. Includes patient feedback and inquiry system.",
    image: "/hospital-management-portfolio-dark-theme.jpg",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Prisma", "Tailwind CSS", "Framer Motion"],
    features: [
      "Department and service showcase",
      "Doctor directory with specializations",
      "Patient testimonials and reviews",
      "Online inquiry and contact forms",
      "News and updates management",
    ],
    status: "In Development",
    statusColor: "bg-amber-600",
    company: "Trodad International",
    stats: {
      pages: "15+",
      components: "30+",
      animations: "20+",
    },
  },
  {
    title: "Business Management System",
    subtitle: "All-in-One Business Operations",
    icon: Briefcase,
    description:
      "A unified platform for managing business operations including project management, team collaboration, expense tracking, client management, and comprehensive reporting.",
    image: "/business-management-dashboard-dark-modern.jpg",
    technologies: ["React", "Node.js", "Express", "PostgreSQL", "Prisma", "Chart.js", "Tailwind CSS"],
    features: [
      "Project and task management with Kanban boards",
      "Team collaboration and communication",
      "Expense and invoice management",
      "Client and vendor management",
      "Business analytics and reporting",
    ],
    status: "In Development",
    statusColor: "bg-amber-600",
    company: "Trodad International",
    stats: {
      dashboards: "5+",
      reports: "10+",
      workflows: "8+",
    },
  },
  {
    title: "RAJSEBA",
    subtitle: "Home Service Booking Platform",
    icon: Layout,
    description:
      "A comprehensive service booking platform connecting customers with verified service providers for home services including cleaning, repairs, maintenance, and more.",
    image: "/home-service-booking-platform-dark.jpg",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "API Integration", "Payment Gateway"],
    features: [
      "Service provider verification system",
      "Real-time booking and scheduling",
      "Integrated payment processing",
      "Customer review and rating system",
      "Admin dashboard for service management",
    ],
    status: "Live",
    statusColor: "bg-emerald-600",
    liveUrl: "https://rajseba.com",
    company: "Ankabut Software",
    stats: {
      services: "100+",
      providers: "500+",
      bookings: "2000+",
    },
  },
  {
    title: "BoiZaar",
    subtitle: "Peer-to-Peer Book Marketplace",
    icon: BookOpen,
    description:
      "A comprehensive marketplace platform connecting students for buying and selling used academic textbooks. Features include user authentication, advanced search functionality, and direct messaging.",
    image: "/book-marketplace-ecommerce-dark-theme.jpg",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "TanStack Query", "Django", "PostgreSQL"],
    features: [
      "User authentication with secure login/registration",
      "Advanced book search and filtering system",
      "Real-time messaging between buyers and sellers",
      "Responsive design for all devices",
      "Book condition rating and review system",
    ],
    status: "In Development",
    statusColor: "bg-amber-600",
    liveUrl: "https://trio-beam-boi-zaar.vercel.app",
    githubUrl: "https://github.com/nurmhm/boizaar",
    stats: {
      users: "500+",
      books: "1000+",
      transactions: "200+",
    },
  },
]

export function ProjectsSection() {
  return (
    <section id="projects" className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Enterprise applications and Web solutions I'm building
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all duration-300 overflow-hidden h-full flex flex-col">
                {/* Project Image */}
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 overflow-hidden">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge className={`${project.statusColor} text-white`}>{project.status}</Badge>
                  </div>
                  <div className="absolute top-4 left-4">
                    <div className="p-2 bg-slate-900/80 rounded-lg">
                      <project.icon className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                  {project.company && (
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="outline" className="bg-slate-900/80 border-slate-600 text-slate-200">
                        {project.company}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Project Details */}
                <div className="flex-1 flex flex-col p-6 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{project.title}</h3>
                    <p className="text-emerald-400 font-medium mb-3">{project.subtitle}</p>
                    <p className="text-slate-300 leading-relaxed text-sm">{project.description}</p>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h4 className="text-sm font-semibold text-cyan-400 mb-2">Tech Stack:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="border-slate-600 text-slate-300 text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-amber-400 mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {project.features.slice(0, 3).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2 text-slate-300 text-sm">
                          <span className="text-emerald-400 mt-0.5">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Project Stats */}
                  <div className="grid grid-cols-3 gap-3 p-3 bg-slate-900/50 rounded-lg">
                    {Object.entries(project.stats).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-lg font-bold text-emerald-400">{value}</div>
                        <div className="text-xs text-slate-400 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    {project.liveUrl && (
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
                        asChild
                      >
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-slate-600 hover:bg-slate-700 bg-transparent text-slate-200"
                        asChild
                      >
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </a>
                      </Button>
                    )}
                    {!project.liveUrl && !project.githubUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-slate-600 bg-transparent text-slate-400 cursor-not-allowed"
                        disabled
                      >
                        <Server className="w-4 h-4 mr-2" />
                        In Development
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
