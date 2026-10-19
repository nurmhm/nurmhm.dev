import { CheckCircle2, CircleAlert, ExternalLink, Save } from "lucide-react"
import type React from "react"

// Shared building blocks for the admin content forms (server components; plain form posts to server actions).

export const inputClass =
  "mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
export const labelClass = "block text-sm font-medium text-slate-200"

type FieldProps = {
  label: string
  name: string
  defaultValue?: string | number
  hint?: string
  required?: boolean
  multiline?: boolean
  rows?: number
  type?: string
  placeholder?: string
  bangla?: boolean
  wide?: boolean
}

export function Field({ label, name, defaultValue, hint, required, multiline, rows = 3, type, placeholder, bangla, wide }: FieldProps) {
  const shared = { className: inputClass, name, defaultValue, required, placeholder, lang: bangla ? "bn" : undefined }
  return (
    <label className={`${labelClass} ${wide ? "md:col-span-2" : ""}`}>
      {label}
      {bangla && <span className="ml-1 font-normal text-violet-300">(বাংলা)</span>}
      {hint && <span className="ml-1 font-normal text-slate-500">({hint})</span>}
      {multiline ? <textarea {...shared} rows={rows} /> : <input {...shared} type={type} />}
    </label>
  )
}

export function Checkbox({ label, name, defaultChecked, wide }: { label: string; name: string; defaultChecked?: boolean; wide?: boolean }) {
  return (
    <label className={`flex items-center gap-3 rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 ${wide ? "md:col-span-2" : ""}`}>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-emerald-500" /> {label}
    </label>
  )
}

export function Section({ title, children, columns = 2, dashed }: { title: React.ReactNode; children: React.ReactNode; columns?: 1 | 2; dashed?: boolean }) {
  return (
    <fieldset className={`grid gap-5 rounded-lg border bg-slate-900 p-5 ${columns === 2 ? "md:grid-cols-2" : ""} ${dashed ? "border-dashed border-slate-700" : "border-slate-800"}`}>
      <legend className="px-2 text-lg font-semibold">{title}</legend>
      {children}
    </fieldset>
  )
}

/** Collapsible group of Bangla fields; opens automatically while any of them is still empty. */
export function BanglaPanel({ missing, children }: { missing: boolean; children: React.ReactNode }) {
  return (
    <details className="rounded-md border border-violet-900/60 bg-violet-950/20 p-4 md:col-span-2" open={missing}>
      <summary className="cursor-pointer text-sm font-medium text-violet-300">
        বাংলা সংস্করণ (Bangla version){missing && <span className="ml-2 text-xs text-amber-300">incomplete</span>}
      </summary>
      <div className="mt-4 grid gap-4 md:grid-cols-2">{children}</div>
    </details>
  )
}

export function PageHeader({ title, description, anchor, saved, error, errorText }: { title: string; description: string; anchor: string; saved?: string; error?: string; errorText?: string }) {
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-400">Site content</p>
          <h1 className="mt-2 text-3xl font-bold">{title}</h1>
          <p className="mt-2 max-w-2xl text-slate-400">{description}</p>
        </div>
        <div className="flex gap-4 text-sm">
          <a href={`/#${anchor}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300">English <ExternalLink className="h-4 w-4" /></a>
          <a href={`/bn#${anchor}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-violet-300 hover:text-violet-200">বাংলা <ExternalLink className="h-4 w-4" /></a>
        </div>
      </div>
      {saved && <div className="flex items-center gap-3 rounded-md border border-emerald-800 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300"><CheckCircle2 className="h-5 w-5 shrink-0" /> Saved successfully.</div>}
      {error && <div className="flex items-center gap-3 rounded-md border border-rose-900 bg-rose-950/40 px-4 py-3 text-sm text-rose-300"><CircleAlert className="h-5 w-5 shrink-0" /> {errorText ?? "Check all required fields and complete URLs before saving."}</div>}
    </>
  )
}

export function SaveBar({ label }: { label: string }) {
  return (
    <div className="sticky bottom-4 flex justify-end rounded-lg border border-slate-800 bg-slate-900/95 p-4 shadow-xl backdrop-blur">
      <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"><Save className="h-4 w-4" /> {label}</button>
    </div>
  )
}

export const lines = (values: string[] | undefined) => (values ?? []).join("\n")
