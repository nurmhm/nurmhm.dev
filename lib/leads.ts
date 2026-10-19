import { dictionaries } from "@/lib/i18n"

// Stored values are always the English labels; the form shows the translated label for the same index.
// Shared by the public lead form and the server action ("use server" files may only export async functions).
export const projectTypes = dictionaries.en.contact.projectTypes
export const budgetRanges = dictionaries.en.contact.budgets
export const timelines = dictionaries.en.contact.timelines

export type LeadFormState = { status: "idle" | "success" | "error"; message: string }
