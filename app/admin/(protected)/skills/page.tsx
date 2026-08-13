import { CheckCircle2, CircleAlert, ExternalLink, Save } from "lucide-react"
import { updatePortfolioSkills } from "@/lib/actions/profile"
import { getPortfolioProfile } from "@/lib/profile"

type PageProps = { searchParams: { saved?: string; error?: string } }
const inputClass = "mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
const labelClass = "block text-sm font-medium text-slate-200"

export default async function SkillsAdminPage({ searchParams }: PageProps) {
  const profile = await getPortfolioProfile()
  return <div className="space-y-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-sm font-medium text-emerald-400">Site content</p><h1 className="mt-2 text-3xl font-bold">Skills section</h1><p className="mt-2 max-w-2xl text-slate-400">Manage the technology groups, soft skills, and language levels shown on your public portfolio.</p></div>
      <a href="/#skills" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300">View section <ExternalLink className="h-4 w-4" /></a>
    </div>
    {searchParams.saved && <div className="flex items-center gap-3 rounded-md border border-emerald-800 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300"><CheckCircle2 className="h-5 w-5" /> Skills saved successfully.</div>}
    {searchParams.error && <div className="flex items-center gap-3 rounded-md border border-rose-900 bg-rose-950/40 px-4 py-3 text-sm text-rose-300"><CircleAlert className="h-5 w-5" /> Complete every category and language entry before saving.</div>}
    <form action={updatePortfolioSkills} className="space-y-6">
      <fieldset className="grid gap-5 rounded-lg border border-slate-800 bg-slate-900 p-5"><legend className="px-2 text-lg font-semibold">Section content</legend><label className={labelClass}>Heading<input className={inputClass} name="skillsHeading" defaultValue={profile.skillsHeading} required /></label><label className={labelClass}>Description<textarea className={inputClass} name="skillsDescription" defaultValue={profile.skillsDescription} rows={2} required /></label></fieldset>
      <fieldset className="grid gap-5 rounded-lg border border-slate-800 bg-slate-900 p-5 md:grid-cols-2"><legend className="px-2 text-lg font-semibold">Technology categories</legend>{profile.skillCategories.map((category, index) => <div key={index} className="space-y-2"><label className={labelClass}>Category {index + 1} title<input className={inputClass} name={`categoryTitle${index}`} defaultValue={category.title} required /></label><label className={labelClass}>Skills <span className="font-normal text-slate-500">(one per line)</span><textarea className={inputClass} name={`categorySkills${index}`} defaultValue={category.skills.join("\n")} rows={6} required /></label></div>)}</fieldset>
      <fieldset className="grid gap-5 rounded-lg border border-slate-800 bg-slate-900 p-5 md:grid-cols-2"><legend className="px-2 text-lg font-semibold">Additional skills</legend><label className={labelClass}>Soft skills <span className="font-normal text-slate-500">(comma separated)</span><textarea className={inputClass} name="softSkills" defaultValue={profile.softSkills.join(", ")} rows={4} required /></label><label className={labelClass}>Languages <span className="font-normal text-slate-500">(one per line, name | level)</span><textarea className={inputClass} name="languages" defaultValue={profile.languages.map((language) => `${language.name} | ${language.level}`).join("\n")} rows={4} required /></label></fieldset>
      <div className="sticky bottom-4 flex justify-end rounded-lg border border-slate-800 bg-slate-900/95 p-4 shadow-xl backdrop-blur"><button type="submit" className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"><Save className="h-4 w-4" /> Save skills</button></div>
    </form>
  </div>
}