import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { database } from "@repo/database";
import { sql } from "drizzle-orm";

const migrationsDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../database/drizzle"
);

const migrationFiles = [
  "0007_webhook_outbox.sql",
  "0009_webhook_ops.sql",
  "0010_webhook_endpoint_health.sql",
];

const columnExists = async (
  tableName: string,
  columnName: string
): Promise<boolean> => {
  const result = await database.execute<{ col: string | null }>(
    sql`SELECT column_name AS col
      FROM information_schema.columns
      WHERE table_schema = 'next_forge'
        AND table_name = ${tableName}
        AND column_name = ${columnName}`
  );

  return Boolean(result.rows[0]?.col);
};

export const ensureWebhookOutboxSchema = async (): Promise<void> => {
  const result = await database.execute<{ tbl: string | null }>(
    sql`SELECT to_regclass('next_forge.webhook_endpoints') AS tbl`
  );

  if (!result.rows[0]?.tbl) {
    const migrationSql = readFileSync(
      path.join(migrationsDir, migrationFiles[0]!),
      "utf8"
    );
    await database.execute(sql.raw(migrationSql));
  }

  const hasResponseBody = await columnExists(
    "webhook_deliveries",
    "responseBody"
  );
  const hasSecretPrevious = await columnExists(
    "webhook_endpoints",
    "secretPrevious"
  );

  if (!hasResponseBody || !hasSecretPrevious) {
    const migrationSql = readFileSync(
      path.join(migrationsDir, migrationFiles[1]!),
      "utf8"
    );
    await database.execute(sql.raw(migrationSql));
  }

  const hasRecentFailures = await columnExists(
    "webhook_endpoints",
    "recentFailures"
  );
  const hasDisabledUntil = await columnExists(
    "webhook_endpoints",
    "disabledUntil"
  );
  const hasKind = await columnExists("webhook_endpoints", "kind");

  if (!hasRecentFailures || !hasDisabledUntil || !hasKind) {
    const migrationSql = readFileSync(
      path.join(migrationsDir, migrationFiles[2]!),
      "utf8"
    );
    await database.execute(sql.raw(migrationSql));
  }
};
