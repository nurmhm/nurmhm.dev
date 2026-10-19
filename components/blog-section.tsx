"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Calendar, Clock } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"
import { SectionHeading } from "@/components/section-heading"
import type { PublicPortfolioProfile } from "@/lib/profile"

export function BlogSection({ profile }: { profile: PublicPortfolioProfile }) {
  const { t } = useI18n()

  return (
    <section id="blog" className="bg-slate-900 py-24">
      <div className="container mx-auto px-4">
        <SectionHeading eyebrow={t.blog.eyebrow} title={profile.blogHeading} description={profile.blogDescription} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {profile.blogPosts.map((post, index) => (
            <motion.a key={`${post.title}-${index}`} href={post.link} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.08 }} viewport={{ once: true }} className="group flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60 transition hover:-translate-y-1 hover:border-emerald-500/40">
              <div className="aspect-[16/9] overflow-hidden bg-slate-800">
                <img src={post.image || "/placeholder.svg"} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div lang="en" className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300">{tag}</span>)}
                </div>
                <h3 className="mt-3 font-semibold leading-snug text-white">{post.title}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-400">{post.excerpt}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readTime}</span>
                  </span>
                </div>
              </div>
              <span className="flex items-center gap-1.5 border-t border-slate-800 px-5 py-3 text-sm font-medium text-emerald-400 group-hover:text-emerald-300">
                {t.blog.readMore} <ArrowUpRight className="h-4 w-4" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
