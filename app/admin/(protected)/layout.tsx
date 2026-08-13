import Link from "next/link"
import { BriefcaseBusiness, ExternalLink, FolderKanban, LayoutDashboard, LogOut, UserRound, Wrench } from "lucide-react"
import { requireAdmin } from "@/lib/auth/guards"
import { logoutAdmin } from "@/lib/actions/auth"

const navigation = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/personal-information", label: "Personal information", icon: UserRound },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/experience", label: "Experience", icon: BriefcaseBusiness },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
]

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAdmin()
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/admin" className="font-semibold">Portfolio admin</Link>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span className="hidden sm:inline">{session.email}</span>
            <form action={logoutAdmin}>
              <button title="Sign out" className="inline-flex items-center gap-2 text-rose-400 hover:text-rose-300">
                <LogOut className="h-4 w-4" /><span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </header>
      <nav className="border-b border-slate-800 bg-slate-900/60 px-4 py-3 md:hidden">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
              <Icon className="h-4 w-4" />{label}
            </Link>
          ))}
        </div>
      </nav>
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6">
        <aside className="hidden w-56 shrink-0 space-y-2 md:block">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
              <Icon className="h-4 w-4" />{label}
            </Link>
          ))}
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white">
            <ExternalLink className="h-4 w-4" />View portfolio
          </a>
        </aside>
        <section className="min-w-0 flex-1">{children}</section>
      </div>
    </div>
  )
}
