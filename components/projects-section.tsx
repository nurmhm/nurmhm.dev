"use client"

import { motion } from "framer-motion"
import { ExternalLink, Github, Lightbulb, Target, Trophy, UserCheck } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"
import { SectionHeading } from "@/components/section-heading"
import type { PublicPortfolioProfile } from "@/lib/profile"

export function ProjectsSection({ profile }: { profile: PublicPortfolioProfile }) {
  const { t } = useI18n()
  return (
    <section id="projects" className="bg-slate-900 py-24">
      <div className="container mx-auto px-4">
        <SectionHeading eyebrow={t.projects.eyebrow} title={profile.projectsHeading} description={profile.projectsDescription} />
        <div className="space-y-10">
          {profile.projects.map((project, index) => {
            const hasCaseStudy = Boolean(project.problem || project.approach || project.result)
            return (
              <motion.article key={`${project.title}-${index}`} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true, margin: "-80px" }} className="grid overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60 lg:grid-cols-2">
                <div className={`group relative min-h-64 overflow-hidden bg-slate-800 ${index % 2 ? "lg:order-2" : ""}`}>
                  <img src={project.image || "/placeholder.svg"} alt={project.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs text-slate-200 ring-1 ring-slate-700">{project.category}</span>
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300 ring-1 ring-emerald-500/40">{project.status}</span>
                    {project.soloBuilt && <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-200 ring-1 ring-cyan-500/40"><UserCheck className="h-3 w-3" />{t.projects.soloBuilt}</span>}
                  </div>
                </div>

                <div className="flex flex-col p-6 sm:p-8">
                  <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                  <p className="mt-1 text-emerald-400">{project.subtitle}</p>
                  {hasCaseStudy ? (
                    <dl className="mt-6 space-y-4 text-sm">
                      {project.problem && <CaseStep icon={Target} label={t.projects.problem} text={project.problem} />}
                      {project.approach && <CaseStep icon={Lightbulb} label={t.projects.approach} text={project.approach} />}
                      {project.result && <CaseStep icon={Trophy} label={t.projects.result} text={project.result} />}
                    </dl>
                  ) : (
                    <p className="mt-4 text-sm leading-relaxed text-slate-300">{project.description}</p>
                  )}
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => <span key={tech} className="rounded bg-slate-800 px-2 py-1 font-mono text-xs text-slate-300">{tech}</span>)}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-3 pt-6">
                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"><ExternalLink className="h-4 w-4" />{t.projects.live}</a>}
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:border-slate-400"><Github className="h-4 w-4" />{t.projects.code}</a>}
                    {project.company && <span className="self-center text-xs text-slate-500">{t.projects.builtFor} {project.company}</span>}
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CaseStep({ icon: Icon, label, text }: { icon: typeof Target; label: string; text: string }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
      <div>
        <dt className="font-semibold text-slate-100">{label}</dt>
        <dd className="mt-0.5 leading-relaxed text-slate-300">{text}</dd>
      </div>
    </div>
  )
}
