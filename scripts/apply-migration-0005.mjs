import { createHash } from "node:crypto";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(
  path.join(root, "packages", "database", "package.json")
);
const pg = require("pg");

const loadEnv = (filePath) =>
  Object.fromEntries(
    fs
      .readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.match(/^\s*([A-Z0-9_]+)=(.*)$/))
      .filter(Boolean)
      .map(([, key, raw]) => [key, raw.trim().replace(/^["']|["']$/g, "")])
  );

const env = loadEnv(path.join(root, "apps", "app", ".env.local"));
const sqlPath = path.join(
  root,
  "packages",
  "database",
  "drizzle",
  "0005_bootstrap_on_email_confirmed.sql"
);
const migrationSql = fs.readFileSync(sqlPath, "utf8");

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: 1,
});
const client = await pool.connect();

const migrationHash = createHash("sha256").update(migrationSql).digest("hex");

try {
  const existing = await client.query(
    "select hash from drizzle.__drizzle_migrations where hash = $1",
    [migrationHash]
  );

  if (existing.rows.length > 0) {
    console.log("Migration 0005 already applied");
  } else {
    await client.query("BEGIN");
    await client.query(migrationSql);
    await client.query(
      `INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
       VALUES ($1, $2)`,
      [migrationHash, String(Date.now())]
    );
    await client.query("COMMIT");
    console.log("Applied migration 0005_bootstrap_on_email_confirmed");
  }

  const triggers = await client.query(`
    SELECT tgname
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'auth' AND c.relname = 'users'
      AND NOT t.tgisinternal
    ORDER BY tgname
  `);
  console.log(
    "auth.users triggers:",
    triggers.rows.map((row) => row.tgname)
  );
} catch (error) {
  await client.query("ROLLBACK");
  console.error(error);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
