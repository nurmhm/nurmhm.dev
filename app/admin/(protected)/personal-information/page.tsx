import { CheckCircle2, CircleAlert, ExternalLink, Save } from "lucide-react"
import { updatePortfolioProfile } from "@/lib/actions/profile"
import { getPortfolioProfile } from "@/lib/profile"

type PageProps = { searchParams: { saved?: string; error?: string } }

const inputClass =
  "mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
const labelClass = "block text-sm font-medium text-slate-200"

export default async function PersonalInformationPage({ searchParams }: PageProps) {
  const profile = await getPortfolioProfile()

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-400">Site content</p>
          <h1 className="mt-2 text-3xl font-bold">Personal information</h1>
          <p className="mt-2 max-w-2xl text-slate-400">
            Manage the identity, biography, contact details, availability, and links used throughout your portfolio.
          </p>
        </div>
        <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300">
          View portfolio <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {searchParams.saved && (
        <div className="flex items-center gap-3 rounded-md border border-emerald-800 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
          <CheckCircle2 className="h-5 w-5 shrink-0" /> Personal information saved successfully.
        </div>
      )}
      {searchParams.error && (
        <div className="flex items-center gap-3 rounded-md border border-rose-900 bg-rose-950/40 px-4 py-3 text-sm text-rose-300">
          <CircleAlert className="h-5 w-5 shrink-0" /> Check all required fields and enter complete URLs before saving.
        </div>
      )}

      {!profile.isPersisted && (
        <div className="rounded-md border border-amber-800 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">
          These values were imported from your existing site. Save once to create the managed profile record.
        </div>
      )}

      <form action={updatePortfolioProfile} className="space-y-6">
        <fieldset className="grid gap-5 rounded-lg border border-slate-800 bg-slate-900 p-5 md:grid-cols-2">
          <legend className="px-2 text-lg font-semibold">Identity</legend>
          <label className={labelClass}>Full name<input className={inputClass} name="fullName" defaultValue={profile.fullName} required /></label>
          <label className={labelClass}>Professional title<input className={inputClass} name="professionalTitle" defaultValue={profile.professionalTitle} required /></label>
          <label className={`${labelClass} md:col-span-2`}>Professional tagline<input className={inputClass} name="tagline" defaultValue={profile.tagline} required /></label>
          <label className={labelClass}>Current company<input className={inputClass} name="currentCompany" defaultValue={profile.currentCompany} required /></label>
          <label className={labelClass}>Experience label<input className={inputClass} name="yearsExperience" defaultValue={profile.yearsExperience} required /></label>
          <label className={`${labelClass} md:col-span-2`}>Short biography<textarea className={inputClass} name="shortBio" defaultValue={profile.shortBio} rows={3} required /></label>
          <label className={`${labelClass} md:col-span-2`}>
            About paragraphs <span className="font-normal text-slate-500">(one paragraph per line)</span>
            <textarea className={inputClass} name="aboutParagraphs" defaultValue={profile.aboutParagraphs.join("\n")} rows={8} required />
          </label>
        </fieldset>

        <fieldset className="grid gap-5 rounded-lg border border-slate-800 bg-slate-900 p-5 md:grid-cols-2">
          <legend className="px-2 text-lg font-semibold">Contact and availability</legend>
          <label className={labelClass}>Email<input className={inputClass} name="email" type="email" defaultValue={profile.email} required /></label>
          <label className={labelClass}>Phone<input className={inputClass} name="phone" defaultValue={profile.phone} required /></label>
          <label className={labelClass}>Location<input className={inputClass} name="location" defaultValue={profile.location} required /></label>
          <label className={labelClass}>Response time<input className={inputClass} name="responseTime" defaultValue={profile.responseTime} required /></label>
          <label className="flex items-center gap-3 rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200">
            <input type="checkbox" name="availableForFreelance" defaultChecked={profile.availableForFreelance} className="h-4 w-4 accent-emerald-500" /> Available for freelance projects
          </label>
          <label className="flex items-center gap-3 rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200">
            <input type="checkbox" name="openToFullTime" defaultChecked={profile.openToFullTime} className="h-4 w-4 accent-emerald-500" /> Open to full-time opportunities
          </label>
        </fieldset>

        <fieldset className="grid gap-5 rounded-lg border border-slate-800 bg-slate-900 p-5 md:grid-cols-2">
          <legend className="px-2 text-lg font-semibold">Links and assets</legend>
          <label className={labelClass}>GitHub URL<input className={inputClass} name="githubUrl" type="url" defaultValue={profile.githubUrl} required /></label>
          <label className={labelClass}>LinkedIn URL<input className={inputClass} name="linkedinUrl" type="url" defaultValue={profile.linkedinUrl} required /></label>
          <label className={labelClass}>Medium URL<input className={inputClass} name="mediumUrl" type="url" defaultValue={profile.mediumUrl} required /></label>
          <label className={labelClass}>Resume path or URL<input className={inputClass} name="resumeUrl" defaultValue={profile.resumeUrl} required /></label>
          <label className={`${labelClass} md:col-span-2`}>Portrait path or URL<input className={inputClass} name="portraitUrl" defaultValue={profile.portraitUrl} required /></label>
        </fieldset>

        <fieldset className="grid gap-5 rounded-lg border border-slate-800 bg-slate-900 p-5">
          <legend className="px-2 text-lg font-semibold">Profile labels</legend>
          <label className={labelClass}>Core technologies <span className="font-normal text-slate-500">(comma separated)</span><input className={inputClass} name="technologies" defaultValue={profile.technologies.join(", ")} required /></label>
          <label className={labelClass}>Personal traits <span className="font-normal text-slate-500">(comma separated)</span><input className={inputClass} name="traits" defaultValue={profile.traits.join(", ")} required /></label>
        </fieldset>

        <div className="sticky bottom-4 flex justify-end rounded-lg border border-slate-800 bg-slate-900/95 p-4 shadow-xl backdrop-blur">
          <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
            <Save className="h-4 w-4" /> Save personal information
          </button>
        </div>
      </form>
    </div>
  )
}
