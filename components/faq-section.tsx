"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useI18n } from "@/components/i18n-provider"
import { SectionHeading } from "@/components/section-heading"
import type { PublicPortfolioProfile } from "@/lib/profile"

export function FaqSection({ profile }: { profile: PublicPortfolioProfile }) {
  const { t } = useI18n()
  return (
    <section id="faq" className="bg-slate-950 py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} />
        <Accordion type="single" collapsible className="space-y-3">
          {profile.faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`faq-${index}`} className="rounded-lg border border-slate-800 bg-slate-900/60 px-5">
              <AccordionTrigger className="text-left text-base font-medium text-white hover:no-underline">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-slate-300">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
