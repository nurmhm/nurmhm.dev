"use client"

import { motion } from "framer-motion"
import { Briefcase, Calendar, Check, MapPin } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"
import { SectionHeading } from "@/components/section-heading"
import type { PublicPortfolioProfile } from "@/lib/profile"

export function ExperienceSection({ profile }: { profile: PublicPortfolioProfile }) {
  const { t } = useI18n()

  return (
    <section id="experience" className="bg-slate-900 py-24">
      <div className="container mx-auto px-4">
        <SectionHeading eyebrow={t.experience.eyebrow} title={profile.experienceHeading} description={profile.experienceDescription} />
        <ol className="relative mx-auto max-w-4xl space-y-8 border-l border-slate-800 pl-8 sm:pl-10">
          {profile.experiences.map((experience, index) => (
            <motion.li key={`${experience.company}-${index}`} initial={{ opacity: 0, x: 25 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, margin: "-60px" }} className="relative">
              <span className={`absolute -left-[3.05rem] top-1 flex h-9 w-9 items-center justify-center rounded-full border bg-slate-900 sm:-left-[3.55rem] ${experience.isCurrent ? "border-emerald-500 text-emerald-300" : "border-slate-700 text-slate-400"}`}>
                <Briefcase className="h-4 w-4" />
              </span>
              <article className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 transition hover:border-emerald-500/40">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{experience.title}</h3>
                    <p className="mt-0.5 font-medium text-emerald-400">{experience.company}</p>
                  </div>
                  {experience.isCurrent && <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">{t.experience.current}</span>}
                </div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-400">
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{experience.period}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{experience.location}</span>
                  <span>{experience.employmentType}</span>
                </div>
                <p className="mt-4 leading-relaxed text-slate-300">{experience.description}</p>
                <h4 className="mt-5 text-sm font-semibold uppercase tracking-wider text-slate-500">{t.experience.achievements}</h4>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {experience.achievements.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-slate-300"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />{item}</li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {experience.technologies.map((technology) => <span key={technology} className="rounded bg-slate-800 px-2 py-1 font-mono text-xs text-slate-300">{technology}</span>)}
                </div>
              </article>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
