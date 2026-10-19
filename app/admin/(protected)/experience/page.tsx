import { BanglaPanel, Checkbox, Field, PageHeader, SaveBar, Section, lines } from "@/components/admin/form-kit"
import { updatePortfolioExperience } from "@/lib/actions/profile"
import { getPortfolioProfile } from "@/lib/profile"

type PageProps = { searchParams: { saved?: string; error?: string } }

export default async function ExperienceAdminPage({ searchParams }: PageProps) {
  const profile = await getPortfolioProfile()

  return (
    <div className="space-y-8">
      <PageHeader title="Experience section" description="Your roles, achievements and technologies." anchor="experience" saved={searchParams.saved} error={searchParams.error} errorText="Complete all required experience fields before saving." />
      <form action={updatePortfolioExperience} className="space-y-6">
        <input type="hidden" name="experienceCount" value={profile.experiences.length} />
        <Section title="Section content">
          <Field label="Heading" name="experienceHeading" defaultValue={profile.experienceHeading} required />
          <Field label="Description" name="experienceSectionDescription" defaultValue={profile.experienceDescription} required multiline rows={2} />
          <BanglaPanel missing={!profile.experienceHeadingBn}>
            <Field label="Heading" name="experienceHeadingBn" defaultValue={profile.experienceHeadingBn} bangla />
            <Field label="Description" name="experienceSectionDescriptionBn" defaultValue={profile.experienceDescriptionBn} bangla multiline rows={2} />
          </BanglaPanel>
        </Section>

        {profile.experiences.map((experience, index) => (
          <Section key={`${experience.company}-${index}`} title={`Experience ${index + 1}`}>
            <Field label="Job title" name={`experienceTitle${index}`} defaultValue={experience.title} required />
            <Field label="Company" name={`experienceCompany${index}`} defaultValue={experience.company} required />
            <Field label="Location" name={`experienceLocation${index}`} defaultValue={experience.location} required />
            <Field label="Period" name={`experiencePeriod${index}`} defaultValue={experience.period} required />
            <Field label="Employment type" name={`experienceType${index}`} defaultValue={experience.employmentType} required />
            <Checkbox label="Current role" name={`experienceCurrent${index}`} defaultChecked={experience.isCurrent} />
            <Field label="Description" name={`experienceDescription${index}`} defaultValue={experience.description} required multiline wide />
            <Field label="Achievements" hint="one per line" name={`experienceAchievements${index}`} defaultValue={lines(experience.achievements)} required multiline rows={5} />
            <Field label="Technologies" hint="comma separated" name={`experienceTechnologies${index}`} defaultValue={experience.technologies.join(", ")} required multiline rows={5} />
            <BanglaPanel missing={!experience.titleBn || !experience.descriptionBn}>
              <Field label="Job title" name={`experienceTitleBn${index}`} defaultValue={experience.titleBn} bangla />
              <Field label="Employment type" name={`experienceTypeBn${index}`} defaultValue={experience.employmentTypeBn} bangla />
              <Field label="Location" name={`experienceLocationBn${index}`} defaultValue={experience.locationBn} bangla />
              <Field label="Period" name={`experiencePeriodBn${index}`} defaultValue={experience.periodBn} bangla />
              <Field label="Description" name={`experienceDescriptionBn${index}`} defaultValue={experience.descriptionBn} bangla multiline wide />
              <Field label="Achievements" hint="one per line" name={`experienceAchievementsBn${index}`} defaultValue={lines(experience.achievementsBn)} bangla multiline rows={5} wide />
            </BanglaPanel>
          </Section>
        ))}

        <SaveBar label="Save experience" />
      </form>
    </div>
  )
}
