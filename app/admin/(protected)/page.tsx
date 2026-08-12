import { connectToDatabase } from "@/lib/db"
import { AdminUser } from "@/model/user"

export default async function AdminDashboardPage() {
  await connectToDatabase()
  const admin = await AdminUser.findOne().select("email lastLoginAt").lean()
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-emerald-400">Overview</p>
        <h1 className="mt-2 text-3xl font-bold">Manage your portfolio</h1>
        <p className="mt-2 text-slate-400">Your content management foundation is ready. Resource editors will be added next.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-5"><p className="text-sm text-slate-400">Administrator</p><p className="mt-2 font-medium">{admin?.email ?? "Not seeded"}</p></div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-5"><p className="text-sm text-slate-400">Last login</p><p className="mt-2 font-medium">{admin?.lastLoginAt?.toLocaleString() ?? "Not available"}</p></div>
      </div>
    </div>
  )
}
