"use client"

import { motion } from "framer-motion"
import { Award, Briefcase, Calendar, Code, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PublicPortfolioProfile } from "@/lib/profile"

export function ExperienceSection({ profile }: { profile: PublicPortfolioProfile }) {
  return (
    <section id="experience" className="relative overflow-hidden bg-slate-950 py-20 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mb-14 text-center">
          <h2 className="mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-4xl font-bold text-transparent lg:text-5xl">{profile.experienceHeading}</h2>
          <p className="mx-auto max-w-3xl text-xl text-slate-300">{profile.experienceDescription}</p>
        </motion.div>
        <div className="space-y-8">
          {profile.experiences.map((experience, index) => (
            <motion.div key={`${experience.company}-${experience.title}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }}>
              <Card className="overflow-hidden border-slate-700 bg-slate-900/70 transition-colors hover:border-emerald-500/50">
                <CardHeader className="px-6 pb-4 pt-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex gap-4"><div className={`rounded-full p-3 ${experience.isCurrent ? "bg-emerald-500/20 text-emerald-400" : "bg-cyan-500/20 text-cyan-400"}`}><Briefcase className="h-6 w-6" /></div><div><CardTitle className="text-2xl text-white">{experience.title}</CardTitle><p className="mt-1 text-xl font-semibold text-amber-400">{experience.company}</p></div></div>
                    <Badge className={experience.isCurrent ? "bg-emerald-600" : "bg-cyan-600"}>{experience.isCurrent ? "Current role" : "Completed"}</Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 rounded-md border border-slate-700/70 bg-slate-800/50 p-3 text-sm text-slate-300"><span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-400" />{experience.location}</span><span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-cyan-400" />{experience.period}</span><span>{experience.employmentType}</span></div>
                </CardHeader>
                <CardContent className="space-y-6 px-6 pb-6"><p className="border-l-4 border-slate-700 pl-4 text-lg leading-relaxed text-slate-200">{experience.description}</p><div className="grid gap-6 md:grid-cols-2"><div><h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-emerald-400"><Award className="h-5 w-5" />Key achievements</h3><ul className="space-y-2 text-slate-300">{experience.achievements.map((item) => <li key={item} className="flex gap-2"><span className="text-emerald-400">✓</span>{item}</li>)}</ul></div><div><h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-cyan-400"><Code className="h-5 w-5" />Technologies</h3><div className="flex flex-wrap gap-2">{experience.technologies.map((technology) => <Badge key={technology} variant="outline" className="border-slate-600 text-slate-200">{technology}</Badge>)}</div></div></div></CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}