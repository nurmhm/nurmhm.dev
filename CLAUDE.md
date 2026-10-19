# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm**.

- `pnpm dev` — Next.js dev server
- `pnpm build` — production build
- `pnpm typecheck` — `tsc --noEmit` (strict mode)
- `pnpm seed:admin` — create the single admin user, or reset its password, from `ADMIN_EMAIL` / `ADMIN_PASSWORD` (at least 12 characters)
- `pnpm seed` — back up the current profile to `.seed-backups/`, then replace it with `lib/profile-defaults.ts`. Leads and the admin user are not touched.
- `pnpm seed:restore <file>` — restore a backup made by `pnpm seed`

There is no lint script and no test suite. `pnpm typecheck` and `pnpm build` are the verification steps. CLI scripts load `.env.local`, then `.env`, through `lib/load-env.ts`; an exported environment variable wins over both.

Env (see `.env.example`; validated in `lib/env.ts`):
- **Required:** `MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET` (min 32 chars).
- **Optional:**
  - `NEXT_PUBLIC_SITE_URL` — canonical and hreflang URLs.
  - `ANTHROPIC_API_KEY` — the AI brief generator. Without it, `/api/brief` returns 503 and the UI falls back to the contact form.
  - `BRIEF_MODEL` — defaults to `claude-haiku-5-5`.
  - `RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL` (and optionally `LEAD_FROM_EMAIL`) — new-lead emails.

## Architecture

This is a Next.js 14 App Router site (React 19, Tailwind, shadcn/ui in `components/ui/`, framer-motion, raw three.js) backed by MongoDB through Mongoose. A single seeded admin edits all public content from `/admin`. There is no public registration.

The site is aimed at winning freelance clients, not at job hunting. It sells the full software lifecycle (web, mobile, AI, e-commerce, ERP, design, QA, DevOps, maintenance) with the owner as the client's single accountable contact. Copy must not claim the owner personally builds everything alone, and it should not mention a team. Never present invented testimonials or client results as real. Demo services and FAQs carry `isPlaceholder: true`, which the admin flags as "Demo — replace me".

The public page follows a conversion order set in `components/portfolio-content.tsx`:
1. Hero with the AI brief generator
2. Proof stats
3. Services and pricing
4. Case studies
5. Process
6. Why work with me
7. Testimonials
8. About, skills, experience, education, blog
9. FAQ
10. Contact / lead form

### Content model: one singleton document

All portfolio content lives in **one** `PortfolioProfile` document (`model/profile.ts`), keyed by `singletonKey: "primary"`. `plan.md` describes a target design with separate collections, but the code does not follow it. Keep the singleton unless you are deliberately migrating.

- **`lib/profile-defaults.ts`:** the curated content in both languages. It is what `pnpm seed` writes, what the site falls back to, and, through `typeof defaultPortfolioProfile`, the source of the `PortfolioProfileData` / `PublicPortfolioProfile` types.
- **`lib/profile.ts`, `getPortfolioProfile()`:** runs a generic `mergeProfile()` that treats the defaults as the schema.
  - Missing or empty fields fall back to the defaults.
  - Saved list items are re-shaped like the default items: unknown keys such as `_id` are dropped and missing keys are filled with empty values.
  - A missing `…Bn` field keeps its default translation only while its English source still equals the default, so customised English never shows a stale translation.
- **Adding a content field:** update the Mongoose schema and interface, `profile-defaults.ts`, and the section's Zod schema and parser in `lib/actions/profile.ts` and its admin form. The merge needs no changes.

### English / Bangla

