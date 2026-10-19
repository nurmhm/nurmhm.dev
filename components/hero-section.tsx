"use client"

import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { ArrowRight, CalendarDays, Github, Linkedin, MapPin, MessageCircle, Terminal } from "lucide-react"
import { BriefGenerator, type BriefDraft } from "@/components/brief-generator"
import { useI18n } from "@/components/i18n-provider"
import { scrollToSection, whatsappHref } from "@/lib/contact-links"
import type { PublicPortfolioProfile } from "@/lib/profile"

const ConstellationBackground = dynamic(() => import("@/components/constellation-bg"), { ssr: false })

interface HeroSectionProps {
  onToggleCLI: () => void
  onSendBrief: (draft: BriefDraft) => void
  profile: PublicPortfolioProfile
}

export function HeroSection({ onToggleCLI, onSendBrief, profile }: HeroSectionProps) {
  const { t } = useI18n()
  const firstName = profile.fullName.split(" ")[0]

  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden bg-slate-950 pb-16 pt-24">
      {/* Static glows double as the fallback when the WebGL constellation is not rendered. */}
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute left-10 top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>
      <ConstellationBackground />

      <div className="container relative z-10 mx-auto grid items-center gap-12 px-4 lg:grid-cols-[1.05fr_1fr]">
        <div className="space-y-7 text-white">
          {profile.availabilityNote && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {profile.availabilityNote}
            </motion.div>
          )}

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl xl:text-6xl">
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">{profile.heroHeadline}</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="max-w-xl text-lg leading-relaxed text-slate-300">
            {profile.heroSubheadline}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => scrollToSection("contact")} className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:brightness-110">
              {t.hero.startProject} <ArrowRight className="h-4 w-4" />
            </button>
            <a href={whatsappHref(profile.whatsappNumber, t.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-slate-600 px-6 py-3 font-semibold text-slate-100 transition hover:border-emerald-400 hover:text-emerald-300">
              <MessageCircle className="h-4 w-4" /> {t.hero.whatsapp}
            </a>
            {profile.bookingUrl && (
              <a href={profile.bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-2 py-3 text-sm font-medium text-cyan-300 hover:text-cyan-200">
                <CalendarDays className="h-4 w-4" /> {t.hero.bookCall}
              </a>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.45 }} className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
            <span className="font-medium text-slate-200">{profile.fullName}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-emerald-400" />{profile.location} · {t.hero.worldwide}</span>
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white" title="GitHub"><Github className="h-4 w-4" /></a>
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white" title="LinkedIn"><Linkedin className="h-4 w-4" /></a>
            <button type="button" onClick={onToggleCLI} className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-500 hover:text-emerald-300" title={t.hero.cliTitle}>
              <Terminal className="h-3.5 w-3.5" /> {t.hero.openCli}
            </button>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
          <BriefGenerator firstName={firstName} onSendBrief={onSendBrief} />
        </motion.div>
      </div>
    </section>
  )
}
