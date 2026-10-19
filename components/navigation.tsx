"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Languages, Terminal, Menu, X } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"
import type { PublicPortfolioProfile } from "@/lib/profile"

interface NavigationProps {
  onToggleCLI: () => void
  profile: PublicPortfolioProfile
}

export function Navigation({ onToggleCLI, profile }: NavigationProps) {
  const { t } = useI18n()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: t.nav.services, href: "#services" },
    { name: t.nav.work, href: "#projects" },
    { name: t.nav.process, href: "#process" },
    { name: t.nav.about, href: "#about" },
    { name: t.nav.faq, href: "#faq" },
  ]

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault()
    const targetId = href.substring(1)
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-slate-950/95 backdrop-blur-sm border-b border-slate-800" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto ">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Updated gradient */}
          <a
            href="#hero"
            onClick={(e) => handleNavLinkClick(e, "#hero")}
            className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
          >
            {profile.fullName}
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavLinkClick(e, item.href)}
                className="text-slate-300 hover:text-white transition-colors text-sm"
              >
                {item.name}
              </a>
            ))}
            <Button
              onClick={onToggleCLI}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:bg-slate-800 hover:text-emerald-300"
              title={t.nav.openCli}
            >
              <Terminal className="w-4 h-4" />
            </Button>
            <LanguageSwitch />
            <a
              href="#contact"
              onClick={(e) => handleNavLinkClick(e, "#contact")}
              className="rounded-md bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            >
              {t.nav.startProject}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitch />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-white"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-slate-950/95 backdrop-blur-sm border-t border-slate-800 py-4"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-slate-300 hover:text-white transition-colors px-4 py-2"
                  onClick={(e) => handleNavLinkClick(e, item.href)}
                >
                  {item.name}
                </a>
              ))}
              <div className="px-4">
                <a
                  href="#contact"
                  onClick={(e) => handleNavLinkClick(e, "#contact")}
                  className="block rounded-md bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2.5 text-center text-sm font-semibold text-slate-950"
                >
                  {t.nav.startProject}
                </a>
              </div>
              <div className="px-4">
                <Button
                  onClick={() => {
                    onToggleCLI()
                    setIsMobileMenuOpen(false)
                  }}
                  variant="outline"
                  size="sm"
                  className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 w-full bg-transparent"
                >
                  <Terminal className="w-4 h-4 mr-2" />
                  {t.nav.openCli}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

function LanguageSwitch() {
  const { t } = useI18n()
  return (
    <a
      href={t.langSwitch.href}
      hrefLang={t.langSwitch.hrefLang}
      lang={t.langSwitch.hrefLang}
      className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-200 transition hover:border-emerald-400 hover:text-emerald-300"
    >
      <Languages className="h-3.5 w-3.5" />
      {t.langSwitch.label}
    </a>
  )
}
