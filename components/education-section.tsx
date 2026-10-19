"use client"

import { motion } from "framer-motion"
import { Award, Calendar, GraduationCap, MapPin } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"
import { SectionHeading } from "@/components/section-heading"
import type { PublicPortfolioProfile } from "@/lib/profile"

export function EducationSection({ profile }: { profile: PublicPortfolioProfile }) {
  const { t } = useI18n()

  return (
    <section id="education" className="bg-slate-950 py-24">
      <div className="container mx-auto px-4">
        <SectionHeading eyebrow={t.education.eyebrow} title={profile.educationHeading} description={profile.educationDescription} />
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
          {profile.education.map((item, index) => (
            <motion.article key={`${item.institution}-${index}`} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30"><GraduationCap className="h-5 w-5" /></span>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold leading-snug text-white">{item.degree}</h3>
                  <p className="mt-0.5 text-amber-300">{item.institution}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{item.period}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{item.location}</span>
                <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300">{item.status}</span>
                {item.cgpa && <span className="flex items-center gap-1 text-xs text-amber-300"><Award className="h-3.5 w-3.5" />{t.education.cgpa}: {item.cgpa}</span>}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">{item.description}</p>
              <div className="mt-5 grid flex-1 gap-5 sm:grid-cols-2">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.education.subjects}</h4>
                  <ul className="mt-2 space-y-1 text-sm text-slate-300">{item.subjects.map((subject) => <li key={subject}>• {subject}</li>)}</ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.education.achievements}</h4>
                  <ul className="mt-2 space-y-1 text-sm text-slate-300">{item.achievements.map((achievement) => <li key={achievement}>✓ {achievement}</li>)}</ul>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
