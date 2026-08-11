// lib/mongodb.ts
import mongoose from 'mongoose';

export default dbConnect;

async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  await mongoose.connect(MONGODB_URI);
  return mongoose;
}