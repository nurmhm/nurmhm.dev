import { BanglaPanel, Checkbox, Field, PageHeader, SaveBar, Section, lines } from "@/components/admin/form-kit"
import { updatePortfolioProjects } from "@/lib/actions/profile"
import { getPortfolioProfile } from "@/lib/profile"

type PageProps = { searchParams: { saved?: string; error?: string } }

export default async function ProjectsAdminPage({ searchParams }: PageProps) {
  const profile = await getPortfolioProfile()

  return (
    <div className="space-y-8">
      <PageHeader
        title="Projects section"
        description="Case studies shown under Featured work. Images use paths to files in the public directory, for example /project-image.jpg. When the problem, approach or result is filled in, it is shown instead of the description."
        anchor="projects"
        saved={searchParams.saved}
        error={searchParams.error}
        errorText="Check required fields, image paths, and complete URLs."
      />
      <form action={updatePortfolioProjects} className="space-y-6">
        <input type="hidden" name="projectCount" value={profile.projects.length} />
        <Section title="Section content">
          <Field label="Heading" name="projectsHeading" defaultValue={profile.projectsHeading} required />
          <Field label="Description" name="projectsSectionDescription" defaultValue={profile.projectsDescription} required multiline rows={2} />
          <BanglaPanel missing={!profile.projectsHeadingBn}>
            <Field label="Heading" name="projectsHeadingBn" defaultValue={profile.projectsHeadingBn} bangla />
            <Field label="Description" name="projectsSectionDescriptionBn" defaultValue={profile.projectsDescriptionBn} bangla multiline rows={2} />
          </BanglaPanel>
        </Section>

        {profile.projects.map((project, index) => (
          <Section key={`${project.title}-${index}`} title={`Project ${index + 1}`}>
            <Field label="Title" hint="shown in every language" name={`projectTitle${index}`} defaultValue={project.title} required />
            <Field label="Subtitle" name={`projectSubtitle${index}`} defaultValue={project.subtitle} required />
            <Field label="Category" name={`projectCategory${index}`} defaultValue={project.category} required />
            <Field label="Status" name={`projectStatus${index}`} defaultValue={project.status} required />
            <Field label="Description" name={`projectDescription${index}`} defaultValue={project.description} required multiline wide />
            <Field label="Case study: the problem" name={`projectProblem${index}`} defaultValue={project.problem} multiline rows={2} wide />
            <Field label="Case study: the approach" name={`projectApproach${index}`} defaultValue={project.approach} multiline wide />
            <Field label="Case study: the result" hint="only numbers you can back up" name={`projectResult${index}`} defaultValue={project.result} multiline rows={2} wide />
            <Field label="Image path" name={`projectImage${index}`} defaultValue={project.image} placeholder="/project-image.jpg" required />
            <Field label="Built for (company)" hint="optional" name={`projectCompany${index}`} defaultValue={project.company} />
            <Field label="Live URL" name={`projectLiveUrl${index}`} type="url" defaultValue={project.liveUrl} />
            <Field label="GitHub URL" name={`projectGithubUrl${index}`} type="url" defaultValue={project.githubUrl} />
            <Field label="Technologies" hint="comma separated" name={`projectTechnologies${index}`} defaultValue={project.technologies.join(", ")} required multiline rows={4} />
            <Field label="Features" hint="one per line" name={`projectFeatures${index}`} defaultValue={lines(project.features)} required multiline rows={4} />
            <Checkbox label='Show a "Solo-built" badge (only if one person built it)' name={`projectSoloBuilt${index}`} defaultChecked={project.soloBuilt} wide />
            <BanglaPanel missing={!project.subtitleBn || !project.problemBn}>
              <Field label="Subtitle" name={`projectSubtitleBn${index}`} defaultValue={project.subtitleBn} bangla />
              <Field label="Category" name={`projectCategoryBn${index}`} defaultValue={project.categoryBn} bangla />
              <Field label="Status" name={`projectStatusBn${index}`} defaultValue={project.statusBn} bangla />
              <Field label="Features" hint="one per line" name={`projectFeaturesBn${index}`} defaultValue={lines(project.featuresBn)} bangla multiline rows={3} />
              <Field label="Description" name={`projectDescriptionBn${index}`} defaultValue={project.descriptionBn} bangla multiline wide />
              <Field label="The problem" name={`projectProblemBn${index}`} defaultValue={project.problemBn} bangla multiline rows={2} wide />
              <Field label="The approach" name={`projectApproachBn${index}`} defaultValue={project.approachBn} bangla multiline wide />
              <Field label="The result" name={`projectResultBn${index}`} defaultValue={project.resultBn} bangla multiline rows={2} wide />
            </BanglaPanel>
          </Section>
        ))}

        <SaveBar label="Save projects" />
      </form>
    </div>
  )
}
