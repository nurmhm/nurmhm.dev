# Implementation Plan: Dynamic Full-Stack Portfolio

## 0. Goal and Success Criteria

Convert the current static, client-rendered portfolio into a server-rendered Next.js application backed by MongoDB. One seeded administrator can sign in to a protected dashboard and manage all public portfolio content. There is no registration or public user system.

The implementation is complete when:

- The seed command idempotently creates or updates the only administrator.
- Every visible portfolio content area can be managed from the dashboard.
- Public content is rendered on the server from MongoDB and revalidated after mutations.
- Contact messages are validated, rate-limited, stored, and visible in the dashboard.
- Metadata, canonical URLs, sitemap, robots directives, Open Graph data, and JSON-LD are present.
- Existing static content is migrated without losing data or maintaining duplicate content sources.
- `pnpm exec tsc --noEmit` and `pnpm build` pass without ignored errors.

## 1. Current State (audited)

- **Stack:** Next.js 14.2.25 (App Router), React 19, TypeScript, Tailwind CSS + shadcn/ui, framer-motion. TypeScript is strict, but `next.config.mjs` currently hides build errors.
- **Problem:** All data is hardcoded in `use client` components — `projects-section.tsx`, `blog-section.tsx`, `experience-section.tsx`, `education-section.tsx`, `skills-section.tsx`, `testimonials-section.tsx`, hero/about. Contact form (`contact-section.tsx:58`) fakes success with `Math.random()`. Blog links out to Medium. Resume is a static `public/nur_resume.pdf`.
- **Partial backend work:** `lib/mongodb.ts`, `model/user.ts`, and `lib/seed-admin.ts` exist, but there are no protected routes, sessions, CRUD operations, or public database reads.
- **Known baseline error:** `components/cli-terminal.tsx` does not pass TypeScript checking. The CLI is also a second, large copy of portfolio content.

## 2. Target Architecture

Next.js full-stack on Vercel + MongoDB Atlas + Mongoose. Public pages read through Server Components with cached queries; admin writes through authenticated Server Actions. Cloudinary stores uploaded images and resumes because Vercel has no durable runtime filesystem.

```
Browser ──► Public page (Server Components/cached MongoDB queries)
        └─► /admin/login → encrypted httpOnly session → protected dashboard
Protected dashboard ──► authenticated Server Actions → MongoDB → revalidatePath
Uploads ──► signed server-side Cloudinary operation → asset metadata in MongoDB
Contact form ──► Zod + honeypot + rate limit ──► MongoDB + Resend notification
```

## 3. Tech Decisions

| Concern | Choice | Why |
|---|---|---|
| DB | MongoDB Atlas + Mongoose | Requirement |
| Mutations | Next.js Server Actions (Zod) | No extra API layer, type-safe, one codebase |
| Reads | Direct DB in Server Components + `revalidatePath` | Fast, no fetch indirection |
| Auth | Encrypted/signed cookie session + bcrypt admin user | No registration; httpOnly cookie; verify authorization inside every protected action |
| Email | Resend (API) with Nodemailer fallback | Reliable, free tier |
| Validation | Zod (already installed) | Reuse existing forms |
| Blog | Store Medium metadata only, link out | Per user choice |
| Assets | Cloudinary | Durable image/resume uploads on Vercel |
| Forms | Server Actions + react-hook-form where useful | Progressive enhancement and shared server validation |

## 4. Data Models (Mongoose schemas in `lib/models/`)

1. **AdminUser** — normalized unique email, passwordHash, lastLoginAt
2. **SiteSettings** — singleton key, name, roles, tagline, bio, highlights, social/contact details, availability, hero technologies, resume asset, default SEO fields
3. **Project** — stable seed key, title, subtitle, icon key, description, image asset, technologies[], features[], status, URLs, company, stats[], order, isPublished
4. **Experience** — stable seed key, title, company, location, start/end labels, type, status, description, projects[], achievements[], technologies[], order, isPublished
5. **Education** — stable seed key, degree, institution, location, period, status, CGPA, description, subjects[], achievements[], order, isPublished
6. **SkillCategory** — stable seed key, title, icon key, skills[], optional softSkills/languages, order, isPublished
7. **Testimonial** — stable seed key, quote, name, title, company, avatar asset, rating, order, isApproved
8. **BlogPost** — stable seed key, title, Medium URL, published date, read time, excerpt, image asset, tags[], order, isPublished
9. **ContactMessage** — name, normalized email, subject, message, status, admin notes, createdAt

Small related lists remain embedded in their owning document. Assets store both a delivery URL and Cloudinary public ID so replaced files can be cleaned up.

## 5. Project Structure (new/changed)

