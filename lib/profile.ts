import { connectToDatabase } from "@/lib/db"
import type { Locale } from "@/lib/i18n"
import { defaultPortfolioProfile } from "@/lib/profile-defaults"
import { PortfolioProfile } from "@/model/profile"

export { defaultPortfolioProfile }

export type PortfolioProfileData = typeof defaultPortfolioProfile & {
  updatedAt: Date | null
  isPersisted: boolean
}

export type PublicPortfolioProfile = Omit<PortfolioProfileData, "updatedAt" | "isPersisted">

type PlainObject = Record<string, unknown>

const isPlainObject = (value: unknown): value is PlainObject =>
  typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof Date)
const sameValue = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)
const emptyLike = (value: unknown) => (Array.isArray(value) ? [] : typeof value === "boolean" ? false : typeof value === "number" ? 0 : "")
const hasContent = (value: unknown) => (Array.isArray(value) ? value.length > 0 : typeof value === "string" ? value.trim().length > 0 : false)

/**
 * Value for a Bangla field the saved data does not have: keep the default translation only while the English
 * source text still equals the default, so customised English never shows a stale Bangla translation.
 */
function bnFallback(key: string, saved: PlainObject, candidates: PlainObject[], template: unknown) {
  const sourceKey = key.slice(0, -2)
  const match = candidates.find((candidate) => saved[sourceKey] === undefined || sameValue(candidate[sourceKey], saved[sourceKey]))
  return match ? match[key] : emptyLike(template)
}

/** Shapes a saved list item like the default items: unknown keys (such as `_id`) are dropped, missing ones filled. */
function mergeItem(saved: PlainObject, defaults: PlainObject[]) {
  const template = defaults[0]
  const result: PlainObject = {}
  for (const [key, templateValue] of Object.entries(template)) {
    const value = saved[key]
    if (value !== undefined && value !== null) result[key] = value
    else result[key] = key.endsWith("Bn") ? bnFallback(key, saved, defaults, templateValue) : emptyLike(templateValue)
  }
  return result
}

/** Overlays a saved profile document on the defaults, field by field, using the defaults as the schema. */
function mergeProfile(saved: PlainObject) {
  const defaults = defaultPortfolioProfile as unknown as PlainObject
  const result: PlainObject = {}
  for (const [key, defaultValue] of Object.entries(defaults)) {
    const value = saved[key]
    const isObjectList = Array.isArray(defaultValue) && isPlainObject(defaultValue[0])
    if (isObjectList) {
      result[key] = Array.isArray(value) && value.length
        ? value.map((item) => mergeItem(item as PlainObject, defaultValue as PlainObject[]))
        : defaultValue
    } else if (key.endsWith("Bn")) {
      result[key] = value !== undefined && value !== null ? value : bnFallback(key, saved, [defaults], defaultValue)
    } else {
      const missing = value === undefined || value === null || (Array.isArray(value) && value.length === 0)
      result[key] = missing ? defaultValue : value
    }
  }
  return result as unknown as typeof defaultPortfolioProfile
}

/** Recursively swaps each field for its `…Bn` sibling when that sibling has content; empty Bangla falls back to English. */
function localizeValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(localizeValue)
  if (!isPlainObject(value)) return value
  const result: PlainObject = {}
  for (const [key, fieldValue] of Object.entries(value)) {
    const bangla = value[`${key}Bn`]
    result[key] = !key.endsWith("Bn") && hasContent(bangla) ? bangla : localizeValue(fieldValue)
  }
  return result
}

export function localizeProfile(profile: PublicPortfolioProfile, locale: Locale): PublicPortfolioProfile {
  return locale === "en" ? profile : (localizeValue(profile) as PublicPortfolioProfile)
}

export async function getPortfolioProfile(): Promise<PortfolioProfileData> {
  await connectToDatabase()
  const profile = await PortfolioProfile.findOne({ singletonKey: "primary" }).lean()

  if (!profile) {
    return { ...defaultPortfolioProfile, updatedAt: null, isPersisted: false }
  }

  return { ...mergeProfile(profile as unknown as PlainObject), updatedAt: profile.updatedAt, isPersisted: true }
}

/** Keep public pages available during database outages; admin reads still surface failures. */
export async function getPublicPortfolioProfile(): Promise<PublicPortfolioProfile> {
  try {
    const { updatedAt: _updatedAt, isPersisted: _isPersisted, ...profile } = await getPortfolioProfile()
    return profile
  } catch (error) {
    // Driver error messages can contain connection details, so only log the error type.
    console.error(
      "[portfolio] Could not load MongoDB profile; rendering bundled content. Check MONGODB_URI and MongoDB network access.",
      { errorName: error instanceof Error ? error.name : "UnknownError" },
    )
    return defaultPortfolioProfile
  }
}

export function getProfileCompleteness(profile: PortfolioProfileData) {
  const values = [
    profile.fullName,
    profile.professionalTitle,
    profile.tagline,
    profile.shortBio,
    ...profile.aboutParagraphs,
    profile.currentCompany,
    profile.yearsExperience,
    profile.email,
    profile.phone,
    profile.location,
    profile.githubUrl,
    profile.linkedinUrl,
    profile.resumeUrl,
    profile.portraitUrl,
    ...profile.technologies,
  ]
  return Math.round((values.filter((value) => value.trim().length > 0).length / values.length) * 100)
}

/** Share of Bangla fields that have content, shown on the admin overview. */
export function getBanglaCoverage(profile: PortfolioProfileData) {
  let total = 0
  let filled = 0
  const visit = (value: unknown) => {
    if (Array.isArray(value)) return value.forEach(visit)
    if (!isPlainObject(value)) return
    for (const [key, fieldValue] of Object.entries(value)) {
      if (key.endsWith("Bn")) {
        total++
        if (hasContent(fieldValue)) filled++
      } else visit(fieldValue)
    }
  }
  visit(profile)
  return total ? Math.round((filled / total) * 100) : 100
}
