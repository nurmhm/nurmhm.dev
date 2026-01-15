"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail, MapPin, Phone, Download, Terminal, SunMedium } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { DynamicCodeDisplay } from "./dynamic-code-display"

interface HeroSectionProps {
  onToggleCLI: () => void
}

export function HeroSection({ onToggleCLI }: HeroSectionProps) {
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null)

  const handleDownloadResume = () => {
    setDownloadMessage("Simulating download... (In a real app, your resume would download here!)")
    setTimeout(() => {
      setDownloadMessage(null)
    }, 3000)
  }

  const codeSnippets = [
    `// Web Development
const developer = {
  name: "Nur Mohammad",
  role: "Web Developer",
  stack: ["Next.js", "Node.js", "Prisma", "PostgreSQL"],
  passion: "Building enterprise solutions"
};`,
    `// Enterprise ERP Solutions
async function buildERP() {
  const modules = await prisma.module.findMany({
    include: { features: true }
  });
  return "E-commerce ERP System Ready!";
}`,
    `// Healthcare Systems
class HealthcareApp {
  async bookAppointment(patientId: string) {
    return prisma.appointment.create({
      data: { patientId, status: "SCHEDULED" }
    });
  }
}`,
  ]

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden pt-16"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side - Main Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white space-y-8"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="drop-shadow-lg"
            >
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent leading-tight">
                Nur Mohammad
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="drop-shadow-md"
            >
              <p className="text-2xl lg:text-3xl text-white font-semibold">Web Developer</p>
              <p className="text-lg text-emerald-400 font-medium mt-1">Next.js • Node.js • Prisma • PostgreSQL</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-4"
          >
            <p className="text-lg text-slate-200 leading-relaxed max-w-2xl">
              Web Developer with 1.5+ years of experience building enterprise-grade applications. Currently at{" "}
              <span className="text-emerald-400 font-semibold">Trodad International</span> developing E-commerce ERP,
              Doctor Appointment Systems, Hospital Portfolio, and Business Management platforms.
            </p>

            <div className="flex flex-wrap gap-2">
              {["Next.js", "Node.js", "Prisma", "PostgreSQL", "TypeScript", "React"].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-slate-800/80 border border-slate-700 rounded-full text-sm text-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-slate-200">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+8801770514004</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>nurmhm.dev@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white"
              onClick={handleDownloadResume}
            >
              <Download className="w-5 h-5 mr-2" />
              Download Resume
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400 bg-transparent"
              onClick={onToggleCLI}
            >
              <Terminal className="w-5 h-5 mr-2" />
              Open CLI
            </Button>

            <div className="flex gap-3">
              <Button
                size="icon"
                variant="outline"
                className="border-slate-600 hover:bg-slate-800 bg-transparent text-slate-200"
                asChild
              >
                <a href="https://github.com/nurmhm" target="_blank" rel="noopener noreferrer" title="GitHub Profile">
                  <Github className="w-5 h-5" />
                </a>
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="border-slate-600 hover:bg-slate-800 bg-transparent text-slate-200"
                asChild
              >
                <a
                  href="https://linkedin.com/in/nurmhm7228"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </Button>
            
              <Button
                size="icon"
                variant="outline"
                className="border-slate-600 hover:bg-slate-800 bg-transparent text-slate-200"
                asChild
              >
                <a href="mailto:nurmhm.dev@gmail.com" title="Send Email">
                  <Mail className="w-5 h-5" />
                </a>
              </Button>
                 <Button
                size="icon"
                variant="outline"
                className="border-slate-600 hover:bg-slate-800 bg-transparent text-slate-200"
                asChild
              >
                <a
                  href="https://medium.com/@nurmhm"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Medium Profile"
                >
                  <img src="/medium.png" alt="" />
                </a>
              </Button>
            </div>
          </motion.div>
          {downloadMessage && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-emerald-400 text-sm mt-2"
            >
              {downloadMessage}
            </motion.p>
          )}
        </motion.div>

        {/* Right Side - Dynamic Code Display */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          <DynamicCodeDisplay codeSnippets={codeSnippets} />

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute lg:-bottom-8  -bottom-1 -right-1 lg:-right-2 w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-500/50 shadow-xl z-20"
          >
            <img
              src="/akash.jpeg"
              alt="Nur Mohammad's professional headshot"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
