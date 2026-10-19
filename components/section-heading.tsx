"use client"

import { motion } from "framer-motion"

export function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mx-auto mb-14 max-w-3xl text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-emerald-400">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{title}</h2>
      {description && <p className="mt-4 text-lg text-slate-300">{description}</p>}
    </motion.div>
  )
}
