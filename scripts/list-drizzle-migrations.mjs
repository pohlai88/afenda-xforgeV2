import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(
  path.join(root, "packages", "database", "package.json")
);
const pg = require("pg");

const env = Object.fromEntries(
  fs
    .readFileSync(path.join(root, "apps", "app", ".env.local"), "utf8")
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*([A-Z0-9_]+)=(.*)$/))
    .filter(Boolean)
    .map(([, key, raw]) => [key, raw.trim().replace(/^["']|["']$/g, "")])
);

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: 1,
});
const client = await pool.connect();
const result = await client.query(
  "select id, hash, created_at from drizzle.__drizzle_migrations order by id"
);
console.log(result.rows);
client.release();
await pool.end();
