"use client"

import { motion } from "framer-motion"
import { CalendarDays, CheckCircle2, CircleAlert, Clock, Loader2, Mail, MessageCircle, Send, Sparkles } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { BriefDraft } from "@/components/brief-generator"
import { useI18n } from "@/components/i18n-provider"
import { SectionHeading } from "@/components/section-heading"
import { submitLead } from "@/lib/actions/leads"
import { whatsappHref } from "@/lib/contact-links"
import { budgetRanges, projectTypes, timelines, type LeadFormState } from "@/lib/leads"
import type { PublicPortfolioProfile } from "@/lib/profile"

const fieldClass = "mt-1.5 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
const labelClass = "block text-sm font-medium text-slate-200"

export function ContactSection({ profile, draft }: { profile: PublicPortfolioProfile; draft: BriefDraft | null }) {
  const { locale, t } = useI18n()
  const c = t.contact
  const formRef = useRef<HTMLFormElement>(null)
  const [message, setMessage] = useState("")
  const [aiBrief, setAiBrief] = useState("")
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<LeadFormState>({ status: "idle", message: "" })

  useEffect(() => {
    if (!draft) return
    setMessage(draft.idea)
    setAiBrief(draft.brief)
    setResult({ status: "idle", message: "" })
  }, [draft])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending(true)
    try {
      const outcome = await submitLead(result, new FormData(event.currentTarget))
      setResult(outcome)
      if (outcome.status === "success") {
        formRef.current?.reset()
        setMessage("")
        setAiBrief("")
      }
    } catch {
      setResult({ status: "error", message: c.sendFailed })
    } finally {
      setPending(false)
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-slate-900 py-24">
      <div className="absolute left-1/2 top-0 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" aria-hidden />
      <div className="container relative mx-auto px-4">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} description={`${c.replyPrefix} ${profile.responseTime.toLowerCase()}.`} />

        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.5fr_1fr]">
          <motion.form ref={formRef} onSubmit={handleSubmit} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="space-y-5 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 sm:p-8">
            {aiBrief && (
              <div className="flex items-start gap-3 rounded-md border border-cyan-800 bg-cyan-950/40 px-4 py-3 text-sm text-cyan-200">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{c.attached}</span>
                <button type="button" onClick={() => setAiBrief("")} className="ml-auto text-xs text-cyan-400 hover:text-cyan-200">{c.remove}</button>
              </div>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>{c.name}<input name="name" required minLength={2} autoComplete="name" className={fieldClass} /></label>
              <label className={labelClass}>{c.email}<input name="email" type="email" required autoComplete="email" className={fieldClass} /></label>
              <label className={labelClass}>{c.whatsapp} <span className="font-normal text-slate-500">{c.optional}</span><input name="whatsapp" type="tel" autoComplete="tel" placeholder="+880…" className={fieldClass} /></label>
              <label className={labelClass}>{c.projectType}
                <select name="projectType" required defaultValue={projectTypes[0]} className={fieldClass}>
                  {projectTypes.map((type, index) => <option key={type} value={type}>{c.projectTypes[index]}</option>)}
                </select>
              </label>
              <label className={labelClass}>{c.budget}
                <select name="budgetRange" required defaultValue={budgetRanges[4]} className={fieldClass}>
                  {budgetRanges.map((range, index) => <option key={range} value={range}>{c.budgets[index]}</option>)}
                </select>
              </label>
              <label className={labelClass}>{c.timeline}
                <select name="timeline" required defaultValue={timelines[3]} className={fieldClass}>
                  {timelines.map((timeline, index) => <option key={timeline} value={timeline}>{c.timelines[index]}</option>)}
                </select>
              </label>
            </div>
            <label className={labelClass}>{c.about}
              <textarea name="message" required minLength={10} rows={5} value={message} onChange={(event) => setMessage(event.target.value)} placeholder={c.aboutPlaceholder} className={fieldClass} />
            </label>
            <input type="hidden" name="aiBrief" value={aiBrief} />
            <input type="hidden" name="locale" value={locale} />
            {/* Honeypot: hidden from people, filled in by bots. */}
            <div aria-hidden className="absolute -left-[9999px]">
              <label>Company website<input name="company_website" tabIndex={-1} autoComplete="off" /></label>
            </div>

            {result.status !== "idle" && (
              <div role="status" className={`flex items-start gap-3 rounded-md border px-4 py-3 text-sm ${result.status === "success" ? "border-emerald-800 bg-emerald-950/40 text-emerald-300" : "border-rose-900 bg-rose-950/40 text-rose-300"}`}>
                {result.status === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />}
                {result.message}
              </div>
            )}

            <button type="submit" disabled={pending} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:brightness-110 disabled:opacity-60 sm:w-auto">
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {c.submit}
            </button>
          </motion.form>

          <motion.aside initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }} className="space-y-4">
            <p className="text-sm text-slate-400">{c.faster}</p>
            <a href={whatsappHref(profile.whatsappNumber, t.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-5 transition hover:border-emerald-500/60">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300"><MessageCircle className="h-5 w-5" /></span>
              <span><span className="block font-semibold text-white">{c.whatsappTitle}</span><span className="text-sm text-slate-400">{c.whatsappSubtitle}</span></span>
            </a>
            {profile.bookingUrl && (
              <a href={profile.bookingUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-5 transition hover:border-cyan-500/60">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-300"><CalendarDays className="h-5 w-5" /></span>
                <span><span className="block font-semibold text-white">{c.callTitle}</span><span className="text-sm text-slate-400">{c.callSubtitle}</span></span>
              </a>
            )}
            <a href={`mailto:${profile.email}`} className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-5 transition hover:border-slate-500">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-700/40 text-slate-200"><Mail className="h-5 w-5" /></span>
              <span className="min-w-0"><span className="block font-semibold text-white">{c.emailTitle}</span><span className="block truncate text-sm text-slate-400">{profile.email}</span></span>
            </a>
            <p className="flex items-center gap-2 pt-2 text-sm text-slate-400"><Clock className="h-4 w-4 text-emerald-400" />{c.responseTime}: {profile.responseTime}</p>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}
