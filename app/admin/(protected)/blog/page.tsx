import { BanglaPanel, Field, PageHeader, SaveBar, Section } from "@/components/admin/form-kit"
import { updatePortfolioBlog } from "@/lib/actions/profile"
import { getPortfolioProfile } from "@/lib/profile"

type PageProps = { searchParams: { saved?: string; error?: string } }

export default async function BlogAdminPage({ searchParams }: PageProps) {
  const profile = await getPortfolioProfile()

  return (
    <div className="space-y-8">
      <PageHeader
        title="Blog section"
        description="Article cards linking to your posts. Articles are shown in their original language on both versions of the site."
        anchor="blog"
        saved={searchParams.saved}
        error={searchParams.error}
        errorText="Check all required fields and URLs before saving."
      />
      <form action={updatePortfolioBlog} className="space-y-6">
        <input type="hidden" name="blogCount" value={profile.blogPosts.length} />
        <Section title="Section content">
          <Field label="Heading" name="blogHeading" defaultValue={profile.blogHeading} required />
          <Field label="Description" name="blogSectionDescription" defaultValue={profile.blogDescription} required multiline rows={2} />
          <BanglaPanel missing={!profile.blogHeadingBn}>
            <Field label="Heading" name="blogHeadingBn" defaultValue={profile.blogHeadingBn} bangla />
            <Field label="Description" name="blogSectionDescriptionBn" defaultValue={profile.blogDescriptionBn} bangla multiline rows={2} />
          </BanglaPanel>
        </Section>

        {profile.blogPosts.map((post, index) => (
          <Section key={`${post.title}-${index}`} title={`Article ${index + 1}`}>
            <Field label="Title" name={`blogTitle${index}`} defaultValue={post.title} required wide />
            <Field label="Date" name={`blogDate${index}`} defaultValue={post.date} required />
            <Field label="Read time" name={`blogReadTime${index}`} defaultValue={post.readTime} required />
            <Field label="Excerpt" name={`blogExcerpt${index}`} defaultValue={post.excerpt} required multiline wide />
            <Field label="Image path or URL" name={`blogImage${index}`} defaultValue={post.image} required />
            <Field label="Article URL" name={`blogLink${index}`} type="url" defaultValue={post.link} required />
            <Field label="Tags" hint="comma separated" name={`blogTags${index}`} defaultValue={post.tags.join(", ")} required wide />
          </Section>
        ))}

        <SaveBar label="Save blog" />
      </form>
    </div>
  )
}
