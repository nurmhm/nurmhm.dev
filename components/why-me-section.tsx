"use client"

import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"
import { SectionHeading } from "@/components/section-heading"

export function WhyMeSection() {
  const { t } = useI18n()
  return (
    <section id="why-me" className="bg-slate-900 py-24">
      <div className="container mx-auto px-4">
        <SectionHeading eyebrow={t.whyMe.eyebrow} title={t.whyMe.title} description={t.whyMe.description} />
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-800">
          <div className="grid grid-cols-[1fr_1.3fr_1.3fr] bg-slate-950/80 text-xs font-semibold uppercase tracking-wider sm:text-sm">
            <div className="p-3 text-slate-500 sm:p-4" />
            <div className="p-3 text-emerald-400 sm:p-4">{t.whyMe.me}</div>
            <div className="p-3 text-slate-500 sm:p-4">{t.whyMe.agency}</div>
          </div>
          {t.whyMe.rows.map((row) => (
            <div key={row.topic} className="grid grid-cols-[1fr_1.3fr_1.3fr] border-t border-slate-800 text-sm">
              <div className="p-3 font-medium text-slate-200 sm:p-4">{row.topic}</div>
              <div className="flex gap-2 bg-emerald-500/5 p-3 text-slate-200 sm:p-4"><Check className="mt-0.5 hidden h-4 w-4 shrink-0 text-emerald-400 sm:block" />{row.me}</div>
              <div className="flex gap-2 p-3 text-slate-400 sm:p-4"><X className="mt-0.5 hidden h-4 w-4 shrink-0 text-rose-400/70 sm:block" />{row.agency}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
