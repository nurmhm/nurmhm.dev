"use client"

import { motion } from "framer-motion"
import { Clock, Handshake, Layers, MapPin, Sparkles, Target } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"
import type { PublicPortfolioProfile } from "@/lib/profile"

const highlightIcons = [Layers, Target, Handshake]

export function AboutSection({ profile }: { profile: PublicPortfolioProfile }) {
  const { t } = useI18n()

  return (
    <section id="about" className="relative overflow-hidden bg-slate-900 py-24">
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" aria-hidden />
      <div className="container relative mx-auto grid items-center gap-14 px-4 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-emerald-500/40 via-cyan-500/20 to-transparent blur-2xl" aria-hidden />
          <div className="relative overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-900">
            <img src={profile.portraitUrl || "/placeholder-user.jpg"} alt={profile.fullName} className="aspect-[4/5] w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-5 pt-16">
              <p className="text-lg font-semibold text-white">{profile.fullName}</p>
              <p className="text-sm text-emerald-300">{profile.professionalTitle}</p>
            </div>
          </div>
          <div className="absolute -right-4 top-8 rounded-xl border border-slate-700 bg-slate-900/95 px-4 py-3 shadow-xl backdrop-blur sm:-right-10">
            <p className="text-2xl font-bold text-white">{profile.yearsExperience}</p>
            <p className="text-xs text-slate-400">{t.about.experience}</p>
          </div>
          <div className="absolute -left-4 bottom-24 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/95 px-3 py-2 text-xs text-slate-300 shadow-xl backdrop-blur sm:-left-8">
            <Clock className="h-4 w-4 text-emerald-400" />
            <span>{t.about.replies} {profile.responseTime.toLowerCase()}</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} viewport={{ once: true }}>
          <p className="font-mono text-sm uppercase tracking-widest text-emerald-400">{t.about.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {t.about.greeting} <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{profile.fullName}</span>
          </h2>
          <p className="mt-3 text-lg text-slate-300">{profile.tagline}</p>
          <div className="mt-6 space-y-4 leading-relaxed text-slate-300">
            {profile.aboutParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {profile.traits.map((trait) => (
              <span key={trait} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-sm text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />{trait}
              </span>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {t.about.highlights.map((item, index) => {
              const Icon = highlightIcons[index] ?? Layers
              return (
                <div key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <Icon className="h-5 w-5 text-cyan-400" />
                  <p className="mt-3 font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.description}</p>
                </div>
              )
            })}
          </div>

          <p className="mt-6 flex items-center gap-2 text-sm text-slate-400">
            <MapPin className="h-4 w-4 text-emerald-400" />{t.about.basedIn}: {profile.location}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
