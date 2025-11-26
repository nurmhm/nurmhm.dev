"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { SkillsSection } from "@/components/skills-section"
import { ExperienceSection } from "@/components/experience-section"
import { ProjectsSection } from "@/components/projects-section"
import { TestimonialsSection } from "@/components/testimonials-section" // New import
import { BlogSection } from "@/components/blog-section" // New import
import { EducationSection } from "@/components/education-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer" // New import
import { CLITerminal } from "@/components/cli-terminal"
import { MatrixBackground } from "@/components/matrix-background"
import { CodeRain } from "@/components/code-rain"

export default function Home() {
  const [isCLIOpen, setIsCLIOpen] = useState(false)

  const toggleCLI = () => {
    setIsCLIOpen(!isCLIOpen)
  }

  return (
    <main className="relative">
      <MatrixBackground />
      <CodeRain />
      <Navigation onToggleCLI={toggleCLI} />
      <HeroSection onToggleCLI={toggleCLI} />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <TestimonialsSection /> {/* New section */}
      <BlogSection /> {/* New section */}
      <EducationSection />
      <ContactSection />
      <Footer /> {/* New section */}
      <CLITerminal isOpen={isCLIOpen} onClose={() => setIsCLIOpen(false)} />
    </main>
  )
}
