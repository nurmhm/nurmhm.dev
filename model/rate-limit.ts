import mongoose, { type Model } from "mongoose"

export interface RateLimitDocument extends mongoose.Document {
  key: string
  count: number
  expiresAt: Date
}

const RateLimitSchema = new mongoose.Schema<RateLimitDocument>({
  key: { type: String, required: true, unique: true },
  count: { type: Number, required: true, default: 0 },
  // MongoDB's TTL monitor deletes each window once it has expired.
  expiresAt: { type: Date, required: true, expires: 0 },
})

export const RateLimit: Model<RateLimitDocument> =
  (mongoose.models.RateLimit as Model<RateLimitDocument> | undefined) ??
  mongoose.model<RateLimitDocument>("RateLimit", RateLimitSchema)
