import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { defineConfig } from "drizzle-kit";

const configDir = path.dirname(fileURLToPath(import.meta.url));

loadEnv({ path: path.resolve(configDir, "../../.env") });
loadEnv({ path: path.resolve(configDir, "../../.env.local"), override: true });
loadEnv({ path: path.resolve(configDir, ".env"), override: true });

const databaseUrl =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL ??
  "";

export default defineConfig({
  schema: "./schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl.includes("db.") && process.env.DATABASE_URL
      ? process.env.DATABASE_URL
      : databaseUrl,
  },
});
