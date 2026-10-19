"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireAdmin } from "@/lib/auth/guards"
import { connectToDatabase } from "@/lib/db"
import { dictionaries, isLocale } from "@/lib/i18n"
import { budgetRanges, projectTypes, timelines, type LeadFormState } from "@/lib/leads"
import { consumeRateLimit } from "@/lib/rate-limit"
import { Lead, leadStatuses } from "@/model/lead"

const leadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(160),
  whatsapp: z.string().trim().max(30),
  projectType: z.string().refine((value) => projectTypes.includes(value)),
  budgetRange: z.string().refine((value) => budgetRanges.includes(value)),
  timeline: z.string().refine((value) => timelines.includes(value)),
  message: z.string().trim().min(10).max(4000),
  aiBrief: z.string().max(8000),
})

export async function submitLead(_previous: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const requestedLocale = formData.get("locale")
  const locale = isLocale(requestedLocale) ? requestedLocale : "en"
  const t = dictionaries[locale].lead

  // Bots fill every field, including this visually hidden one; pretend success so they move on.
  if (String(formData.get("company_website") ?? "")) {
    return { status: "success", message: t.success }
  }

  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp") ?? "",
    projectType: formData.get("projectType"),
    budgetRange: formData.get("budgetRange"),
    timeline: formData.get("timeline"),
    message: formData.get("message"),
    aiBrief: formData.get("aiBrief") ?? "",
  })
  if (!parsed.success) {
    return { status: "error", message: t.invalid }
  }

  if (!(await consumeRateLimit("lead", 5))) {
    return { status: "error", message: t.limited }
  }

  await connectToDatabase()
  await Lead.create({ ...parsed.data, locale, source: parsed.data.aiBrief ? "ai-brief" : "form" })
  await notifyNewLead({ ...parsed.data, locale }).catch((error) => console.error("Lead notification failed", error))
  revalidatePath("/admin")
  revalidatePath("/admin/leads")

  return { status: "success", message: t.success }
}

async function notifyNewLead(lead: z.infer<typeof leadSchema> & { locale: string }) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.LEAD_NOTIFY_EMAIL
  if (!apiKey || !to) return

  const lines = [
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `WhatsApp: ${lead.whatsapp || "-"}`,
    `Project: ${lead.projectType}`,
    `Budget: ${lead.budgetRange}`,
    `Timeline: ${lead.timeline}`,
    `Language: ${lead.locale === "bn" ? "Bangla — reply in Bangla" : "English"}`,
    "",
    lead.message,
    ...(lead.aiBrief ? ["", "--- AI brief ---", lead.aiBrief] : []),
  ]
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.LEAD_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to,
      reply_to: lead.email,
      subject: `New project lead: ${lead.projectType} — ${lead.name}`,
      text: lines.join("\n"),
    }),
  })
  if (!response.ok) throw new Error(`Resend responded ${response.status}: ${await response.text()}`)
}

const statusSchema = z.enum(leadStatuses)

export async function updateLeadStatus(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get("id") ?? "")
  const status = statusSchema.safeParse(formData.get("status"))
  if (!id || !status.success) return
  await connectToDatabase()
  await Lead.findByIdAndUpdate(id, { status: status.data })
  revalidatePath("/admin")
  revalidatePath("/admin/leads")
}

export async function deleteLead(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get("id") ?? "")
  if (!id) return
  await connectToDatabase()
  await Lead.findByIdAndDelete(id)
  revalidatePath("/admin")
  revalidatePath("/admin/leads")
}
