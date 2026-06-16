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

const args = new Set(process.argv.slice(2));
const checkOnly = args.has("--check");
const dryRun = args.has("--dry-run");

const resolveDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  return process.env.DIRECT_URL ?? "";
};

/** Schema probes for migrations that introduce distinctive objects (newest first). */
const MIGRATION_PROBES = {
  "0026_orbit_case_attachments": `
    SELECT to_regclass('next_forge.orbit_case_attachments') IS NOT NULL AS ok`,
  "0025_orbit_push_seed_and_claims": `
    SELECT EXISTS (
      SELECT 1
      FROM pg_proc
      WHERE pronamespace = 'next_forge'::regnamespace
        AND proname = 'orbit_push_capabilities_for_role'
    ) AS ok`,
  "0024_orbit_case_push": `
    SELECT to_regclass('next_forge.orbit_push_events') IS NOT NULL AS ok`,
  "0023_orbit_case_core": `
    SELECT to_regclass('next_forge.orbit_cases') IS NOT NULL AS ok`,
  "0022_org_invite_bootstrap": `
    SELECT EXISTS (
      SELECT 1
      FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
      WHERE n.nspname = 'next_forge'
        AND p.proname = 'bootstrap_new_user'
    ) AS ok`,
  "0007_webhook_outbox": `
    SELECT to_regclass('next_forge.webhook_outbox') IS NOT NULL AS ok`,
  "0000_next_forge_baseline": `
    SELECT to_regclass('next_forge.organizations') IS NOT NULL AS ok`,
};

const SHA256_HEX = /^[a-f0-9]{64}$/;

const loadJournalEntries = () => {
  const journal = JSON.parse(
    fs.readFileSync(path.join(dbDir, "drizzle/meta/_journal.json"), "utf8")
  );

  return journal.entries.map((entry) => {
    const sql = fs.readFileSync(
      path.join(dbDir, "drizzle", `${entry.tag}.sql`),
      "utf8"
    );

    return {
      idx: entry.idx,
      tag: entry.tag,
      when: entry.when,
      hash: crypto.createHash("sha256").update(sql).digest("hex"),
    };
  });
};

const readDbMigrations = async (pool) => {
  const result = await pool.query(
    `SELECT id, hash, created_at
     FROM drizzle.__drizzle_migrations
     ORDER BY created_at ASC, id ASC`
  );

  return result.rows.map((row) => ({
    id: row.id,
    hash: row.hash,
    createdAt: Number(row.created_at),
  }));
};

const probeAppliedThroughIndex = async (pool, entries) => {
  for (let index = entries.length - 1; index >= 0; index -= 1) {
    const entry = entries[index];
    const probe = MIGRATION_PROBES[entry.tag];
    if (!probe) {
      continue;
    }

    const result = await pool.query(probe);
    if (result.rows[0]?.ok) {
      return entry.idx;
    }
  }

  const baseline = MIGRATION_PROBES["0000_next_forge_baseline"];
  const result = await pool.query(baseline);
  return result.rows[0]?.ok ? 0 : -1;
};

const buildExpectedRows = (entries, appliedThrough) =>
  entries
    .filter((entry) => entry.idx <= appliedThrough)
    .map((entry) => ({
      hash: entry.hash,
      createdAt: entry.when,
      tag: entry.tag,
    }));

const detectDrift = (entries, dbRows, expectedRows) => {
  const reasons = [];
  const journalMaxWhen = entries.at(-1)?.when ?? 0;
  const lastDb = dbRows.at(-1);

  if (lastDb && lastDb.createdAt > journalMaxWhen) {
    reasons.push(
      `last migration created_at (${lastDb.createdAt}) is after journal max when (${journalMaxWhen})`
    );
  }

  for (const row of dbRows) {
    if (!SHA256_HEX.test(row.hash)) {
      reasons.push(`invalid migration hash "${row.hash}" (expected sha256 hex)`);
      break;
    }
  }

  if (dbRows.length !== expectedRows.length) {
    reasons.push(
      `row count mismatch (db=${dbRows.length}, expected=${expectedRows.length})`
    );
  }

  const expectedByCreatedAt = new Map(
    expectedRows.map((row) => [row.createdAt, row.hash])
  );

  for (const row of dbRows) {
    const expectedHash = expectedByCreatedAt.get(row.createdAt);
    if (expectedHash && expectedHash !== row.hash) {
      reasons.push(`hash mismatch for created_at=${row.createdAt}`);
      break;
    }
  }

  return reasons;
};

const repairJournal = async () => {
  const url = resolveDatabaseUrl();
  if (!url) {
    throw new Error("DATABASE_URL or DIRECT_URL is required");
  }

  const entries = loadJournalEntries();
  const pool = new pg.Pool({ connectionString: url, max: 1 });

  try {
    const appliedThrough = await probeAppliedThroughIndex(pool, entries);
    if (appliedThrough < 0) {
      console.log("repair: no applied migrations detected — leaving journal untouched");
      return { repaired: false, appliedThrough };
    }

    const expectedRows = buildExpectedRows(entries, appliedThrough);
    const dbRows = await readDbMigrations(pool);
    const drift = detectDrift(entries, dbRows, expectedRows);

    if (drift.length === 0) {
      console.log(
        `repair: journal in sync (${expectedRows.length} migrations through ${expectedRows.at(-1)?.tag})`
      );
      return { repaired: false, appliedThrough };
    }

    console.log("repair: drift detected:");
    for (const reason of drift) {
      console.log(`  - ${reason}`);
    }

    if (checkOnly) {
      console.error("repair: journal drift — run pnpm --filter @repo/database db:repair-journal");
      process.exitCode = 1;
      return { repaired: false, appliedThrough, drift };
    }

    if (dryRun) {
      console.log(
        `repair: dry-run would rewrite ${expectedRows.length} rows through ${expectedRows.at(-1)?.tag}`
      );
      return { repaired: false, appliedThrough, drift, dryRun: true };
    }

    await pool.query("BEGIN");
    try {
      await pool.query("DELETE FROM drizzle.__drizzle_migrations");

      for (const row of expectedRows) {
        await pool.query(
          `INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)`,
          [row.hash, row.createdAt]
        );
      }

      await pool.query("COMMIT");
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }

    console.log(
      `repair: rewrote ${expectedRows.length} rows through ${expectedRows.at(-1)?.tag}`
    );
    return { repaired: true, appliedThrough };
  } finally {
    await pool.end();
  }
};

await repairJournal();
