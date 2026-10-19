"use client"

import { motion } from "framer-motion"
import { ArrowRight, Bot, Building2, Check, Clock, Cloud, Globe, LifeBuoy, Monitor, Palette, Plug, Rocket, ShieldCheck, ShoppingCart, Smartphone, Wrench } from "lucide-react"
import { useEffect, useState } from "react"
import { useI18n } from "@/components/i18n-provider"
import { SectionHeading } from "@/components/section-heading"
import { scrollToSection } from "@/lib/contact-links"
import { formatNumber, type Locale } from "@/lib/i18n"
import type { PublicPortfolioProfile } from "@/lib/profile"

const icons = {
  globe: Globe,
  smartphone: Smartphone,
  bot: Bot,
  cart: ShoppingCart,
  building: Building2,
  rocket: Rocket,
  palette: Palette,
  plug: Plug,
  monitor: Monitor,
  cloud: Cloud,
  shield: ShieldCheck,
  lifebuoy: LifeBuoy,
  wrench: Wrench,
}
type Currency = "BDT" | "USD"
const CURRENCY_KEY = "portfolio-currency"

function formatPrice(locale: Locale, currency: Currency, bdt: number, usd: number) {
  return currency === "BDT" ? `৳${formatNumber(locale, bdt)}` : `$${usd.toLocaleString("en-US")}`
}

export function ServicesSection({ profile }: { profile: PublicPortfolioProfile }) {
  const { locale, t } = useI18n()
  const [currency, setCurrency] = useState<Currency>(locale === "bn" ? "BDT" : "USD")

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_KEY)
      if (saved === "BDT" || saved === "USD") return setCurrency(saved)
    } catch {}
    if (navigator.language.toLowerCase().startsWith("bn") || Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Dhaka") {
      setCurrency("BDT")
    }
  }, [])

  const chooseCurrency = (next: Currency) => {
    setCurrency(next)
    try {
      localStorage.setItem(CURRENCY_KEY, next)
    } catch {}
  }

  return (
    <section id="services" className="bg-slate-950 py-24">
      <div className="container mx-auto px-4">
        <SectionHeading eyebrow={t.services.eyebrow} title={profile.servicesHeading} description={profile.servicesDescription} />

        <div className="mb-10 flex justify-center">
          <div role="radiogroup" aria-label={t.services.currency} className="inline-flex rounded-full border border-slate-700 bg-slate-900 p-1 text-sm">
            {(["BDT", "USD"] as const).map((option) => (
              <button key={option} type="button" role="radio" aria-checked={currency === option} onClick={() => chooseCurrency(option)} className={`rounded-full px-4 py-1.5 font-medium transition ${currency === option ? "bg-emerald-500 text-slate-950" : "text-slate-300 hover:text-white"}`}>
                {option === "BDT" ? "৳ BDT" : "$ USD"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {profile.services.map((service, index) => {
            const Icon = icons[service.icon as keyof typeof icons] ?? Globe
            return (
              <motion.article key={service.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: (index % 4) * 0.08 }} viewport={{ once: true }} className="group relative flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-6 transition hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-300 ring-1 ring-emerald-500/30">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{service.summary}</p>
                <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-300">
                  {service.deliverables.map((item) => (
                    <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />{item}</li>
                  ))}
                </ul>
                <div className="mt-6 border-t border-slate-800 pt-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500">{t.services.startingAt}</p>
                  <p className="mt-1 text-2xl font-bold text-white">{formatPrice(locale, currency, service.priceBdt, service.priceUsd)}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400"><Clock className="h-3.5 w-3.5" />{service.timeline}</p>
                  <button type="button" onClick={() => scrollToSection("contact")} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 transition group-hover:gap-2.5 hover:text-emerald-300">
                    {t.services.getQuote} <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.article>
            )
          })}
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">{t.services.note}</p>
      </div>
    </section>
  )
}
