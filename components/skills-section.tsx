"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Database, Palette, Server, Layers, Cloud } from "lucide-react"

const skillCategories = [
  {
    title: "Frontend Technologies",
    icon: Code,
    skills: ["React.js", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Vite"],
    color: "from-cyan-500 to-blue-500",
    borderColor: "border-cyan-500/30",
  },
  {
    title: "Backend & APIs",
    icon: Server,
    skills: ["Node.js", "Express.js", "Django REST Framework", "REST APIs", "GraphQL", "tRPC"],
    color: "from-emerald-500 to-teal-500",
    borderColor: "border-emerald-500/30",
  },
  {
    title: "Database & ORM",
    icon: Database,
    skills: ["PostgreSQL", "Prisma", "MongoDB", "MySQL", "Firebase", "Supabase", "Redis"],
    color: "from-orange-500 to-amber-500",
    borderColor: "border-orange-500/30",
  },
  {
    title: "State & Data Fetching",
    icon: Layers,
    skills: ["TanStack Query", "TanStack Table", "Redux", "Zustand", "React Hook Form", "Zod", "SWR"],
    color: "from-purple-500 to-pink-500",
    borderColor: "border-purple-500/30",
  },
  {
    title: "DevOps & Tools",
    icon: Cloud,
    skills: ["Git", "GitHub", "Docker", "Vercel", "Netlify", "CI/CD", "Linux"],
    color: "from-blue-500 to-indigo-500",
    borderColor: "border-blue-500/30",
  },
  {
    title: "Design & UI/UX",
    icon: Palette,
    skills: ["Figma", "Responsive Design", "Accessibility", "Design Systems", "Framer Motion"],
    color: "from-rose-500 to-red-500",
    borderColor: "border-rose-500/30",
  },
]

export function SkillsSection() {
  return (
    <section id="skills" className="py-20 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Technical Skills
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Web technologies I use to build enterprise applications
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                className={`bg-slate-800/50 border ${category.borderColor} hover:border-opacity-70 transition-all duration-300 h-full`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-white">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}>
                      <category.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg">{category.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: skillIndex * 0.05 }}
                        viewport={{ once: true }}
                      >
                        <Badge
                          variant="outline"
                          className="border-slate-600 text-slate-200 hover:border-emerald-500 hover:text-emerald-400 transition-all duration-300 cursor-pointer"
                        >
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Soft Skills & Languages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 grid md:grid-cols-2 gap-6"
        >
          <Card className="bg-slate-800/50 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-cyan-400">Soft Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Problem Solving",
                  "Team Collaboration",
                  "Communication",
                  "Fast Learning",
                  "Adaptability",
                  "Time Management",
                ].map((trait) => (
                  <div key={trait} className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span className="text-slate-200">{trait}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-pink-500/30">
            <CardHeader>
              <CardTitle className="text-pink-400">Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-200 font-medium">Bengali</span>
                  <Badge className="bg-emerald-600">Native</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-200 font-medium">English</span>
                  <Badge className="bg-cyan-600">Professional</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
