"use client"

import { useState } from "react"
import { AboutSection } from "@/components/about-section"
import { BlogSection } from "@/components/blog-section"
import type { BriefDraft } from "@/components/brief-generator"
import { CLITerminal } from "@/components/portfolio-cli"
import { ContactSection } from "@/components/contact-section"
import { EducationSection } from "@/components/education-section"
import { ExperienceSection } from "@/components/experience-section"
import { FaqSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { I18nProvider } from "@/components/i18n-provider"
import { LanguageSuggestion } from "@/components/language-suggestion"
import { Navigation } from "@/components/navigation"
import { ProcessSection } from "@/components/process-section"
import { ProjectsSection } from "@/components/projects-section"
import { ProofStrip } from "@/components/proof-strip"
import { ServicesSection } from "@/components/services-section"
import { SkillsSection } from "@/components/skills-section"
import { StickyCta } from "@/components/sticky-cta"
import { TestimonialsSection } from "@/components/testimonials-section"
import { WhyMeSection } from "@/components/why-me-section"
import { scrollToSection } from "@/lib/contact-links"
import type { Locale } from "@/lib/i18n"
import type { PublicPortfolioProfile } from "@/lib/profile"

type PortfolioContentProps = {
  profile: PublicPortfolioProfile
  currentYear: number
  locale: Locale
}

export function PortfolioContent({ profile, currentYear, locale }: PortfolioContentProps) {
  const [isCLIOpen, setIsCLIOpen] = useState(false)
  const [briefDraft, setBriefDraft] = useState<BriefDraft | null>(null)

  const sendBrief = (draft: BriefDraft) => {
    setBriefDraft(draft)
    scrollToSection("contact")
  }

  // Order follows the client journey: wow → proof → offer → evidence → trust → action.
  return (
    <I18nProvider locale={locale}>
      <main className="relative bg-slate-950">
        <Navigation onToggleCLI={() => setIsCLIOpen((isOpen) => !isOpen)} profile={profile} />
        <HeroSection onToggleCLI={() => setIsCLIOpen((isOpen) => !isOpen)} onSendBrief={sendBrief} profile={profile} />
        <ProofStrip profile={profile} />
        <ServicesSection profile={profile} />
        <ProjectsSection profile={profile} />
        <ProcessSection profile={profile} />
        <WhyMeSection />
        <TestimonialsSection profile={profile} />
        <AboutSection profile={profile} />
        <SkillsSection profile={profile} />
        <ExperienceSection profile={profile} />
        <EducationSection profile={profile} />
        <BlogSection profile={profile} />
        <FaqSection profile={profile} />
        <ContactSection profile={profile} draft={briefDraft} />
        <Footer profile={profile} currentYear={currentYear} />
        <StickyCta whatsappNumber={profile.whatsappNumber} />
        <LanguageSuggestion />
        <CLITerminal isOpen={isCLIOpen} onClose={() => setIsCLIOpen(false)} profile={profile} />
      </main>
    </I18nProvider>
  )
}
