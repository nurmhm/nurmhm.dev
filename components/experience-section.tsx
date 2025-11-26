"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, ExternalLink, Briefcase, Award, Code, Building2 } from "lucide-react"

const experiences = [
  {
    title: "Web Developer",
    company: "Trodad International",
    location: "Mohakhali (DOHS), Dhaka",
    period: "May 2025 – Present",
    type: "Full-time",
    status: "current",
    description:
      "Building enterprise-grade Web applications using Next.js, Node.js, Prisma, and PostgreSQL for various business domains.",
    projects: [
      {
        name: "E-commerce ERP System",
        description:
          "Complete enterprise resource planning solution for e-commerce businesses with inventory, orders, and analytics",
        tech: ["Next.js", "Node.js", "Prisma", "PostgreSQL"],
      },
      {
        name: "Doctor Appointment System",
        description: "Healthcare platform for scheduling appointments, patient management, and doctor profiles",
        tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
      },
      {
        name: "Hospital Portfolio System",
        description: "Comprehensive hospital management and portfolio showcase platform",
        tech: ["Next.js", "Node.js", "PostgreSQL", "Tailwind CSS"],
      },
      {
        name: "Business Management System",
        description: "All-in-one business operations management with reporting and team collaboration",
        tech: ["React", "Node.js", "Express", "PostgreSQL"],
      },
    ],
    achievements: [
      "Architecting scalable database schemas using Prisma ORM with PostgreSQL",
      "Building RESTful APIs and server actions with Next.js App Router",
      "Implementing complex business logic for ERP modules and healthcare workflows",
      "Creating responsive, accessible UIs with TanStack Query for data management",
    ],
    technologies: ["Next.js", "Node.js", "Prisma", "PostgreSQL", "TypeScript", "TanStack Query", "Tailwind CSS"],
  },
  {
    title: "Junior Frontend Developer",
    company: "Ankabut Software",
    location: "Rajshahi",
    period: "Jun 2024 – Apr 2025",
    type: "Full-time",
    status: "completed",
    description: "Developed and delivered frontend modules for various client projects and custom CMS platforms.",
    achievements: [
      "Successfully delivered over 30 frontend modules for various client projects",
      "Built responsive, performant, and pixel-perfect UIs using React.js and Tailwind CSS",
      "Integrated various third-party APIs ensuring clean code architecture and UI scalability",
      "Collaborated with design and backend teams to deliver high-quality solutions",
    ],
    technologies: ["React.js", "Tailwind CSS", "JavaScript", "RESTful APIs", "Git", "Figma"],
    keyProject: {
      name: "RAJSEBA",
      description: "A home service booking platform built with Next.js, TypeScript, and Tailwind CSS",
      url: "rajseba.com",
    },
  },
]

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="py-20 bg-gradient-to-br from-slate-950 to-slate-900 text-white relative overflow-hidden"
    >
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Work Experience
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            My professional journey building enterprise applications
          </p>
        </motion.div>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-900/70 border border-slate-700 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300">
                <CardHeader className="pb-4 pt-6 px-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`p-3 rounded-full ${
                        exp.status === "current" ? "bg-emerald-500/20 text-emerald-400" : "bg-cyan-500/20 text-cyan-400"
                      }`}
                    >
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                        {exp.title}
                      </CardTitle>
                      <div className="text-xl font-semibold text-amber-400">{exp.company}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-300 text-sm bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span>{exp.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span>{exp.period}</span>
                    </div>
                    <Badge
                      className={`text-white px-3 py-1 rounded-full text-xs font-medium ml-auto ${
                        exp.status === "current" ? "bg-emerald-600" : "bg-cyan-600"
                      }`}
                    >
                      {exp.status === "current" ? "Current Role" : "Completed"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 px-6 pb-6 space-y-6">
                  <p className="text-slate-200 leading-relaxed text-lg border-l-4 border-slate-700 pl-4">
                    {exp.description}
                  </p>

                  {exp.projects && (
                    <div className="bg-slate-800/70 p-5 rounded-lg border border-slate-700">
                      <h4 className="text-xl font-semibold text-amber-400 mb-4 flex items-center gap-3">
                        <Building2 className="w-6 h-6" /> Current Projects:
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {exp.projects.map((project, projIndex) => (
                          <motion.div
                            key={projIndex}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: projIndex * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-slate-900/50 p-4 rounded-lg border border-slate-600"
                          >
                            <h5 className="font-semibold text-white mb-2">{project.name}</h5>
                            <p className="text-slate-300 text-sm mb-3">{project.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {project.tech.map((t) => (
                                <Badge
                                  key={t}
                                  variant="outline"
                                  className="text-xs border-emerald-500/50 text-emerald-400"
                                >
                                  {t}
                                </Badge>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-800/70 p-5 rounded-lg border border-slate-700">
                    <h4 className="text-xl font-semibold text-emerald-400 mb-4 flex items-center gap-3">
                      <Award className="w-6 h-6" /> Key Achievements:
                    </h4>
                    <ul className="space-y-3">
                      {exp.achievements.map((achievement, achIndex) => (
                        <motion.li
                          key={achIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: achIndex * 0.05 }}
                          viewport={{ once: true }}
                          className="flex items-start gap-3 text-slate-200 text-base"
                        >
                          <span className="text-emerald-400 mt-1">✓</span>
                          <span>{achievement}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-800/70 p-5 rounded-lg border border-slate-700">
                    <h4 className="text-xl font-semibold text-cyan-400 mb-4 flex items-center gap-3">
                      <Code className="w-6 h-6" /> Technologies Used:
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {exp.technologies.map((tech, techIndex) => (
                        <motion.div
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: techIndex * 0.05 }}
                          viewport={{ once: true }}
                        >
                          <Badge
                            variant="outline"
                            className="border-slate-600 text-slate-200 hover:border-cyan-400 hover:text-cyan-400 transition-colors text-sm px-3 py-1"
                          >
                            {tech}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {exp.keyProject && (
                    <div className="bg-slate-800/70 p-5 rounded-lg border border-slate-700">
                      <h4 className="text-xl font-semibold text-amber-400 mb-3 flex items-center gap-3">
                        <ExternalLink className="w-6 h-6" />
                        Key Project
                      </h4>
                      <div className="space-y-2">
                        <p className="text-white font-semibold text-lg">{exp.keyProject.name}</p>
                        <p className="text-slate-200 text-base">{exp.keyProject.description}</p>
                        <a
                          href={`https://${exp.keyProject.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline flex items-center gap-2 text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Visit {exp.keyProject.name}
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
