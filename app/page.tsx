import { PortfolioContent } from "@/components/portfolio-content"
import { getPortfolioProfile } from "@/lib/profile"

export const dynamic = "force-dynamic"

export default async function Home() {
  const profile = await getPortfolioProfile()
  const { updatedAt: _updatedAt, isPersisted: _isPersisted, ...publicProfile } = profile

  return <PortfolioContent profile={publicProfile} currentYear={new Date().getFullYear()} />
}
