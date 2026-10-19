import { PortfolioContent } from "@/components/portfolio-content"
import type { Locale } from "@/lib/i18n"
import { getPortfolioProfile, localizeProfile, type PublicPortfolioProfile } from "@/lib/profile"

function structuredData(profile: PublicPortfolioProfile, locale: Locale) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const pageUrl = siteUrl ? `${siteUrl.replace(/\/$/, "")}${locale === "bn" ? "/bn" : ""}` : undefined
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: profile.fullName,
        jobTitle: "Software Developer",
        email: `mailto:${profile.email}`,
        sameAs: [profile.githubUrl, profile.linkedinUrl, profile.mediumUrl].filter(Boolean),
        ...(siteUrl ? { url: siteUrl } : {}),
      },
      {
        "@type": "ProfessionalService",
        name: `${profile.fullName} — Software Development`,
        description: profile.heroSubheadline,
        inLanguage: locale === "bn" ? "bn-BD" : "en",
        founder: { "@type": "Person", name: profile.fullName },
        areaServed: ["Bangladesh", "Worldwide"],
        address: { "@type": "PostalAddress", addressLocality: profile.location },
        ...(pageUrl ? { url: pageUrl } : {}),
        makesOffer: profile.services.map((service) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: service.title, description: service.summary },
          priceSpecification: locale === "bn"
            ? { "@type": "PriceSpecification", minPrice: service.priceBdt, priceCurrency: "BDT" }
            : { "@type": "PriceSpecification", minPrice: service.priceUsd, priceCurrency: "USD" },
        })),
      },
    ],
  }
}

/** Server entry for the public page in either language; `/` renders English and `/bn` renders Bangla. */
export async function PortfolioPage({ locale }: { locale: Locale }) {
  const { updatedAt: _updatedAt, isPersisted: _isPersisted, ...rest } = await getPortfolioProfile()
  // Lean subdocuments carry ObjectId `_id`s, which cannot cross into client components; round-trip to plain JSON.
  const profile = localizeProfile(JSON.parse(JSON.stringify(rest)) as PublicPortfolioProfile, locale)

  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify output is escaped for "<" so admin-entered text cannot close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(profile, locale)).replace(/</g, "\\u003c") }}
      />
      <PortfolioContent profile={profile} locale={locale} currentYear={new Date().getFullYear()} />
    </>
  )
}
