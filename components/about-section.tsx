"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Target, Server, Database } from "lucide-react"

export function AboutSection() {
  const highlights = [
    {
      icon: Code,
      title: "2+ Years Experience",
      description: "Building modern Web web applications",
      color: "text-emerald-400",
    },
    {
      icon: Server,
      title: "Web Developer",
      description: "Next.js, Node.js, Prisma, PostgreSQL specialist",
      color: "text-cyan-400",
    },
    {
      icon: Database,
      title: "Enterprise Solutions",
      description: "ERP, Healthcare, Business Management systems",
      color: "text-amber-400",
    },
    {
      icon: Target,
      title: "Performance Focused",
      description: "Optimizing applications for speed and scalability",
      color: "text-blue-400",
    },
  ]

  return (
    <section id="about" className="py-20 bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            About Me
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Web Developer building enterprise-grade applications
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-4">Hello, I'm Nur Mohammad</h3>
              <p className="text-slate-200 leading-relaxed mb-4">
                I'm a Web Developer specializing in building enterprise-grade applications with modern
                technologies. Currently working at{" "}
                <span className="text-emerald-400 font-semibold">Trodad International</span>, where I develop complex
                systems including E-commerce ERP, Doctor Appointment Systems, Hospital Portfolio, and Business
                Management platforms.
              </p>
              <p className="text-slate-200 leading-relaxed mb-4">
                My tech stack includes Next.js, Node.js, Prisma ORM, and PostgreSQL for building scalable, type-safe
                applications. I focus on clean architecture, efficient database design, and delivering high-quality user
                experiences.
              </p>
              <p className="text-slate-200 leading-relaxed">
                I believe in writing maintainable code, following best practices, and continuously learning to deliver
                enterprise solutions that make a real impact.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {["Web", "Problem Solver", "Team Player", "Fast Learner", "Detail Oriented"].map((trait) => (
                <Badge key={trait} variant="outline" className="border-emerald-500/30 text-emerald-400">
                  {trait}
                </Badge>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-slate-900/50 border-slate-700 hover:border-emerald-500/50 transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <item.icon className={`w-8 h-8 ${item.color} mx-auto mb-3`} />
                    <h4 className="font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-slate-300 text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
