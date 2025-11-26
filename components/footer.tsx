"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail, Heart } from "lucide-react"

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-slate-950 py-12 text-slate-300 border-t border-slate-800"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-3">
              Nur Mohammad
            </h3>
            <p className="text-slate-400 text-sm">
              Web Developer building enterprise-grade applications with Next.js, Node.js, Prisma, and PostgreSQL.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <a href="#about" className="block hover:text-emerald-400 transition-colors">
                About
              </a>
              <a href="#projects" className="block hover:text-emerald-400 transition-colors">
                Projects
              </a>
              <a href="#experience" className="block hover:text-emerald-400 transition-colors">
                Experience
              </a>
              <a href="#contact" className="block hover:text-emerald-400 transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-white font-semibold mb-3">Tech Stack</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {["Next.js", "Node.js", "Prisma", "PostgreSQL", "TypeScript", "React"].map((tech) => (
                <span key={tech} className="px-2 py-1 bg-slate-800 rounded text-slate-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-sm">
          <p className="flex items-center justify-center gap-1 mb-2">
            Built with <Heart className="w-4 h-4 text-red-500" /> using Next.js, React & Tailwind CSS
          </p>
          <p className="text-slate-500 mb-4">&copy; {new Date().getFullYear()} Nur Mohammad. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <a
              href="https://github.com/nurmhm"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors"
              title="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/nurmhm7228"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="mailto:nurmd7228@gmail.com" className="hover:text-amber-400 transition-colors" title="Email">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
