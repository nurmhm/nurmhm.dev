"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, CalendarClock, CircleAlert, Layers, Loader2, Send, Sparkles, Wallet } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useI18n } from "@/components/i18n-provider"

export type ProjectBrief = {
  title: string
  summary: string
  features: string[]
  stack: string[]
  phases: { name: string; weeks: string; focus: string }[]
  timeline: string
  budgetBand: string
  risks: string[]
}

export type BriefDraft = { idea: string; brief: string }

function parseBrief(raw: string): ProjectBrief | null {
  const start = raw.indexOf("{")
  const end = raw.lastIndexOf("}")
  if (start === -1 || end <= start) return null
  try {
    const value = JSON.parse(raw.slice(start, end + 1)) as Partial<ProjectBrief>
    if (!value.title || !value.summary) return null
    return {
      title: value.title,
      summary: value.summary,
      features: value.features ?? [],
      stack: value.stack ?? [],
      phases: value.phases ?? [],
      timeline: value.timeline ?? "",
      budgetBand: value.budgetBand ?? "",
      risks: value.risks ?? [],
    }
  } catch {
    return null
  }
}

export function briefToText(idea: string, brief: ProjectBrief) {
  return [
    `Idea: ${idea}`,
    `Title: ${brief.title}`,
    `Summary: ${brief.summary}`,
    `Features:\n${brief.features.map((feature) => `- ${feature}`).join("\n")}`,
    `Stack: ${brief.stack.join(", ")}`,
    `Phases:\n${brief.phases.map((phase) => `- ${phase.name} (${phase.weeks} wks): ${phase.focus}`).join("\n")}`,
    `Timeline: ${brief.timeline}`,
    `Budget band: ${brief.budgetBand}`,
    `Open questions:\n${brief.risks.map((risk) => `- ${risk}`).join("\n")}`,
  ].join("\n")
}

type Status = "idle" | "streaming" | "done" | "error" | "offline"

export function BriefGenerator({ firstName, onSendBrief }: { firstName: string; onSendBrief: (draft: BriefDraft) => void }) {
  const { locale, t } = useI18n()
  const exampleIdeas = t.brief.examples
  const [idea, setIdea] = useState("")
  const [raw, setRaw] = useState("")
  const [brief, setBrief] = useState<ProjectBrief | null>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const abortRef = useRef<AbortController | null>(null)
  const terminalRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    const timer = setInterval(() => setPlaceholderIndex((index) => (index + 1) % exampleIdeas.length), 3500)
    return () => clearInterval(timer)
  }, [exampleIdeas.length])

  useEffect(() => () => abortRef.current?.abort(), [])

  useEffect(() => {
    terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight })
  }, [raw])

  const generate = async (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = idea.trim()
    if (trimmed.length < 8 || status === "streaming") return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setRaw("")
    setBrief(null)
    setError("")
    setStatus("streaming")

    try {
      const response = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: trimmed, locale }),
        signal: controller.signal,
      })
      if (!response.ok || !response.body) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string }
        setError(payload.error ?? t.brief.generic)
        setStatus(response.status === 503 ? "offline" : "error")
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let text = ""
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        setRaw(text)
      }

      const parsed = text.includes("[[ERROR]]") ? null : parseBrief(text)
      if (!parsed) {
        setError(t.brief.failed)
        setStatus("error")
        return
      }
      setBrief(parsed)
      setStatus("done")
    } catch (caught) {
      if ((caught as Error).name === "AbortError") return
      setError(t.brief.network)
      setStatus("error")
    }
  }

  const sendDirectly = () => onSendBrief({ idea: idea.trim(), brief: brief ? briefToText(idea.trim(), brief) : "" })

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950/80 shadow-2xl shadow-emerald-500/10 backdrop-blur">
      <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/80 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-rose-500/80" />
        <span className="h-3 w-3 rounded-full bg-amber-400/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
        <span className="ml-2 font-mono text-xs text-slate-400">{t.brief.windowTitle}</span>
      </div>

      <form onSubmit={generate} className="border-b border-slate-800 p-4">
        <label htmlFor="brief-idea" className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-emerald-400">
          <Sparkles className="h-3.5 w-3.5" /> {t.brief.prompt}
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-emerald-400">&gt;</span>
            <input
              id="brief-idea"
              value={idea}
              onChange={(event) => setIdea(event.target.value.slice(0, 500))}
              placeholder={exampleIdeas[placeholderIndex]}
              className="w-full rounded-md border border-slate-700 bg-slate-900 py-3 pl-8 pr-3 font-mono text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={idea.trim().length < 8 || status === "streaming"}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "streaming" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            {t.brief.submit}
          </button>
        </div>
      </form>

      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-4 py-5 font-mono text-xs leading-relaxed text-slate-500">
            {t.brief.idle1}
            <br />{t.brief.idle2}
          </motion.p>
        )}

        {status === "streaming" && (
          <motion.pre
            key="stream"
            ref={terminalRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-h-56 overflow-y-auto whitespace-pre-wrap break-words px-4 py-4 font-mono text-xs leading-relaxed text-cyan-300"
          >
            {raw || <span className="text-slate-400">{t.brief.analyzing}</span>}
            <span className="ml-0.5 inline-block h-3.5 w-2 animate-pulse bg-emerald-400 align-middle" />
          </motion.pre>
        )}

        {(status === "error" || status === "offline") && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3 px-4 py-5">
            <p className="flex items-start gap-2 text-sm text-amber-300">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              {status === "offline" ? t.brief.offline : error}
            </p>
            <button type="button" onClick={sendDirectly} className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300">
              {t.brief.sendIdea} {firstName} <Send className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {status === "done" && brief && (
          <motion.div key="brief" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-h-[26rem] space-y-4 overflow-y-auto px-4 py-5 text-sm">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-emerald-400">{t.brief.draft}</p>
              <h3 className="mt-1 text-lg font-bold text-white">{brief.title}</h3>
              <p className="mt-1 text-slate-300">{brief.summary}</p>
            </div>
            {brief.features.length > 0 && (
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {brief.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-slate-200"><span className="text-emerald-400">✓</span>{feature}</li>
                ))}
              </ul>
            )}
            {brief.phases.length > 0 && (
              <div className="space-y-1.5">
                {brief.phases.map((phase, index) => (
                  <div key={`${phase.name}-${index}`} className="flex gap-3 rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2">
                    <span className="font-mono text-xs text-cyan-400">W{phase.weeks}</span>
                    <span className="text-slate-300"><span className="font-semibold text-white">{phase.name}:</span> {phase.focus}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="grid gap-2 sm:grid-cols-3">
              <Fact icon={Layers} label={t.brief.stack} value={brief.stack.slice(0, 4).join(" · ")} />
              <Fact icon={CalendarClock} label={t.brief.timeline} value={brief.timeline} />
              <Fact icon={Wallet} label={t.brief.budget} value={brief.budgetBand} />
            </div>
            <div className="flex flex-col gap-2 border-t border-slate-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">{t.brief.disclaimer}</p>
              <button type="button" onClick={sendDirectly} className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
                {t.brief.sendBrief} {firstName} <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Fact({ icon: Icon, label, value }: { icon: typeof Layers; label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-800 bg-slate-900/60 p-2.5">
      <p className="flex items-center gap-1.5 text-xs text-slate-500"><Icon className="h-3.5 w-3.5" />{label}</p>
      <p className="mt-1 text-xs font-medium text-slate-200">{value || "—"}</p>
    </div>
  )
}
