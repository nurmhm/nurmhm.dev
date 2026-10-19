import mongoose, { type Model } from "mongoose"

export const leadStatuses = ["new", "contacted", "won", "lost"] as const
export type LeadStatus = (typeof leadStatuses)[number]

export interface LeadDocument extends mongoose.Document {
  name: string
  email: string
  whatsapp: string
  projectType: string
  budgetRange: string
  timeline: string
  message: string
  aiBrief: string
  locale: "en" | "bn"
  source: "form" | "ai-brief"
  status: LeadStatus
  createdAt: Date
  updatedAt: Date
}

const LeadSchema = new mongoose.Schema<LeadDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    whatsapp: { type: String, default: "", trim: true },
    projectType: { type: String, required: true, trim: true },
    budgetRange: { type: String, required: true, trim: true },
    timeline: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    aiBrief: { type: String, default: "" },
    locale: { type: String, enum: ["en", "bn"], default: "en" },
    source: { type: String, enum: ["form", "ai-brief"], default: "form" },
    status: { type: String, enum: leadStatuses, default: "new", index: true },
  },
  { timestamps: true },
)

export const Lead: Model<LeadDocument> =
  (mongoose.models.Lead as Model<LeadDocument> | undefined) ?? mongoose.model<LeadDocument>("Lead", LeadSchema)
