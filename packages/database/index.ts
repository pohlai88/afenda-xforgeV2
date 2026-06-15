import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { keys } from "./keys";
import * as schema from "./schema";

const globalForDrizzle = global as unknown as { pool: pg.Pool | undefined };

const pool =
  globalForDrizzle.pool ??
  new pg.Pool({
    connectionString: keys().DATABASE_URL,
    max: process.env.NODE_ENV === "production" ? 10 : 1,
  });

export const database = drizzle(pool, { schema });

if (process.env.NODE_ENV !== "production") {
  globalForDrizzle.pool = pool;
}

export * from "./schema";
