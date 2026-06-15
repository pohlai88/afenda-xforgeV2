#!/usr/bin/env node

/**
 * Column-level privilege audit for PostgREST-exposed roles.
 *
 * Usage:
 *   pnpm supabase:column-privileges-audit
 *   pnpm supabase:column-privileges-audit --json
 */

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(
  path.join(root, "packages", "database", "package.json")
);
const pg = require("pg");

const jsonOutput = process.argv.includes("--json");

function parseToken(filePath, key) {
  if (!fs.existsSync(filePath)) {
    return "";
  }

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(
      new RegExp(`^\\s*(?:export\\s+)?${key}\\s*=(.*)$`)
    );
    if (match) {
      return match[1].trim().replace(/^["']|["']$/g, "");
    }
  }

  return "";
}

function readEnvValue(key) {
  return (
    parseToken(path.join(root, ".env.config"), key) ||
    parseToken(path.join(root, ".env"), key) ||
    parseToken(path.join(root, ".env.secret"), key) ||
    parseToken(path.join(root, ".env.local"), key) ||
    parseToken(path.join(root, "apps", "app", ".env.local"), key)
  );
}

const SENSITIVE_MUTATION_COLUMNS = {
  "next_forge.webhook_endpoints": ["secret", "secretPrevious", "secretPreviousExpiresAt"],
  "public.profiles": ["email", "id", "created_at", "updated_at"],
  "next_forge.organization_members": ["role", "organizationId", "userId"],
};

async function main() {
  const databaseUrl = readEnvValue("DATABASE_URL");

  if (!databaseUrl) {
    console.error("DATABASE_URL missing");
    process.exit(1);
  }

  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    const privileges = await client.query(`
      SELECT
        table_schema,
        table_name,
        grantee,
        privilege_type,
        column_name
      FROM information_schema.column_privileges
      WHERE table_schema IN ('public', 'next_forge')
        AND grantee IN ('authenticated', 'anon')
      ORDER BY 1, 2, 3, 4, 5
    `);

    const tableLevel = await client.query(`
      SELECT
        table_schema,
        table_name,
        grantee,
        privilege_type
      FROM information_schema.table_privileges
      WHERE table_schema IN ('public', 'next_forge')
        AND grantee IN ('authenticated', 'anon')
      ORDER BY 1, 2, 3, 4
    `);

    const recommendations = [];

    for (const [table, columns] of Object.entries(SENSITIVE_MUTATION_COLUMNS)) {
      const [schema, name] = table.split(".");
      for (const column of columns) {
        const exposed = privileges.rows.filter(
          (row) =>
            row.table_schema === schema &&
            row.table_name === name &&
            row.grantee === "authenticated" &&
            row.column_name === column &&
            ["UPDATE", "INSERT"].includes(row.privilege_type)
        );

        if (exposed.length > 0) {
          recommendations.push(
            `authenticated can ${exposed.map((e) => e.privilege_type).join("/")} ${table}.${column} — restrict column privileges.`
          );
        }
      }
    }

    const webhookSelect = privileges.rows.filter(
      (row) =>
        row.table_name === "webhook_endpoints" &&
        row.grantee === "authenticated" &&
        row.privilege_type === "SELECT"
    );

    if (webhookSelect.length > 0) {
      recommendations.push(
        "authenticated has SELECT on webhook_endpoints — revoke or exclude secret columns."
      );
    }

    const profileMutations = tableLevel.rows.filter(
      (row) =>
        row.table_schema === "public" &&
        row.table_name === "profiles" &&
        row.grantee === "authenticated" &&
        ["INSERT", "DELETE"].includes(row.privilege_type)
    );

    for (const row of profileMutations) {
      recommendations.push(
        `Revoke ${row.privilege_type} on public.profiles from authenticated (trigger-owned rows).`
      );
    }

    const orgMemberWrite = tableLevel.rows.filter(
      (row) =>
        row.table_schema === "next_forge" &&
        row.table_name === "organization_members" &&
        row.grantee === "authenticated" &&
        ["INSERT", "UPDATE", "DELETE"].includes(row.privilege_type)
    );

    for (const row of orgMemberWrite) {
      recommendations.push(
        `Revoke ${row.privilege_type} on organization_members from authenticated (Drizzle-only mutations).`
      );
    }

    const report = {
      authenticatedColumnPrivileges: privileges.rows.filter(
        (row) => row.grantee === "authenticated"
      ),
      authenticatedTablePrivileges: tableLevel.rows.filter(
        (row) => row.grantee === "authenticated"
      ),
      recommendations,
    };

    if (jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
      return;
    }

    console.log("Column privilege audit — authenticated + anon\n");
    console.log(
      `Column grants (authenticated): ${report.authenticatedColumnPrivileges.length}`
    );
    console.log(
      `Table grants (authenticated): ${report.authenticatedTablePrivileges.length}`
    );

    if (recommendations.length > 0) {
      console.log("\nRecommendations:");
      for (const item of recommendations) {
        console.log(`  - ${item}`);
      }
    } else {
      console.log("\nNo column privilege recommendations.");
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
