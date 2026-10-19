"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { useI18n } from "@/components/i18n-provider"
import { SectionHeading } from "@/components/section-heading"
import type { PublicPortfolioProfile } from "@/lib/profile"

export function ProcessSection({ profile }: { profile: PublicPortfolioProfile }) {
  const { t } = useI18n()
  const listRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 60%"] })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="process" className="bg-slate-950 py-24">
      <div className="container mx-auto px-4">
        <SectionHeading eyebrow={t.process.eyebrow} title={t.process.title} description={t.process.description} />
        <ol ref={listRef} className="relative mx-auto max-w-3xl space-y-10 pl-10">
          <div className="absolute bottom-2 left-[15px] top-2 w-px bg-slate-800" aria-hidden />
          <motion.div style={{ scaleY: lineScale }} className="absolute bottom-2 left-[15px] top-2 w-px origin-top bg-gradient-to-b from-emerald-400 to-cyan-400" aria-hidden />
          {profile.processSteps.map((step, index) => (
            <motion.li key={step.title} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, margin: "-60px" }} className="relative">
              <span className="absolute -left-10 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/50 bg-slate-950 font-mono text-sm text-emerald-300">{index + 1}</span>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <span className="font-mono text-xs text-cyan-400">{step.duration}</span>
              </div>
              <p className="mt-1.5 text-slate-300">{step.description}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
