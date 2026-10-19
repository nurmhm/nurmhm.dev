"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, MessageCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useI18n } from "@/components/i18n-provider"
import { scrollToSection, whatsappHref } from "@/lib/contact-links"

/** Floating call-to-action shown between the hero and the contact section. */
export function StickyCta({ whatsappNumber }: { whatsappNumber: string }) {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => {
      const contact = document.getElementById("contact")
      const pastHero = window.scrollY > window.innerHeight * 0.8
      const atContact = contact ? contact.getBoundingClientRect().top < window.innerHeight * 0.6 : false
      setVisible(pastHero && !atContact)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="fixed bottom-4 right-4 z-30 flex items-center gap-2 sm:bottom-6 sm:right-6">
          <a href={whatsappHref(whatsappNumber, t.whatsappMessage)} target="_blank" rel="noopener noreferrer" aria-label={t.sticky.whatsapp} className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:scale-105">
            <MessageCircle className="h-5 w-5" />
          </a>
          <button type="button" onClick={() => scrollToSection("contact")} className="inline-flex h-12 items-center gap-2 rounded-full border border-emerald-500/40 bg-slate-950/90 px-5 text-sm font-semibold text-white shadow-lg backdrop-blur transition hover:border-emerald-400">
            {t.sticky.startProject} <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
