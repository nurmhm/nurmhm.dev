"use client"

import { ArrowRight, Github, Linkedin, Mail, MapPin, MessageCircle } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"
import { scrollToSection, whatsappHref } from "@/lib/contact-links"
import type { PublicPortfolioProfile } from "@/lib/profile"

export function Footer({ profile, currentYear }: { profile: PublicPortfolioProfile; currentYear: number }) {
  const { t } = useI18n()

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-800 py-10 sm:flex-row sm:items-center">
          <p className="text-2xl font-semibold text-white">{t.footer.cta}</p>
          <button type="button" onClick={() => scrollToSection("contact")} className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:brightness-110">
            {t.footer.ctaButton} <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_0.8fr_1.2fr]">
          <div>
            <p className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-xl font-bold text-transparent">{profile.fullName}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed">{profile.shortBio}</p>
            <div className="mt-5 flex gap-3">
              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub" className="rounded-md border border-slate-800 p-2 hover:border-slate-600 hover:text-white"><Github className="h-4 w-4" /></a>
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="rounded-md border border-slate-800 p-2 hover:border-slate-600 hover:text-white"><Linkedin className="h-4 w-4" /></a>
              <a href={`mailto:${profile.email}`} title="Email" className="rounded-md border border-slate-800 p-2 hover:border-slate-600 hover:text-white"><Mail className="h-4 w-4" /></a>
            </div>
          </div>

          <nav aria-label={t.footer.services}>
            <p className="text-sm font-semibold text-white">{t.footer.services}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {profile.services.slice(0, 6).map((service) => (
                <li key={service.title}><a href="#services" className="hover:text-emerald-300">{service.title}</a></li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t.footer.explore}>
            <p className="text-sm font-semibold text-white">{t.footer.explore}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {t.footer.links.map((link) => <li key={link.href}><a href={link.href} className="hover:text-emerald-300">{link.label}</a></li>)}
            </ul>
          </nav>

          <div>
            <p className="text-sm font-semibold text-white">{t.footer.contact}</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href={`mailto:${profile.email}`} className="flex items-center gap-2 break-all hover:text-emerald-300"><Mail className="h-4 w-4 shrink-0" />{profile.email}</a></li>
              <li><a href={whatsappHref(profile.whatsappNumber, t.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-emerald-300"><MessageCircle className="h-4 w-4 shrink-0" />WhatsApp</a></li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" />{profile.location}</li>
              <li>
                <a href={t.langSwitch.href} hrefLang={t.langSwitch.hrefLang} lang={t.langSwitch.hrefLang} className="inline-flex rounded-full border border-slate-700 px-3 py-1 text-slate-300 hover:border-emerald-400 hover:text-emerald-300">
                  {t.langSwitch.label}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
          © {currentYear} {profile.fullName}. {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