- **Routes:** `/` is English and `/bn` is Bangla. Both render `components/portfolio-page.tsx`, which calls `localizeProfile()`. That recursively replaces every field with its non-empty `…Bn` sibling, then passes the result to `PortfolioContent` with a `locale`.
- **Document language:** `middleware.ts` sets the `x-locale` header on `/bn`, and the root layout reads it to set `<html lang>`. Bangla uses Hind Siliguri (`--font-bengali` in `globals.css`).
- **Interface strings:** every one lives in `lib/i18n.ts`, which defines `Dictionary` from the English object, so the compiler requires Bangla to have every key. Client components read them with `useI18n()` (`components/i18n-provider.tsx`). Never inline UI copy in components.
- **Not translated:** testimonial quotes and blog posts stay in their original language and are marked `lang="en"`. Product names, skill names and technologies are never translated.
- **Lead form:** dropdowns store English option values, while the displayed labels come from the dictionary at the same index. `submitLead` localizes its messages from a hidden `locale` field and saves `locale` on the lead.

### Admin writes

Each `app/admin/(protected)/<section>/page.tsx` is a Server Component built from `components/admin/form-kit.tsx` (`Field`, `Section`, `BanglaPanel`, `PageHeader`, `SaveBar`) with a plain `<form action={serverAction}>`.
- **Form input:** arrays are entered as newline-, comma- or `|`-separated text, and repeated items use indexed names such as `experienceTitleBn0`.
- **Actions** (`lib/actions/profile.ts`) all follow the same pattern:
  1. call `requireAdmin()`
  2. parse the `FormData`
  3. validate with Zod, redirecting to `?error=invalid` on failure
  4. call `saveSection(data, adminPath)`, which `$set`s only that section's keys, uses `omitKeys(defaults, keys)` for `$setOnInsert` (the two may never share a path), revalidates `/`, `/bn`, `/admin` and the section page, then redirects to `?saved=1`
- **Bangla fields:** each section form posts its own `…Bn` fields, so a save never drops another section's translations.
- **Services page:** each list renders one blank "add" slot, and the action drops entries whose title is empty.

### Leads and the AI brief generator

- **Leads:** stored in their own `Lead` collection (`model/lead.ts`).
  - `submitLead` (`lib/actions/leads.ts`) is a public server action, called directly from the client form in `contact-section.tsx`.
  - It runs a honeypot check (`company_website`), Zod validation, and a rate limit, then saves the lead and sends a best-effort Resend email via `fetch`.
  - Admins manage leads at `/admin/leads`.
- **Shared constants:** the form options and `LeadFormState` live in `lib/leads.ts`, because `"use server"` files may only export async functions.
- **Rate limiting:** `lib/rate-limit.ts` is a fixed hourly window keyed by a salted IP hash, stored in the `RateLimit` collection with a TTL index. Both `submitLead` and `/api/brief` use it.
- **AI brief generator:** `app/api/brief/route.ts` streams Claude's text output, in Bangla when `locale: "bn"`.
  - The model returns one JSON object, which `components/brief-generator.tsx` parses once the stream ends.
  - A `[[ERROR]]` marker in the stream signals failure.
  - "Send this brief" lifts a `BriefDraft` into `PortfolioContent`, which prefills the contact form.
- **Constellation background:** `components/constellation-bg.tsx` is plain three.js, loaded with `next/dynamic` and `ssr: false`. It renders only on desktop, when reduced motion is not requested and WebGL is available. Otherwise the hero's CSS glows act as the fallback.

### Auth

- `lib/auth/session.ts` stores a custom HMAC-signed (not encrypted) cookie `portfolio_admin_session` containing `{email, exp}`, with a 7-day TTL.
- `middleware.ts` only checks that the cookie exists on `/admin/*` (except `/admin/login`).
- The real check is `requireAdmin()` (`lib/auth/guards.ts`), which runs in `app/admin/(protected)/layout.tsx` and **must also be called at the top of every server action**.

### DB connection

`lib/db.ts` exports `connectToDatabase()`, which caches the connection on `globalThis` for dev hot reload. `lib/mongodb.ts` is a re-export kept for older imports. Path alias: `@/*` resolves to the repo root; it also works in `tsx` scripts.
