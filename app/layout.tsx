import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Nur Mohammad | Web Developer - Next.js, Node.js, Prisma, PostgreSQL",
  description:
    "Web Developer with 2+ years experience building enterprise applications. Currently at Trodad International developing E-commerce ERP, Healthcare Systems, and Business Management platforms using Next.js, Node.js, Prisma, and PostgreSQL.",
  keywords: [
    "Web Developer",
    "Next.js Developer",
    "Node.js Developer",
    "React Developer",
    "Prisma",
    "PostgreSQL",
    "TypeScript",
    "Bangladesh Developer",
    "Enterprise Applications",
    "ERP Systems",
    "Healthcare Software",
  ],
  authors: [{ name: "Nur Mohammad", url: "https://github.com/nurmhm" }],
  creator: "Nur Mohammad",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Nur Mohammad | Web Developer",
    description: "Building enterprise-grade applications with Next.js, Node.js, Prisma & PostgreSQL",
    siteName: "Nur Mohammad Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nur Mohammad | Web Developer",
    description: "Building enterprise-grade applications with Next.js, Node.js, Prisma & PostgreSQL",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
