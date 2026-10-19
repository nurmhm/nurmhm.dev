"use client"

import { motion } from "framer-motion"
import { Quote, Star } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"
import { SectionHeading } from "@/components/section-heading"
import type { PublicPortfolioProfile } from "@/lib/profile"

export function TestimonialsSection({ profile }: { profile: PublicPortfolioProfile }) {
  const { t } = useI18n()

  return (
    <section id="testimonials" className="bg-slate-950 py-24">
      <div className="container mx-auto px-4">
        <SectionHeading eyebrow={t.testimonials.eyebrow} title={profile.testimonialsHeading} description={profile.testimonialsDescription} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {profile.testimonials.map((testimonial, index) => (
            <motion.figure key={`${testimonial.name}-${index}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.08 }} viewport={{ once: true }} className="relative flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <Quote className="absolute right-5 top-5 h-8 w-8 text-emerald-500/20" aria-hidden />
              <div className="flex gap-0.5" aria-label={`${testimonial.rating}/5`}>
                {Array.from({ length: testimonial.rating }).map((_, starIndex) => <Star key={starIndex} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
              </div>
              {/* Quotes are shown exactly as given, in their original language. */}
              <blockquote lang="en" className="mt-4 flex-1 leading-relaxed text-slate-200">“{testimonial.quote}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-800 pt-5">
                <img src={testimonial.avatar || "/placeholder-user.jpg"} alt={testimonial.name} className="h-11 w-11 rounded-full border border-slate-700 object-cover" />
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-slate-400">{testimonial.title}, {testimonial.company}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
