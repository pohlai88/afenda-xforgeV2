import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import pg from "pg";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";

const dbDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.resolve(dbDir, "../..");
config({ path: path.join(root, ".env") });
config({ path: path.join(root, ".env.local"), override: true });
config({ path: path.join(dbDir, ".env"), override: true });

const journal = JSON.parse(
  fs.readFileSync(path.join(dbDir, "drizzle/meta/_journal.json"), "utf8")
);

const hashFile = (tag) => {
  const sql = fs.readFileSync(
    path.join(dbDir, "drizzle", `${tag}.sql`),
    "utf8"
  );
  return crypto.createHash("sha256").update(sql).digest("hex");
};

const url = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString: url, max: 1 });

try {
  const dbRows = await pool.query(
    `SELECT id, hash, created_at FROM drizzle.__drizzle_migrations ORDER BY id`
  );
  const dbHashes = new Set(dbRows.rows.map((row) => row.hash));

  console.log("DB migration rows:");
  for (const row of dbRows.rows) {
    console.log(`  id=${row.id} hash=${row.hash.slice(0, 16)}...`);
  }

  console.log("\nJournal vs DB:");
  for (const entry of journal.entries) {
    const hash = hashFile(entry.tag);
    const inDb = dbHashes.has(hash);
    console.log(
      `${inDb ? "✓" : "✗"} idx=${entry.idx} ${entry.tag} hash=${hash.slice(0, 16)}...`
    );
  }
} finally {
  await pool.end();
}