```
lib/
  db.ts                    # cached mongoose connection
  env.ts                   # validated server environment
  models/*.ts              # schemas above
  auth/                    # login, session, guards, throttling
  actions/                 # authenticated mutations and contact action
  queries/                 # typed public/admin reads
  validations/*.ts         # shared Zod schemas
  uploads/                 # Cloudinary server integration
  email/                   # Resend notification integration
  seed/                    # typed current content + idempotent upserts
middleware.ts              # optimistic /admin route check; actions re-check auth
app/
  page.tsx                 # becomes a Server Component (fetch sections)
  api/revalidate/route.ts  # optional
  admin/
    login/page.tsx
    (protected)/layout.tsx # authoritative server guard
    page.tsx               # dashboard overview + unread messages
    projects/page.tsx + editor
    blog/page.tsx + editor
    testimonials/page.tsx + editor
    experience/page.tsx + editor
    education/page.tsx + editor
    skills/page.tsx + editor
    settings/page.tsx      # hero/about/social/resume/default SEO
    messages/page.tsx      # contact inbox
components/
  *-section.tsx            # converted to fetch data (server) or receive props
  admin/*.tsx              # CRUD forms (react-hook-form + zod + shadcn/ui)
```

Sections become presentational: serializable data flows down from `app/page.tsx`. Client-only animation and interaction stays in focused child components. The CLI consumes the same queried data rather than maintaining its own content copy.

## 6. Implementation Phases

1. **Stabilize:** fix current TypeScript errors, remove `ignoreBuildErrors`, confirm framework compatibility, and establish passing typecheck/build commands.
2. **Foundation:** cached DB connection, environment validation, models, indexes, Zod schemas, typed queries, and `.env.example`.
3. **Authentication:** idempotent admin seed, login/logout actions, encrypted session cookie, login throttling, middleware check, protected layout, and server-side action guards.
4. **Content migration:** extract current static data into typed seed fixtures with stable keys and upsert all content. Verify counts and representative fields. Remove duplicate CLI data.
5. **Public conversion:** make the page a Server Component, query published data in parallel, retain focused client animation wrappers, and add graceful unseeded/empty states.
6. **Dashboard:** overview plus settings, project, experience, education, skills, testimonial, blog, and message management. Include ordering, publication state, delete confirmation, and robust form states.
7. **Contact and assets:** real contact submission, abuse controls, MongoDB persistence, Resend notification, Cloudinary image/resume upload and replacement cleanup.
8. **SEO and performance:** dynamic metadata, canonical URL, Open Graph/Twitter assets, `robots.ts`, `sitemap.ts`, Person/WebSite/ProfilePage JSON-LD, semantic content, and `next/image`.
9. **Verification:** tests for validation/auth, integration tests for protected mutations, login/edit/revalidation/contact smoke tests, typecheck, and production build.
10. **Deployment:** configure Atlas, Cloudinary, Resend, and Vercel environment variables; run the CLI seed once; verify sessions, CRUD, public rendering, and SEO in production.

## 7. Security

- bcrypt-hashed admin password; encrypted/signed session in an httpOnly, secure-in-production, SameSite=Lax cookie.
- No registration, password reset, public seed endpoint, or general user roles.
- Middleware performs an early route check; protected layouts, queries, and every mutation perform authoritative session verification.
- Zod validates all untrusted input. MongoDB updates use explicit allowlisted fields.
- Contact form uses a honeypot, server-side rate limit, length limits, normalized email, and no HTML rendering of user content.
- Uploads validate MIME type and size on the server. Cloudinary credentials and all other secrets remain server-only.
- Env secrets never committed; keep `typescript.ignoreBuildErrors: false` at the end.

## 8. Deployment (Vercel + Atlas)

- Atlas: create free cluster → allow Vercel IPs / network access → copy connection string into Vercel env vars.
- Vercel env: `MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`, Cloudinary credentials, `RESEND_API_KEY`, and notification email addresses.
- Vercel Serverless caveats: maintain the Mongoose connection singleton (cached across warm invocations); use ISR so page loads are cached; handle cold starts gracefully.

## 9. Risks / Notes

- **Mongoose + Next 14/React 19** on Server Components: keep all schema access behind `lib/db.ts` to avoid the "Mongoose buffering" pitfall.
- Current site uses `unoptimized: true`; remove this after Cloudinary remote image patterns and `next/image` are configured.
- Converting client→server sections is the riskiest refactor; each section stays visually identical, only the data source changes.
- Do not use an HTTP seed endpoint. Seeding is a privileged CLI operation using environment credentials.
- `revalidatePath("/")` runs after successful content mutations. Public queries may use a cache tag; admin reads remain uncached.

## 10. SEO Deliverables

- Site URL and default title/description managed in settings with sensible environment fallbacks.
- Canonical URL, metadata base, Open Graph and Twitter cards, favicon, and share image.
- `app/sitemap.ts` and `app/robots.ts` generated from the canonical site URL.
- JSON-LD for `Person`, `WebSite`, and `ProfilePage` using public settings and social profiles.
- Server-rendered headings and portfolio text so crawlers do not depend on client hydration.
- Semantic landmarks, descriptive image alternatives, accessible controls, and external-link attributes.

## 11. Deliverables

- This implementation plan and code delivered phase by phase
- Seeded MongoDB with current portfolio content (zero data loss)
- Seed-only administrator authentication and protected management dashboard
- Server-rendered public portfolio, working contact inbox/email, durable asset uploads, and complete technical SEO
- Passing typecheck, tests, and production build
