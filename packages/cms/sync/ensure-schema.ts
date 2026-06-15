import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { database } from "@repo/database";
import { sql } from "drizzle-orm";

const migrationPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../database/drizzle/0008_cms_mirror.sql"
);

export const ensureCmsMirrorSchema = async (): Promise<void> => {
  const result = await database.execute<{ tbl: string | null }>(
    sql`SELECT to_regclass('next_forge.cms_documents') AS tbl`
  );

  if (result.rows[0]?.tbl) {
    return;
  }

  const migrationSql = readFileSync(migrationPath, "utf8");
  await database.execute(sql.raw(migrationSql));
};
