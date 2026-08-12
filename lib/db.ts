import mongoose from "mongoose"

const globalForMongoose = globalThis as unknown as {
  mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined
}

const cached = globalForMongoose.mongoose ?? { conn: null, promise: null }
globalForMongoose.mongoose = cached

export async function connectToDatabase() {
  if (cached.conn) return cached.conn

  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error("MONGODB_URI is not configured")

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { bufferCommands: false })
  }

  cached.conn = await cached.promise
  return cached.conn
}
