import mongoose, { type Model } from "mongoose"

export interface AdminUserDocument extends mongoose.Document {
  email: string
  passwordHash: string
  lastLoginAt?: Date
}

const AdminUserSchema = new mongoose.Schema<AdminUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
)

export const AdminUser: Model<AdminUserDocument> =
  (mongoose.models.AdminUser as Model<AdminUserDocument> | undefined) ??
  mongoose.model<AdminUserDocument>("AdminUser", AdminUserSchema)

// Keep the old import name source-compatible while the authentication layer migrates.
export default AdminUser