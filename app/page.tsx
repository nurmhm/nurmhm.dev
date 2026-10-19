import type { Metadata } from "next"
import { PortfolioPage } from "@/components/portfolio-page"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  alternates: { canonical: "/", languages: { en: "/", bn: "/bn" } },
}

export default function Home() {
  return <PortfolioPage locale="en" />
}
