import { BanglaPanel, Field, PageHeader, SaveBar, Section, lines } from "@/components/admin/form-kit"
import { updatePortfolioEducation } from "@/lib/actions/profile"
import { getPortfolioProfile } from "@/lib/profile"

type PageProps = { searchParams: { saved?: string; error?: string } }

export default async function EducationAdminPage({ searchParams }: PageProps) {
  const profile = await getPortfolioProfile()

  return (
    <div className="space-y-8">
      <PageHeader title="Education section" description="Academic history, subjects and achievements." anchor="education" saved={searchParams.saved} error={searchParams.error} errorText="Complete all required education fields before saving." />
      <form action={updatePortfolioEducation} className="space-y-6">
        <input type="hidden" name="educationCount" value={profile.education.length} />
        <Section title="Section content">
          <Field label="Heading" name="educationHeading" defaultValue={profile.educationHeading} required />
          <Field label="Description" name="educationSectionDescription" defaultValue={profile.educationDescription} required multiline rows={2} />
          <BanglaPanel missing={!profile.educationHeadingBn}>
            <Field label="Heading" name="educationHeadingBn" defaultValue={profile.educationHeadingBn} bangla />
            <Field label="Description" name="educationSectionDescriptionBn" defaultValue={profile.educationDescriptionBn} bangla multiline rows={2} />
          </BanglaPanel>
        </Section>

        {profile.education.map((item, index) => (
          <Section key={`${item.institution}-${index}`} title={`Education ${index + 1}`}>
            <Field label="Degree" name={`educationDegree${index}`} defaultValue={item.degree} required wide />
            <Field label="Institution" name={`educationInstitution${index}`} defaultValue={item.institution} required />
            <Field label="Location" name={`educationLocation${index}`} defaultValue={item.location} required />
            <Field label="Period" name={`educationPeriod${index}`} defaultValue={item.period} required />
            <Field label="Status" name={`educationStatus${index}`} defaultValue={item.status} required />
            <Field label="CGPA" hint="optional" name={`educationCgpa${index}`} defaultValue={item.cgpa} />
            <Field label="Description" name={`educationDescription${index}`} defaultValue={item.description} required multiline wide />
            <Field label="Key subjects" hint="one per line" name={`educationSubjects${index}`} defaultValue={lines(item.subjects)} required multiline rows={5} />
            <Field label="Achievements" hint="one per line" name={`educationAchievements${index}`} defaultValue={lines(item.achievements)} required multiline rows={5} />
            <BanglaPanel missing={!item.degreeBn || !item.descriptionBn}>
              <Field label="Degree" name={`educationDegreeBn${index}`} defaultValue={item.degreeBn} bangla wide />
              <Field label="Institution" name={`educationInstitutionBn${index}`} defaultValue={item.institutionBn} bangla />
              <Field label="Location" name={`educationLocationBn${index}`} defaultValue={item.locationBn} bangla />
              <Field label="Period" name={`educationPeriodBn${index}`} defaultValue={item.periodBn} bangla />
              <Field label="Status" name={`educationStatusBn${index}`} defaultValue={item.statusBn} bangla />
              <Field label="Description" name={`educationDescriptionBn${index}`} defaultValue={item.descriptionBn} bangla multiline wide />
              <Field label="Key subjects" hint="one per line" name={`educationSubjectsBn${index}`} defaultValue={lines(item.subjectsBn)} bangla multiline rows={5} />
              <Field label="Achievements" hint="one per line" name={`educationAchievementsBn${index}`} defaultValue={lines(item.achievementsBn)} bangla multiline rows={5} />
            </BanglaPanel>
          </Section>
        ))}

        <SaveBar label="Save education" />
      </form>
    </div>
  )
}
