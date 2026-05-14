import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

const url = process.env.DATABASE_URL ?? "file:./local.db";
const authToken = process.env.DATABASE_AUTH_TOKEN;

const client = createClient({ url, authToken });
const db = drizzle(client);

console.log(`Migrating database at ${url}`);
await migrate(db, { migrationsFolder: "./drizzle" });
console.log("Done.");
client.close();
