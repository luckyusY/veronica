import { MongoClient, type MongoClientOptions } from "mongodb";
import { env } from "@/lib/env";

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

const clientOptions: MongoClientOptions = {
  connectTimeoutMS: 10_000,
  serverSelectionTimeoutMS: 10_000,
  socketTimeoutMS: 45_000,
  retryWrites: true,
  retryReads: true,
  maxPoolSize: 10,
  minPoolSize: 1,
};

const mongoClientPromise =
  global.mongoClientPromise ??
  new MongoClient(env.MONGODB_URI, clientOptions).connect();

if (process.env.NODE_ENV === "development") {
  global.mongoClientPromise = mongoClientPromise;
}

export async function getDatabase() {
  const connectedClient = await mongoClientPromise;

  return connectedClient.db(env.MONGODB_DB_NAME);
}

export async function pingDatabase() {
  try {
    const database = await getDatabase();
    await database.command({ ping: 1 });
    return { ok: true as const };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown database error";
    return { ok: false as const, error: message };
  }
}
