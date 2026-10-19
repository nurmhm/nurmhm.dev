"use client"

import { animate, motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import type { PublicPortfolioProfile } from "@/lib/profile"

/** Counts up the leading number of values like "30+" or "2+"; non-numeric values render as-is. */
function StatValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const match = value.match(/^(\D*)(\d+)(.*)$/)
  const [display, setDisplay] = useState(match ? `${match[1]}0${match[3]}` : value)

  useEffect(() => {
    if (!inView || !match) return
    const [, prefix, number, suffix] = match
    const controls = animate(0, Number(number), {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(`${prefix}${Math.round(latest)}${suffix}`),
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value])

  return <span ref={ref}>{display}</span>
}

export function ProofStrip({ profile }: { profile: PublicPortfolioProfile }) {
  return (
    <section aria-label="Highlights" className="border-y border-slate-800 bg-slate-900/60 py-10">
      <div className="container mx-auto grid grid-cols-2 gap-8 px-4 md:grid-cols-4">
        {profile.proofStats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.08 }} viewport={{ once: true }} className="text-center">
            <p className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
              <StatValue value={stat.value} />
            </p>
            <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
