import mongoose from "mongoose";

// Reuse a single Mongoose connection across hot reloads / serverless
// invocations to avoid exhausting the connection pool.
const MONGODB_URI = process.env.MONGODB_URI || "";
const MONGODB_DB = process.env.MONGODB_DB || "aero_weather";

export const isMongoConfigured = Boolean(MONGODB_URI);

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalForMongoose = globalThis as unknown as {
  _aeroMongoose?: Cached;
};

const cached: Cached = globalForMongoose._aeroMongoose ?? {
  conn: null,
  promise: null,
};

if (!globalForMongoose._aeroMongoose) {
  globalForMongoose._aeroMongoose = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!isMongoConfigured) {
    throw new Error("MONGODB_URI is not configured");
  }
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: MONGODB_DB,
        bufferCommands: false,
      })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.conn;
}
