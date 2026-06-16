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
  console.log("no DATABASE_URL");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: url, max: 1 });

try {
  const count = await pool.query(
    `SELECT COUNT(*)::int AS count FROM drizzle.__drizzle_migrations`
  );
  const org = await pool.query(
    `SELECT to_regclass('next_forge.organizations') AS org,
            to_regclass('next_forge.orbit_cases') AS orbit`
  );

  console.log(
    JSON.stringify({
      migrationCount: count.rows[0]?.count,
      organizations: Boolean(org.rows[0]?.org),
      orbitCases: Boolean(org.rows[0]?.orbit),
      host: new URL(url).hostname,
    })
  );
} finally {
  await pool.end();
}
