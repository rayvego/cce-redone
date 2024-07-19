import mongoose, { Mongoose } from "mongoose";
// mongoose is the main mongoose library to connect to the db
// Mongoose is the TypeScript type of the mongoose library that helps us define the type of the mongoose object

const MONGODB_URI = process.env.MONGODB_URI as string;
// specifically telling TypeScript that MONGODB_URI is a string

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

// this defines the type of the cached object
interface Cached {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// this tells TypeScript that we are adding a new property to the global object
// this doesn't mean we can access the global object from anywhere in the code
// it just means that this variables hold its value across hot reloads
declare global {
  var mongoose: Cached;
}

// setting the cached object to the mongoose property of the global object
let cached: Cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) {
    console.log("Using existing database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongoose) => {
        console.log("New database connection established");
        return mongoose;
      })
      .catch((error) => {
        console.error("Database connection error:", error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection failed");
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;