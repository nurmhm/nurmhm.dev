import { Inbox, Mail, MessageCircle, Sparkles, Trash2 } from "lucide-react"
import { deleteLead, updateLeadStatus } from "@/lib/actions/leads"
import { whatsappHref } from "@/lib/contact-links"
import { connectToDatabase } from "@/lib/db"
import { Lead, leadStatuses, type LeadStatus } from "@/model/lead"

export const dynamic = "force-dynamic"

type PageProps = { searchParams: { status?: string } }

const statusStyles: Record<LeadStatus, string> = {
  new: "bg-emerald-500/15 text-emerald-300",
  contacted: "bg-cyan-500/15 text-cyan-300",
  won: "bg-amber-500/15 text-amber-300",
  lost: "bg-slate-700/60 text-slate-400",
}

export default async function LeadsAdminPage({ searchParams }: PageProps) {
  const filter = leadStatuses.includes(searchParams.status as LeadStatus) ? (searchParams.status as LeadStatus) : undefined
  await connectToDatabase()
  const [leads, counts] = await Promise.all([
    Lead.find(filter ? { status: filter } : {}).sort({ createdAt: -1 }).limit(200).lean(),
    Lead.aggregate<{ _id: LeadStatus; count: number }>([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ])
  const countFor = (status: LeadStatus) => counts.find((entry) => entry._id === status)?.count ?? 0
  const total = counts.reduce((sum, entry) => sum + entry.count, 0)

  return <div className="space-y-8">
    <div><p className="text-sm font-medium text-emerald-400">Clients</p><h1 className="mt-2 text-3xl font-bold">Lead inbox</h1><p className="mt-2 max-w-2xl text-slate-400">Project briefs sent from your portfolio's contact form and AI planner.</p></div>

    <nav className="flex flex-wrap gap-2 text-sm">
      <a href="/admin/leads" className={`rounded-md px-3 py-1.5 ${!filter ? "bg-slate-700 text-white" : "text-slate-400 hover:bg-slate-800"}`}>All ({total})</a>
      {leadStatuses.map((status) => <a key={status} href={`/admin/leads?status=${status}`} className={`rounded-md px-3 py-1.5 capitalize ${filter === status ? "bg-slate-700 text-white" : "text-slate-400 hover:bg-slate-800"}`}>{status} ({countFor(status)})</a>)}
    </nav>

    {leads.length === 0 ? (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-slate-700 py-16 text-slate-400"><Inbox className="h-8 w-8" />No leads here yet.</div>
    ) : (
      <div className="space-y-4">
        {leads.map((lead) => {
          const id = String(lead._id)
          return <article key={id} className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold">{lead.name}</h2>
                  <span className={`rounded px-2 py-0.5 text-xs font-medium capitalize ${statusStyles[lead.status]}`}>{lead.status}</span>
                  {lead.source === "ai-brief" && <span className="inline-flex items-center gap-1 rounded bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-300"><Sparkles className="h-3 w-3" />AI brief</span>}
                  {lead.locale === "bn" && <span lang="bn" title="Sent from the Bangla site — reply in Bangla" className="rounded bg-violet-500/15 px-2 py-0.5 text-xs text-violet-300">বাংলা</span>}
                </div>
                <p className="mt-1 text-sm text-slate-400">{lead.projectType} · {lead.budgetRange} · {lead.timeline}</p>
                <p className="mt-1 text-xs text-slate-500">{lead.createdAt.toLocaleString()}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a href={`mailto:${lead.email}?subject=${encodeURIComponent(`Re: your ${lead.projectType.toLowerCase()} project`)}`} className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:border-slate-500"><Mail className="h-4 w-4" />{lead.email}</a>
                {lead.whatsapp && <a href={whatsappHref(lead.whatsapp, lead.locale === "bn" ? `আসসালামু আলাইকুম ${lead.name}, আপনার প্রজেক্টের বিবরণ পাঠানোর জন্য ধন্যবাদ!` : `Hi ${lead.name}, thanks for your project brief!`)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-emerald-800 px-3 py-1.5 text-sm text-emerald-300 hover:border-emerald-600"><MessageCircle className="h-4 w-4" />WhatsApp</a>}
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{lead.message}</p>
            {lead.aiBrief && (
              <details className="mt-4 rounded-md border border-slate-800 bg-slate-950 p-3">
                <summary className="cursor-pointer text-sm font-medium text-cyan-300">View AI-generated brief</summary>
                <pre className="mt-3 whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-300">{lead.aiBrief}</pre>
              </details>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-4">
              {leadStatuses.filter((status) => status !== lead.status).map((status) => (
                <form key={status} action={updateLeadStatus}><input type="hidden" name="id" value={id} /><input type="hidden" name="status" value={status} /><button className="rounded-md bg-slate-800 px-3 py-1.5 text-xs capitalize text-slate-200 hover:bg-slate-700">Mark {status}</button></form>
              ))}
              <form action={deleteLead} className="ml-auto"><input type="hidden" name="id" value={id} /><button title="Delete lead" className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40"><Trash2 className="h-3.5 w-3.5" />Delete</button></form>
            </div>
          </article>
        })}
      </div>
    )}
  </div>
}
