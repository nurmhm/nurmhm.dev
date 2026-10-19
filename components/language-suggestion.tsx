"use client"

import { Languages, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useI18n } from "@/components/i18n-provider"

const DISMISS_KEY = "portfolio-bn-suggestion-dismissed"

/** On the English page, offers the Bangla version to visitors whose browser or time zone points to Bangladesh. */
export function LanguageSuggestion() {
  const { locale, t } = useI18n()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (locale !== "en") return
    try {
      if (localStorage.getItem(DISMISS_KEY)) return
    } catch {}
    const prefersBangla = navigator.languages.some((language) => language.toLowerCase().startsWith("bn"))
    const inBangladesh = Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Dhaka"
    setVisible(prefersBangla || inBangladesh)
  }, [locale])

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(DISMISS_KEY, "1")
    } catch {}
  }

  if (!visible) return null
  return (
    <div lang="bn" className="fixed left-4 right-4 top-20 z-30 mx-auto flex max-w-md items-center gap-3 rounded-xl border border-emerald-500/40 bg-slate-900/95 p-3 pl-4 text-sm text-slate-200 shadow-2xl backdrop-blur">
      <Languages className="h-5 w-5 shrink-0 text-emerald-400" />
      <span className="flex-1">বাংলায় দেখতে চান?</span>
      <a href="/bn" hrefLang="bn" className="rounded-md bg-emerald-500 px-3 py-1.5 font-semibold text-slate-950 hover:bg-emerald-400">বাংলা সংস্করণ</a>
      <button type="button" onClick={dismiss} aria-label={t.langSuggest.dismiss} className="rounded p-1 text-slate-400 hover:text-white">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
