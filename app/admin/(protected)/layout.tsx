import { requireAdmin } from "@/lib/auth/guards"
import { logoutAdmin } from "@/lib/actions/auth"

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAdmin()
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a href="/admin" className="font-semibold">Portfolio admin</a>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>{session.email}</span>
            <form action={logoutAdmin}><button className="text-rose-400 hover:text-rose-300">Sign out</button></form>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-8">
        <aside className="hidden w-48 shrink-0 space-y-2 md:block">
          {["/admin", "/admin/projects", "/admin/experience", "/admin/settings", "/admin/messages"].map((href) => (
            <a key={href} href={href} className="block rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">{href === "/admin" ? "Overview" : href.replace("/admin/", "").replace(/^[a-z]/, (char) => char.toUpperCase())}</a>
          ))}
        </aside>
        <section className="min-w-0 flex-1">{children}</section>
      </div>
    </div>
  )
}
