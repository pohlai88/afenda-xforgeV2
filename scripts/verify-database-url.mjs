import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "packages", "database", "package.json")
);
const pg = require("pg");

const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "apps", "app", ".env.local");
const env = Object.fromEntries(
  fs
    .readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*([A-Z0-9_]+)=(.*)$/))
    .filter(Boolean)
    .map(([, key, raw]) => [key, raw.trim().replace(/^["']|["']$/g, "")])
);

const pool = new pg.Pool({ connectionString: env.DATABASE_URL, max: 1 });
const client = await pool.connect();
const result = await client.query("select count(*)::int as pages from next_forge.pages");
console.log("DB OK", result.rows[0]);
client.release();
await pool.end();
