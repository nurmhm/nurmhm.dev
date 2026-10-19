import { BanglaPanel, Field, PageHeader, SaveBar, Section } from "@/components/admin/form-kit"
import { updatePortfolioTestimonials } from "@/lib/actions/profile"
import { getPortfolioProfile } from "@/lib/profile"

type PageProps = { searchParams: { saved?: string; error?: string } }

export default async function TestimonialsAdminPage({ searchParams }: PageProps) {
  const profile = await getPortfolioProfile()

  return (
    <div className="space-y-8">
      <PageHeader
        title="Testimonials section"
        description="Real recommendations only. Quotes are shown exactly as written, in their original language, on both versions of the site."
        anchor="testimonials"
        saved={searchParams.saved}
        error={searchParams.error}
      />
      <form action={updatePortfolioTestimonials} className="space-y-6">
        <input type="hidden" name="testimonialCount" value={profile.testimonials.length} />
        <Section title="Section content">
          <Field label="Heading" name="testimonialsHeading" defaultValue={profile.testimonialsHeading} required />
          <Field label="Description" name="testimonialsSectionDescription" defaultValue={profile.testimonialsDescription} required multiline rows={2} />
          <BanglaPanel missing={!profile.testimonialsHeadingBn}>
            <Field label="Heading" name="testimonialsHeadingBn" defaultValue={profile.testimonialsHeadingBn} bangla />
            <Field label="Description" name="testimonialsSectionDescriptionBn" defaultValue={profile.testimonialsDescriptionBn} bangla multiline rows={2} />
          </BanglaPanel>
        </Section>

        {profile.testimonials.map((item, index) => (
          <Section key={`${item.name}-${index}`} title={`Testimonial ${index + 1}`}>
            <Field label="Quote" name={`testimonialQuote${index}`} defaultValue={item.quote} required multiline rows={4} wide />
            <Field label="Name" name={`testimonialName${index}`} defaultValue={item.name} required />
            <Field label="Title" name={`testimonialTitle${index}`} defaultValue={item.title} required />
            <Field label="Company" name={`testimonialCompany${index}`} defaultValue={item.company} required />
            <Field label="Rating (1-5)" name={`testimonialRating${index}`} type="number" defaultValue={item.rating} required />
            <Field label="Avatar path or URL" name={`testimonialAvatar${index}`} defaultValue={item.avatar} required wide />
          </Section>
        ))}

        <SaveBar label="Save testimonials" />
      </form>
    </div>
  )
}
