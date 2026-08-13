"use client"

import { useState } from "react"
import { AboutSection } from "@/components/about-section"
import { BlogSection } from "@/components/blog-section"
import { CLITerminal } from "@/components/cli-terminal"
import { ContactSection } from "@/components/contact-section"
import { EducationSection } from "@/components/education-section"
import { ExperienceSection } from "@/components/experience-section"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { Navigation } from "@/components/navigation"
import { ProjectsSection } from "@/components/projects-section"
import { SkillsSection } from "@/components/skills-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import type { PublicPortfolioProfile } from "@/lib/profile"

type PortfolioContentProps = {
  profile: PublicPortfolioProfile
  currentYear: number
}

export function PortfolioContent({ profile, currentYear }: PortfolioContentProps) {
  const [isCLIOpen, setIsCLIOpen] = useState(false)

  return (
    <main className="relative">
      <Navigation onToggleCLI={() => setIsCLIOpen((isOpen) => !isOpen)} profile={profile} />
      <HeroSection onToggleCLI={() => setIsCLIOpen((isOpen) => !isOpen)} profile={profile} />
      <AboutSection profile={profile} />
      <SkillsSection profile={profile} />
      <ExperienceSection profile={profile} />
      <ProjectsSection profile={profile} />
      <TestimonialsSection />
      <BlogSection />
      <EducationSection />
      <ContactSection profile={profile} />
      <Footer profile={profile} currentYear={currentYear} />
      <CLITerminal isOpen={isCLIOpen} onClose={() => setIsCLIOpen(false)} />
    </main>
  )
}