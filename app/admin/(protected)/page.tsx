import { ArrowRight, BriefcaseBusiness, CheckCircle2, Clock3, ExternalLink, Link2, UserRound } from "lucide-react"
import { connectToDatabase } from "@/lib/db"
import { getPortfolioProfile, getProfileCompleteness } from "@/lib/profile"
import { AdminUser } from "@/model/user"

export default async function AdminDashboardPage() {
  await connectToDatabase()
  const [admin, profile] = await Promise.all([
    AdminUser.findOne().select("email lastLoginAt").lean(),
    getPortfolioProfile(),
  ])
  const completeness = getProfileCompleteness(profile)
  const socialLinks = [profile.githubUrl, profile.linkedinUrl, profile.mediumUrl].filter(Boolean).length

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-400">Overview</p>
          <h1 className="mt-2 text-3xl font-bold">Manage your portfolio</h1>
          <p className="mt-2 text-slate-400">Review your profile status and continue editing the content shown on your site.</p>
        </div>
        <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300">
          Open portfolio <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={UserRound} label="Profile completeness" value={`${completeness}%`} detail={profile.isPersisted ? "Managed in MongoDB" : "Using site defaults"} />
        <Metric icon={Link2} label="Social profiles" value={`${socialLinks}/3`} detail="GitHub, LinkedIn, Medium" />
        <Metric icon={BriefcaseBusiness} label="Availability" value={profile.availableForFreelance ? "Available" : "Unavailable"} detail="Freelance projects" />
        <Metric icon={Clock3} label="Last profile update" value={profile.updatedAt ? profile.updatedAt.toLocaleDateString() : "Not saved"} detail={profile.updatedAt ? profile.updatedAt.toLocaleTimeString() : "Save your imported details"} />
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Primary profile</p>
              <h2 className="mt-1 text-xl font-semibold">{profile.fullName}</h2>
              <p className="mt-1 text-emerald-400">{profile.professionalTitle}</p>
            </div>
            <div className="rounded-md bg-emerald-500/10 p-2 text-emerald-400"><CheckCircle2 className="h-5 w-5" /></div>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-300">{profile.shortBio}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {profile.technologies.slice(0, 6).map((technology) => <span key={technology} className="rounded bg-slate-800 px-2 py-1 text-xs text-slate-300">{technology}</span>)}
          </div>
          <a href="/admin/personal-information" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300">
            Edit personal information <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold">Account activity</h2>
          <dl className="mt-5 space-y-5 text-sm">
            <div><dt className="text-slate-500">Administrator</dt><dd className="mt-1 break-all text-slate-200">{admin?.email ?? "Not seeded"}</dd></div>
            <div><dt className="text-slate-500">Last login</dt><dd className="mt-1 text-slate-200">{admin?.lastLoginAt?.toLocaleString() ?? "Not available"}</dd></div>
            <div><dt className="text-slate-500">Response time</dt><dd className="mt-1 text-slate-200">{profile.responseTime}</dd></div>
          </dl>
        </div>
      </section>
    </div>
  )
}

function Metric({ icon: Icon, label, value, detail }: { icon: typeof UserRound; label: string; value: string; detail: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center justify-between"><p className="text-sm text-slate-400">{label}</p><Icon className="h-4 w-4 text-slate-500" /></div>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  )
}
