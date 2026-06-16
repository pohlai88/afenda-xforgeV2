import pg from "pg";
import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dbDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.resolve(dbDir, "../..");
config({ path: path.join(root, ".env") });
config({ path: path.join(root, ".env.local"), override: true });
config({ path: path.join(dbDir, ".env"), override: true });

const url = process.env.DATABASE_URL;
if (!url) {
  process.exit(1);
}

const parsed = new URL(url);
console.log(
  JSON.stringify({
    host: parsed.hostname,
    port: parsed.port || "5432",
    directUrlSet: Boolean(process.env.DIRECT_URL),
    directHost: process.env.DIRECT_URL
      ? (() => {
          try {
            return new URL(process.env.DIRECT_URL).hostname;
          } catch {
            return "invalid";
          }
        })()
      : null,
  })
);
