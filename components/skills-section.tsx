"use client"

import { motion } from "framer-motion"
import { Bot, Check, Cloud, Code, Database, Languages, Server, Smartphone } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"
import { SectionHeading } from "@/components/section-heading"
import type { PublicPortfolioProfile } from "@/lib/profile"

const categoryIcons = [Code, Server, Smartphone, Database, Bot, Cloud]

export function SkillsSection({ profile }: { profile: PublicPortfolioProfile }) {
  const { t } = useI18n()

  return (
    <section id="skills" className="bg-slate-950 py-24">
      <div className="container mx-auto px-4">
        <SectionHeading eyebrow={t.skills.eyebrow} title={profile.skillsHeading} description={profile.skillsDescription} />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {profile.skillCategories.map((category, index) => {
            const Icon = categoryIcons[index] ?? Code
            return (
              <motion.div key={`${category.title}-${index}`} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: (index % 3) * 0.08 }} viewport={{ once: true }} className="group rounded-xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-emerald-500/40">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-300 ring-1 ring-emerald-500/30">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span key={skill} className="rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1 font-mono text-xs text-slate-300 transition group-hover:border-slate-600">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="mt-5 grid gap-5 md:grid-cols-[2fr_1fr]">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold text-white">{t.skills.workingStyle}</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {profile.softSkills.map((skill) => (
                <li key={skill} className="flex items-center gap-2 text-slate-300"><Check className="h-4 w-4 shrink-0 text-emerald-400" />{skill}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white"><Languages className="h-5 w-5 text-cyan-400" />{t.skills.languages}</h3>
            <ul className="mt-4 space-y-3">
              {profile.languages.map((language) => (
                <li key={language.name} className="flex items-center justify-between gap-3">
                  <span className="text-slate-200">{language.name}</span>
                  <span className="rounded-full bg-cyan-500/15 px-3 py-0.5 text-xs text-cyan-300">{language.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
