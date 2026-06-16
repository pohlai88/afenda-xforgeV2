import pg from "pg";
import fs from "node:fs";
import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dbDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.resolve(dbDir, "../..");
config({ path: path.join(root, ".env") });
config({ path: path.join(root, ".env.local"), override: true });
config({ path: path.join(dbDir, ".env"), override: true });

const journal = JSON.parse(
  fs.readFileSync(path.join(dbDir, "drizzle/meta/_journal.json"), "utf8")
);
const tags = journal.entries.map((entry) => entry.tag);

const url = process.env.DATABASE_URL ?? process.env.DIRECT_URL;

const pool = new pg.Pool({ connectionString: url, max: 1 });

try {
  const rows = await pool.query(
    `SELECT id, hash, created_at FROM drizzle.__drizzle_migrations ORDER BY id`
  );
  console.log("drizzle_url_host:", url ? new URL(url).hostname : "none");
  console.log("db_rows:", rows.rows.length);
  console.log("journal_tags:", tags.length, tags.slice(-5).join(", "));
  console.log("last_db_ids:", rows.rows.map((row) => row.id).join(", "));
} finally {
  await pool.end();
}
