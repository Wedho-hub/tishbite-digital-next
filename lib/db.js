import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not set");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongooseInstance) => mongooseInstance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}
