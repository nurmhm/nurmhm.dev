import { CheckCircle2, CircleAlert, ExternalLink, Save } from "lucide-react"
import { updatePortfolioServices } from "@/lib/actions/profile"
import { getPortfolioProfile } from "@/lib/profile"

type PageProps = { searchParams: { saved?: string; error?: string } }
const inputClass = "mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
const labelClass = "block text-sm font-medium text-slate-200"
const bnHint = <span className="font-normal text-slate-500">(বাংলা)</span>
const iconOptions = ["globe", "smartphone", "bot", "cart", "building", "rocket", "palette", "plug", "monitor", "cloud", "shield", "lifebuoy", "wrench"]

function DemoBadge({ show }: { show: boolean }) {
  return show ? <span className="ml-2 rounded bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-300">Demo — replace me</span> : null
}

export default async function ServicesAdminPage({ searchParams }: PageProps) {
  const profile = await getPortfolioProfile()
  // One blank slot per list lets the admin add an entry; slots left without a title are ignored on save.
  const services = [...profile.services, { title: "", titleBn: "", icon: "globe", summary: "", summaryBn: "", deliverables: [] as string[], deliverablesBn: [] as string[], timeline: "", timelineBn: "", priceBdt: 0, priceUsd: 0, isPlaceholder: false }]
  const steps = [...profile.processSteps, { title: "", titleBn: "", description: "", descriptionBn: "", duration: "", durationBn: "" }]
  const faqs = [...profile.faqs, { question: "", questionBn: "", answer: "", answerBn: "", isPlaceholder: false }]

  return <div className="space-y-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-sm font-medium text-emerald-400">Site content</p><h1 className="mt-2 text-3xl font-bold">Services, process & FAQ</h1><p className="mt-2 max-w-2xl text-slate-400">Manage what you sell, your starting prices, how you work, and the questions clients ask. Clear a title to remove an entry; fill the last blank card to add one. Bangla fields are optional — empty ones show the English text on the Bangla page.</p></div>
      <a href="/#services" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300">View section <ExternalLink className="h-4 w-4" /></a>
    </div>
    {searchParams.saved && <div className="flex items-center gap-3 rounded-md border border-emerald-800 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300"><CheckCircle2 className="h-5 w-5" /> Services saved successfully.</div>}
    {searchParams.error && <div className="flex items-center gap-3 rounded-md border border-rose-900 bg-rose-950/40 px-4 py-3 text-sm text-rose-300"><CircleAlert className="h-5 w-5" /> Every service needs a summary, at least one deliverable, a timeline and prices; every step and FAQ needs all English fields.</div>}

    <form action={updatePortfolioServices} className="space-y-6">
      <input type="hidden" name="serviceCount" value={services.length} />
      <input type="hidden" name="stepCount" value={steps.length} />
      <input type="hidden" name="faqCount" value={faqs.length} />
      <fieldset className="grid gap-5 rounded-lg border border-slate-800 bg-slate-900 p-5 md:grid-cols-2"><legend className="px-2 text-lg font-semibold">Section content</legend>
        <label className={labelClass}>Heading<input className={inputClass} name="servicesHeading" defaultValue={profile.servicesHeading} required /></label>
        <label className={labelClass}>Heading {bnHint}<input className={inputClass} name="servicesHeadingBn" defaultValue={profile.servicesHeadingBn} lang="bn" /></label>
        <label className={labelClass}>Description<textarea className={inputClass} name="servicesDescription" defaultValue={profile.servicesDescription} rows={2} required /></label>
        <label className={labelClass}>Description {bnHint}<textarea className={inputClass} name="servicesDescriptionBn" defaultValue={profile.servicesDescriptionBn} rows={2} lang="bn" /></label>
      </fieldset>

      {services.map((service, index) => {
        const isNew = index === services.length - 1
        return <fieldset key={`service-${index}`} className={`grid gap-5 rounded-lg border bg-slate-900 p-5 md:grid-cols-2 ${isNew ? "border-dashed border-slate-700" : "border-slate-800"}`}>
          <legend className="px-2 text-lg font-semibold">{isNew ? "Add a service" : `Service ${index + 1}`}<DemoBadge show={service.isPlaceholder} /></legend>
          <label className={labelClass}>Title<input className={inputClass} name={`serviceTitle${index}`} defaultValue={service.title} /></label>
          <label className={labelClass}>Icon<select className={inputClass} name={`serviceIcon${index}`} defaultValue={service.icon}>{iconOptions.map((icon) => <option key={icon}>{icon}</option>)}</select></label>
          <label className={`${labelClass} md:col-span-2`}>Summary<textarea className={inputClass} name={`serviceSummary${index}`} defaultValue={service.summary} rows={2} /></label>
          <label className={labelClass}>Deliverables <span className="font-normal text-slate-500">(one per line)</span><textarea className={inputClass} name={`serviceDeliverables${index}`} defaultValue={service.deliverables.join("\n")} rows={4} /></label>
          <div className="grid gap-5">
            <label className={labelClass}>Timeline<input className={inputClass} name={`serviceTimeline${index}`} defaultValue={service.timeline} placeholder="3–6 weeks" /></label>
            <div className="grid grid-cols-2 gap-4">
              <label className={labelClass}>Starting price (৳ BDT)<input className={inputClass} name={`servicePriceBdt${index}`} inputMode="numeric" defaultValue={service.priceBdt || ""} /></label>
              <label className={labelClass}>Starting price ($ USD)<input className={inputClass} name={`servicePriceUsd${index}`} inputMode="numeric" defaultValue={service.priceUsd || ""} /></label>
            </div>
          </div>
          <details className="rounded-md border border-slate-800 bg-slate-950/50 p-4 md:col-span-2" open={!isNew && !service.titleBn}>
            <summary className="cursor-pointer text-sm font-medium text-cyan-300">বাংলা সংস্করণ (Bangla version){!isNew && !service.titleBn && <span className="ml-2 text-xs text-amber-300">missing</span>}</summary>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className={labelClass}>Title {bnHint}<input className={inputClass} name={`serviceTitleBn${index}`} defaultValue={service.titleBn} lang="bn" /></label>
              <label className={labelClass}>Timeline {bnHint}<input className={inputClass} name={`serviceTimelineBn${index}`} defaultValue={service.timelineBn} lang="bn" /></label>
              <label className={labelClass}>Summary {bnHint}<textarea className={inputClass} name={`serviceSummaryBn${index}`} defaultValue={service.summaryBn} rows={3} lang="bn" /></label>
              <label className={labelClass}>Deliverables {bnHint}<textarea className={inputClass} name={`serviceDeliverablesBn${index}`} defaultValue={service.deliverablesBn.join("\n")} rows={3} lang="bn" /></label>
            </div>
          </details>
          <label className="flex items-center gap-3 text-sm text-slate-300 md:col-span-2"><input type="checkbox" name={`servicePlaceholder${index}`} defaultChecked={service.isPlaceholder} className="h-4 w-4 accent-amber-500" /> Still demo content (untick once you've written your own)</label>
        </fieldset>
      })}

      <fieldset className="grid gap-5 rounded-lg border border-slate-800 bg-slate-900 p-5"><legend className="px-2 text-lg font-semibold">How I work (process steps)</legend>
        {steps.map((step, index) => <div key={`step-${index}`} className="grid gap-4 border-b border-slate-800 pb-5 last:border-0 last:pb-0 md:grid-cols-2">
          <label className={labelClass}>{index === steps.length - 1 ? "New step title" : `Step ${index + 1} title`}<input className={inputClass} name={`stepTitle${index}`} defaultValue={step.title} /></label>
          <label className={labelClass}>Title {bnHint}<input className={inputClass} name={`stepTitleBn${index}`} defaultValue={step.titleBn} lang="bn" /></label>
          <label className={labelClass}>Description<textarea className={inputClass} name={`stepDescription${index}`} defaultValue={step.description} rows={2} /></label>
          <label className={labelClass}>Description {bnHint}<textarea className={inputClass} name={`stepDescriptionBn${index}`} defaultValue={step.descriptionBn} rows={2} lang="bn" /></label>
          <label className={labelClass}>Duration<input className={inputClass} name={`stepDuration${index}`} defaultValue={step.duration} /></label>
          <label className={labelClass}>Duration {bnHint}<input className={inputClass} name={`stepDurationBn${index}`} defaultValue={step.durationBn} lang="bn" /></label>
        </div>)}
      </fieldset>

      <fieldset className="grid gap-5 rounded-lg border border-slate-800 bg-slate-900 p-5"><legend className="px-2 text-lg font-semibold">FAQ</legend>
        {faqs.map((faq, index) => <div key={`faq-${index}`} className="grid gap-4 border-b border-slate-800 pb-5 last:border-0 last:pb-0 md:grid-cols-2">
          <label className={labelClass}>{index === faqs.length - 1 ? "New question" : `Question ${index + 1}`}<DemoBadge show={faq.isPlaceholder} /><input className={inputClass} name={`faqQuestion${index}`} defaultValue={faq.question} /></label>
          <label className={labelClass}>Question {bnHint}<input className={inputClass} name={`faqQuestionBn${index}`} defaultValue={faq.questionBn} lang="bn" /></label>
          <label className={labelClass}>Answer<textarea className={inputClass} name={`faqAnswer${index}`} defaultValue={faq.answer} rows={3} /></label>
          <label className={labelClass}>Answer {bnHint}<textarea className={inputClass} name={`faqAnswerBn${index}`} defaultValue={faq.answerBn} rows={3} lang="bn" /></label>
          <label className="flex items-center gap-3 text-sm text-slate-300 md:col-span-2"><input type="checkbox" name={`faqPlaceholder${index}`} defaultChecked={faq.isPlaceholder} className="h-4 w-4 accent-amber-500" /> Still demo content</label>
        </div>)}
      </fieldset>

      <div className="sticky bottom-4 flex justify-end rounded-lg border border-slate-800 bg-slate-900/95 p-4 shadow-xl backdrop-blur"><button type="submit" className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"><Save className="h-4 w-4" /> Save services</button></div>
    </form>
  </div>
}
