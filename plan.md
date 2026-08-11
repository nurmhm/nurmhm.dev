# Plan: Converting Static Portfolio to a Dynamic Full-Stack Site

## 1. Current State (audited)

- **Stack:** Next.js 14.2.25 (App Router), React 19, TypeScript, Tailwind CSS + shadcn/ui, framer-motion. TS strict, but `next.config.mjs` has `typescript.ignoreBuildErrors: true` (should be fixed).
- **Problem:** All data is hardcoded in `use client` components — `projects-section.tsx`, `blog-section.tsx`, `experience-section.tsx`, `education-section.tsx`, `skills-section.tsx`, `testimonials-section.tsx`, hero/about. Contact form (`contact-section.tsx:58`) fakes success with `Math.random()`. Blog links out to Medium. Resume is a static `public/nur_resume.pdf`.
- **No database, no API, no auth, no admin.**

## 2. Target Architecture

Next.js full-stack on Vercel + MongoDB Atlas + Mongoose. Public site reads data via Server Components/ISR; admin writes via Server Actions.

```
Browser ──► Public pages (SSR/ISR from MongoDB)
        └─► /admin login → session cookie → Server Actions (Zod-validated) → MongoDB
Contact form ──► Server Action ──► MongoDB + email (Resend/Nodemailer)
```

## 3. Tech Decisions

| Concern | Choice | Why |
|---|---|---|
| DB | MongoDB Atlas + Mongoose | Requirement |
| Mutations | Next.js Server Actions (Zod) | No extra API layer, type-safe, one codebase |
| Reads | Direct DB in Server Components + `revalidatePath` | Fast, no fetch indirection |
| Auth | JWT session cookie (jose) + bcrypt admin user | Zero-dependency, httpOnly cookie, middleware-protected routes |
| Email | Resend (API) with Nodemailer fallback | Reliable, free tier |
| Validation | Zod (already installed) | Reuse existing forms |
| Blog | Store Medium metadata only, link out | Per user choice |

## 4. Data Models (Mongoose schemas in `lib/models/`)

1. **AdminUser** — username, passwordHash
2. **SiteSettings** — single-doc: name, role, tagline, bio paragraphs, highlights, social links, contact info, availability, resume file
3. **Project** — title, subtitle, icon, description, image, technologies[], features[], status, liveUrl, githubUrl, company, stats{}, order, isPublished, views
4. **Experience** — title, company, location, period, type, status, description, projects[] (name/desc/tech[]), achievements[], technologies[], keyProject, order
5. **Education** — degree, institution, location, period, status, cgpa, description, subjects[], achievements[], order
6. **SkillCategory** — title, icon, color, borderColor, skills[], softSkills[], languages[], order
7. **Testimonial** — quote, name, title, company, avatar, rating, isApproved
8. **BlogPost** — title, mediumUrl, date, readTime, excerpt, image, tags[], isPublished, views
9. **ContactMessage** — name, email, subject, message, isRead, createdAt

## 5. Project Structure (new/changed)

```
lib/
  db.ts                    # mongoose singleton connection
  models/*.ts              # schemas above
  auth.ts                  # login, verify, session helpers
  actions/                 # server actions: projects, blog, testimonials, ...
  validations/*.ts         # Zod schemas
  email.ts                 # Resend/nodemailer
  seed.ts                  # seed script (admin user + current content from the components)
middleware.ts              # protect /admin/*
app/
  page.tsx                 # becomes a Server Component (fetch sections)
  api/revalidate/route.ts  # optional
  admin/
    login/page.tsx
    layout.tsx             # guard
    page.tsx               # dashboard overview + unread messages
    projects/page.tsx + editor
    blog/page.tsx + editor
    testimonials/page.tsx + editor
    experience/page.tsx + editor
    education/page.tsx + editor
    skills/page.tsx + editor
    settings/page.tsx      # hero/about/social/resume
    messages/page.tsx      # contact inbox
components/
  *-section.tsx            # converted to fetch data (server) or receive props
  admin/*.tsx              # CRUD forms (react-hook-form + zod + shadcn/ui)
```

Sections become presentational: data flows down from `app/page.tsx` via server fetch. Client-only parts (framer-motion, form submit) stay as client child components.

## 6. Implementation Phases

1. **Setup:** install `mongoose`, `jose`, `bcryptjs`, `resend`; add `.env.local` (MONGODB_URI, ADMIN_*, RESEND_API_KEY); fix `typescript.ignoreBuildErrors`.
2. **DB layer:** `db.ts` + all Mongoose schemas + Zod validations + `seed.ts` (migrates current hardcoded data from the components into MongoDB).
3. **Backend:** auth (`lib/auth.ts` + middleware), server actions per resource, email service, contact-message action.
4. **Convert public site:** turn sections into server-rendered components pulling from DB with ISR (`revalidate: 3600` + `revalidatePath` on mutations). Keep framer-motion client wrappers.
5. **Contact form:** real submit → Zod → save + email + success/error UI.
6. **Admin dashboard:** login page, protected layout, dashboard with message inbox, CRUD pages for each content type (list + editor forms, publish/unpublish, delete), settings page (resume upload).
7. **Polish & SEO:** dynamic metadata, caching/ISR strategy, loading/error states, empty states.
8. **Deploy:** push to Vercel, set env vars, run `seed` (or `POST /api/seed` guarded), verify.

## 7. Security

- bcrypt-hashed admin password; JWT session in httpOnly+SameSite cookie; middleware blocks non-authenticated `/admin/*`.
- Server actions: Zod-validate every input; never trust client.
- Contact form: server-side rate limit (basic IP-based), sanitize email inputs, no HTML rendering of user content.
- Env secrets never committed; keep `typescript.ignoreBuildErrors: false` at the end.

## 8. Deployment (Vercel + Atlas)

- Atlas: create free cluster → allow Vercel IPs / network access → copy connection string into Vercel env vars.
- Vercel env: `MONGODB_URI`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `RESEND_API_KEY`.
- Vercel Serverless caveats: maintain the Mongoose connection singleton (cached across warm invocations); use ISR so page loads are cached; handle cold starts gracefully.

## 9. Risks / Notes

- **Mongoose + Next 14/React 19** on Server Components: keep all schema access behind `lib/db.ts` to avoid the "Mongoose buffering" pitfall.
- Current site uses `unoptimized: true` for images — keep for now (no external optimizer needed).
- Converting client→server sections is the riskiest refactor; each section stays visually identical, only the data source changes.

## 10. Deliverables

- `plan.md` (this document, expanded) + code per phase
- Seeded MongoDB with current portfolio content (zero data loss)
- Working admin dashboard + contact form + email
