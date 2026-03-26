import { MongoClient } from "mongodb";
import { env } from "@/lib/env";

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

const mongoClientPromise =
  global.mongoClientPromise ?? new MongoClient(env.MONGODB_URI).connect();

if (process.env.NODE_ENV === "development") {
  global.mongoClientPromise = mongoClientPromise;
}

export async function getDatabase() {
  const connectedClient = await mongoClientPromise;

  return connectedClient.db(env.MONGODB_DB_NAME);
}

export async function pingDatabase() {
  const database = await getDatabase();

  await database.command({ ping: 1 });
}
