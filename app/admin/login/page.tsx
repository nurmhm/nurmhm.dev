import { loginAdmin } from "@/lib/actions/auth"

export default function AdminLoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <form action={loginAdmin} className="w-full max-w-md space-y-6 rounded-lg border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <div>
          <p className="text-sm font-medium text-emerald-400">Portfolio management</p>
          <h1 className="mt-2 text-3xl font-bold">Admin sign in</h1>
          <p className="mt-2 text-sm text-slate-400">Use the seeded administrator account.</p>
        </div>
        <label className="block space-y-2 text-sm">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-emerald-500" />
        </label>
        <label className="block space-y-2 text-sm">
          <span>Password</span>
          <input name="password" type="password" autoComplete="current-password" required className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-emerald-500" />
        </label>
        {searchParams.error && (
          <p role="alert" className="rounded-md border border-rose-900 bg-rose-950/50 px-3 py-2 text-sm text-rose-300">
            Invalid email or password.
          </p>
        )}
        <button type="submit" className="w-full rounded-md bg-emerald-500 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-400">Sign in</button>
      </form>
    </main>
  )
}
