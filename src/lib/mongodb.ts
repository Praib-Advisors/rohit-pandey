import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

const DEFAULT_MONGODB_URI = "mongodb+srv://user_1:j8t0fxYoBq5hklEY@backend.ycwkczw.mongodb.net/rohit_pandey_db?retryWrites=true&w=majority";

export function isMongoConfigured(): boolean {
  return true;
}

export function getMongoUri(): string {
  return (process.env.MONGODB_URI && process.env.MONGODB_URI.trim().length > 0)
    ? process.env.MONGODB_URI.trim()
    : DEFAULT_MONGODB_URI;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  const uri = getMongoUri();

  if (!uri) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local or your hosting dashboard."
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 18,
      serverSelectionTimeoutMS: 10000,
      dbName: process.env.MONGODB_DB_NAME || "rohit_pandey_db",
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
