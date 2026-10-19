import { BanglaPanel, Field, PageHeader, SaveBar, Section, lines } from "@/components/admin/form-kit"
import { updatePortfolioSkills } from "@/lib/actions/profile"
import { getPortfolioProfile } from "@/lib/profile"

type PageProps = { searchParams: { saved?: string; error?: string } }

export default async function SkillsAdminPage({ searchParams }: PageProps) {
  const profile = await getPortfolioProfile()
  const languages = profile.languages.map((language) => [language.name, language.level, language.nameBn, language.levelBn].join(" | ")).join("\n")

  return (
    <div className="space-y-8">
      <PageHeader title="Skills section" description="Technology groups, working style and languages." anchor="skills" saved={searchParams.saved} error={searchParams.error} errorText="Complete all six categories and every language line before saving." />
      <form action={updatePortfolioSkills} className="space-y-6">
        <Section title="Section content">
          <Field label="Heading" name="skillsHeading" defaultValue={profile.skillsHeading} required />
          <Field label="Description" name="skillsDescription" defaultValue={profile.skillsDescription} required multiline rows={2} />
          <BanglaPanel missing={!profile.skillsHeadingBn}>
            <Field label="Heading" name="skillsHeadingBn" defaultValue={profile.skillsHeadingBn} bangla />
            <Field label="Description" name="skillsDescriptionBn" defaultValue={profile.skillsDescriptionBn} bangla multiline rows={2} />
          </BanglaPanel>
        </Section>

        <Section title="Technology categories">
          {profile.skillCategories.map((category, index) => (
            <div key={index} className="space-y-3 rounded-md border border-slate-800 p-4">
              <Field label={`Category ${index + 1} title`} name={`categoryTitle${index}`} defaultValue={category.title} required />
              <Field label="Title" name={`categoryTitleBn${index}`} defaultValue={category.titleBn} bangla />
              <Field label="Skills" hint="one per line; shown in every language" name={`categorySkills${index}`} defaultValue={lines(category.skills)} required multiline rows={6} />
            </div>
          ))}
        </Section>

        <Section title="Working style and languages">
          <Field label="Working style" hint="comma separated" name="softSkills" defaultValue={profile.softSkills.join(", ")} required multiline rows={3} />
          <Field label="Working style" hint="comma separated" name="softSkillsBn" defaultValue={profile.softSkillsBn.join(", ")} bangla multiline rows={3} />
          <Field label="Languages" hint="one per line: name | level | বাংলা name | বাংলা level" name="languages" defaultValue={languages} required multiline rows={4} wide />
        </Section>

        <SaveBar label="Save skills" />
      </form>
    </div>
  )
}
