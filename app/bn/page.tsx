import type { Metadata } from "next"
import { PortfolioPage } from "@/components/portfolio-page"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "নূর মোহাম্মদ | সফটওয়্যার ডেভেলপার — ওয়েব, মোবাইল অ্যাপ, AI ও ERP সফটওয়্যার",
  description:
    "বাংলাদেশে কাস্টম সফটওয়্যার তৈরি: ওয়েব অ্যাপ্লিকেশন, মোবাইল অ্যাপ, AI চ্যাটবট, ই-কমার্স, ERP ও বিজনেস সিস্টেম। ফ্রি আলোচনা, নির্দিষ্ট দাম ও প্রতি সপ্তাহে কাজের ডেমো।",
  alternates: { canonical: "/bn", languages: { en: "/", bn: "/bn" } },
  openGraph: {
    locale: "bn_BD",
    title: "নূর মোহাম্মদ | সফটওয়্যার ডেভেলপার",
    description: "ওয়েব, মোবাইল, AI ও বিজনেস সফটওয়্যার — শুরু থেকে শেষ পর্যন্ত, একজনের দায়িত্বে।",
  },
}

export default function BanglaHome() {
  return <PortfolioPage locale="bn" />
}
