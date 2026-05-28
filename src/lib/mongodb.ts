import mongoose, { type ConnectOptions, type Mongoose } from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI environment variable")
}

interface MongooseCache {
  conn: Mongoose | null
  promise: Promise<Mongoose> | null
}

// Reuse the same cache object across hot reloads in development.
const globalWithMongoose = globalThis as typeof globalThis & {
  mongoose: MongooseCache | undefined
}

const cached = globalWithMongoose.mongoose ?? { conn: null, promise: null }

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = cached
}

export async function connectToDatabase(): Promise<Mongoose> {
  // Return the existing connection if one is already established.
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const options: ConnectOptions = {
      bufferCommands: false,
    }

    // Create the connection promise once and share it between concurrent calls.
    cached.promise = mongoose.connect(MONGODB_URI!, options)
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    // Reset the promise so a future call can retry the connection.
    cached.promise = null
    throw error
  }

  return cached.conn
}
