import pg from "pg";
import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
config({ path: path.join(root, ".env") });
config({ path: path.join(root, ".env.local"), override: true });
config({ path: path.join(root, "packages/database/.env"), override: true });

const listOrbitTables = async (label, url) => {
  if (!url) {
    console.log(`${label}: no url`);
    return;
  }

  const pool = new pg.Pool({ connectionString: url, max: 1 });

  try {
    const orbit = await pool.query(
      `SELECT table_schema, table_name FROM information_schema.tables
       WHERE table_name LIKE 'orbit%'
       ORDER BY table_schema, table_name`
    );
    const migration = await pool.query(
      `SELECT id, hash, created_at FROM drizzle.__drizzle_migrations ORDER BY created_at DESC LIMIT 5`
    ).catch(() => ({ rows: [] }));

    const names =
      orbit.rows.map((row) => `${row.table_schema}.${row.table_name}`).join(", ") ||
      "(none)";
    console.log(`${label} orbit: ${names}`);
    console.log(
      `${label} migrations:`,
      migration.rows.map((row) => row.id ?? row.hash).join(", ") || "(none)"
    );
  } catch (error) {
    const code = error instanceof Error && "code" in error ? error.code : "unknown";
    console.log(`${label}: error ${code}`);
  } finally {
    await pool.end();
  }
};

await listOrbitTables("DATABASE_URL", process.env.DATABASE_URL);
await listOrbitTables("DIRECT_URL", process.env.DIRECT_URL);
