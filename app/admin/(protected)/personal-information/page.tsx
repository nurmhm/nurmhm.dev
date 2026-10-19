import { BanglaPanel, Checkbox, Field, PageHeader, SaveBar, Section, lines } from "@/components/admin/form-kit"
import { updatePortfolioProfile } from "@/lib/actions/profile"
import { getPortfolioProfile } from "@/lib/profile"

type PageProps = { searchParams: { saved?: string; error?: string } }

export default async function PersonalInformationPage({ searchParams }: PageProps) {
  const profile = await getPortfolioProfile()
  const proofStats = profile.proofStats.map((stat) => [stat.value, stat.label, stat.labelBn].join(" | ")).join("\n")

  return (
    <div className="space-y-8">
      <PageHeader
        title="Personal information"
        description="Your identity, hero message, about text, contact details and links. Bangla fields are optional — empty ones show the English text on the Bangla page."
        anchor="hero"
        saved={searchParams.saved}
        error={searchParams.error}
      />
      {!profile.isPersisted && (
        <div className="rounded-md border border-amber-800 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">
          These are the built-in defaults. Save once (or run <code className="font-mono">pnpm seed</code>) to create the managed profile record.
        </div>
      )}

      <form action={updatePortfolioProfile} className="space-y-6">
        <Section title="Hero">
          <Field label="Headline" name="heroHeadline" defaultValue={profile.heroHeadline} required wide />
          <Field label="Subheadline" name="heroSubheadline" defaultValue={profile.heroSubheadline} required multiline wide />
          <Field label="Availability badge" hint="leave empty to hide" name="availabilityNote" defaultValue={profile.availabilityNote} />
          <Field label="WhatsApp number" hint="country code, digits only" name="whatsappNumber" defaultValue={profile.whatsappNumber} placeholder="8801XXXXXXXXX" required />
          <Field label="Booking link" hint="Calendly / Cal.com; empty hides it" name="bookingUrl" type="url" defaultValue={profile.bookingUrl} placeholder="https://cal.com/your-name/30min" wide />
          <Field label="Proof stats" hint="one per line: value | English label | বাংলা label" name="proofStats" defaultValue={proofStats} required multiline rows={4} wide />
          <BanglaPanel missing={!profile.heroHeadlineBn || !profile.heroSubheadlineBn}>
            <Field label="Headline" name="heroHeadlineBn" defaultValue={profile.heroHeadlineBn} bangla wide />
            <Field label="Subheadline" name="heroSubheadlineBn" defaultValue={profile.heroSubheadlineBn} bangla multiline wide />
            <Field label="Availability badge" name="availabilityNoteBn" defaultValue={profile.availabilityNoteBn} bangla />
          </BanglaPanel>
        </Section>

        <Section title="Identity and about">
          <Field label="Full name" name="fullName" defaultValue={profile.fullName} required />
          <Field label="Professional title" name="professionalTitle" defaultValue={profile.professionalTitle} required />
          <Field label="Tagline" name="tagline" defaultValue={profile.tagline} required wide />
          <Field label="Experience label" hint="e.g. 2+ years" name="yearsExperience" defaultValue={profile.yearsExperience} required />
          <Field label="Current company" hint="used by the CLI only" name="currentCompany" defaultValue={profile.currentCompany} required />
          <Field label="Short bio" hint="footer and meta" name="shortBio" defaultValue={profile.shortBio} required multiline wide />
          <Field label="About paragraphs" hint="one paragraph per line" name="aboutParagraphs" defaultValue={lines(profile.aboutParagraphs)} required multiline rows={8} wide />
          <Field label="Strengths" hint="comma separated" name="traits" defaultValue={profile.traits.join(", ")} required wide />
          <BanglaPanel missing={!profile.fullNameBn || !profile.shortBioBn || profile.aboutParagraphsBn.length === 0}>
            <Field label="Full name" name="fullNameBn" defaultValue={profile.fullNameBn} bangla />
            <Field label="Professional title" name="professionalTitleBn" defaultValue={profile.professionalTitleBn} bangla />
            <Field label="Tagline" name="taglineBn" defaultValue={profile.taglineBn} bangla wide />
            <Field label="Experience label" name="yearsExperienceBn" defaultValue={profile.yearsExperienceBn} bangla />
            <Field label="Short bio" name="shortBioBn" defaultValue={profile.shortBioBn} bangla multiline wide />
            <Field label="About paragraphs" hint="one per line" name="aboutParagraphsBn" defaultValue={lines(profile.aboutParagraphsBn)} bangla multiline rows={8} wide />
            <Field label="Strengths" hint="comma separated" name="traitsBn" defaultValue={profile.traitsBn.join(", ")} bangla wide />
          </BanglaPanel>
        </Section>

        <Section title="Contact and availability">
          <Field label="Email" name="email" type="email" defaultValue={profile.email} required />
          <Field label="Phone" name="phone" defaultValue={profile.phone} required />
          <Field label="Location" name="location" defaultValue={profile.location} required />
          <Field label="Response time" name="responseTime" defaultValue={profile.responseTime} required />
          <Checkbox label="Available for freelance projects" name="availableForFreelance" defaultChecked={profile.availableForFreelance} />
          <Checkbox label="Open to full-time roles (shown in the CLI only)" name="openToFullTime" defaultChecked={profile.openToFullTime} />
          <BanglaPanel missing={!profile.locationBn || !profile.responseTimeBn}>
            <Field label="Location" name="locationBn" defaultValue={profile.locationBn} bangla />
            <Field label="Response time" name="responseTimeBn" defaultValue={profile.responseTimeBn} bangla />
          </BanglaPanel>
        </Section>

        <Section title="Links and assets">
          <Field label="GitHub URL" name="githubUrl" type="url" defaultValue={profile.githubUrl} required />
          <Field label="LinkedIn URL" name="linkedinUrl" type="url" defaultValue={profile.linkedinUrl} required />
          <Field label="Medium URL" name="mediumUrl" type="url" defaultValue={profile.mediumUrl} required />
          <Field label="Resume path or URL" hint="CLI download" name="resumeUrl" defaultValue={profile.resumeUrl} required />
          <Field label="Portrait path or URL" hint="About section photo" name="portraitUrl" defaultValue={profile.portraitUrl} required wide />
          <Field label="Core technologies" hint="comma separated" name="technologies" defaultValue={profile.technologies.join(", ")} required wide />
        </Section>

        <SaveBar label="Save personal information" />
      </form>
    </div>
  )
}
