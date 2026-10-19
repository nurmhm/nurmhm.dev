import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Hind_Siliguri } from "next/font/google"
import { headers } from "next/headers"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

// Geist has no Bengali glyphs; this font is used for Bangla text (see globals.css).
const bengali = Hind_Siliguri({ subsets: ["bengali"], weight: ["400", "500", "600", "700"], variable: "--font-bengali", display: "swap" })

export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_SITE_URL ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) } : {}),
  title: "Nur Mohammad | Software Developer in Bangladesh — Web, Mobile, AI & ERP Software",
  description:
    "Custom software for businesses in Bangladesh and worldwide: web applications, mobile apps, AI chatbots, e-commerce, ERP and business systems — planned, designed, built, tested and supported end-to-end, with one accountable point of contact.",
  keywords: [
    "Software Developer Bangladesh",
    "Freelance Web Developer Bangladesh",
    "Mobile App Developer Bangladesh",
    "Hire Full-Stack Developer",
    "AI Chatbot Developer",
    "Custom Web Application",
    "E-commerce Website Bangladesh",
    "ERP Software Bangladesh",
    "MVP Development",
    "Dhaka Software Developer",
    "সফটওয়্যার ডেভেলপার",
  ],
  authors: [{ name: "Nur Mohammad", url: "https://github.com/nurmhm" }],
  creator: "Nur Mohammad",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["bn_BD"],
    title: "Nur Mohammad | Software Developer — Web, Mobile, AI & Business Software",
    description: "Web, mobile, AI and business software — delivered end-to-end, with one person accountable.",
    siteName: "Nur Mohammad",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nur Mohammad | Software Developer — Web, Mobile, AI & Business Software",
    description: "Web, mobile, AI and business software — delivered end-to-end, with one person accountable.",
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // middleware.ts sets x-locale for /bn so the document language is correct for screen readers and search engines.
  const lang = (await headers()).get("x-locale") === "bn" ? "bn" : "en"
  return (
    <html lang={lang} className={`${GeistSans.variable} ${GeistMono.variable} ${bengali.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
