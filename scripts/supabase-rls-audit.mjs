#!/usr/bin/env node

/**
 * Row Level Security health report for exposed schemas (public, next_forge).
 *
 * Usage:
 *   pnpm supabase:rls-audit
 *   pnpm supabase:rls-audit --json
 */

import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(
  path.join(root, "packages", "database", "package.json")
);
const pg = require("pg");

const envPath = path.join(root, ".env");
const configPath = path.join(root, ".env.config");
const secretPath = path.join(root, ".env.secret");
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
    parseToken(configPath, key) ||
    parseToken(envPath, key) ||
    parseToken(secretPath, key) ||
    parseToken(path.join(root, ".env.local"), key) ||
    parseToken(path.join(root, "apps", "app", ".env.local"), key)
  );
}

async function main() {
  const databaseUrl = readEnvValue("DATABASE_URL");

  if (!databaseUrl) {
    console.error("DATABASE_URL missing");
    process.exit(1);
  }

  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    const tables = await client.query(`
      SELECT
        n.nspname AS schema_name,
        c.relname AS table_name,
        c.relrowsecurity AS rls_enabled,
        COUNT(p.policyname)::int AS policy_count
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      LEFT JOIN pg_policies p
        ON p.schemaname = n.nspname
        AND p.tablename = c.relname
      WHERE c.relkind = 'r'
        AND n.nspname IN ('public', 'next_forge')
      GROUP BY 1, 2, 3
      ORDER BY 1, 2
    `);

    const permissive = await client.query(`
      SELECT schemaname, tablename, policyname, qual
      FROM pg_policies
      WHERE schemaname IN ('public', 'next_forge')
        AND qual = 'true'
      ORDER BY 1, 2
    `);

    const rpcExposure = await client.query(`
      SELECT routine_name, grantee
      FROM information_schema.routine_privileges
      WHERE routine_schema = 'public'
        AND routine_name IN (
          'sync_profile_from_auth_user',
          'hook_mfa_verification_attempt',
          'hook_password_verification_attempt',
          'hook_custom_access_token'
        )
        AND grantee IN ('PUBLIC', 'anon', 'authenticated')
      ORDER BY 1, 2
    `);

    const autoEnable = await client.query(`
      SELECT evtname
      FROM pg_event_trigger
      WHERE evtname = 'ensure_rls'
    `);

    const clientGrants = await client.query(`
      SELECT table_schema, table_name, grantee, privilege_type
      FROM information_schema.table_privileges
      WHERE table_schema IN ('public', 'next_forge')
        AND grantee IN ('anon', 'authenticated')
      ORDER BY 1, 2, 3, 4
    `);

    const orgHelpers = await client.query(`
      SELECT p.proname
      FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
      WHERE n.nspname = 'next_forge'
        AND p.proname IN (
          'request_organization_id',
          'is_organization_member',
          'is_organization_owner'
        )
    `);

    const noPolicy = tables.rows.filter(
      (row) => row.rls_enabled && row.policy_count === 0
    );

    const rlsDisabled = tables.rows.filter((row) => !row.rls_enabled);

    const recommendations = [];

    if (rlsDisabled.length > 0) {
      recommendations.push(
        `Enable RLS on ${rlsDisabled.length} table(s): ${rlsDisabled.map((r) => `${r.schema_name}.${r.table_name}`).join(", ")}`
      );
    }

    for (const row of permissive.rows) {
      recommendations.push(
        `Review permissive policy ${row.schemaname}.${row.policyname} (USING true).`
      );
    }

    for (const row of rpcExposure.rows) {
      recommendations.push(
        `Revoke EXECUTE on ${row.routine_name} from ${row.grantee}.`
      );
    }

    if (autoEnable.rows.length === 0) {
      recommendations.push(
        "Install rls_auto_enable event trigger (migration 0017_rls_hardening)."
      );
    }

    const anonTableGrants = clientGrants.rows.filter(
      (row) => row.grantee === "anon"
    );
    if (anonTableGrants.length > 0) {
      recommendations.push(
        `Revoke anon table grants (${anonTableGrants.length}) — RLS default model uses authenticated + explicit grants only.`
      );
    }

    if (orgHelpers.rows.length < 3) {
      recommendations.push(
        "Install next_forge org RLS helpers (migration 0020_rls_default_grant_model)."
      );
    }

    for (const row of noPolicy) {
      const fullName = `${row.schema_name}.${row.table_name}`;
      const intentionalDeny = [
        "public.mfa_failed_verification_attempts",
        "public.password_failed_verification_attempts",
        "next_forge.cms_documents",
        "next_forge.cms_document_revisions",
        "next_forge.pages",
      ].includes(fullName);

      if (intentionalDeny) {
        continue;
      }

      recommendations.push(
        `Table ${fullName} has RLS but no policies — verify intentional deny-by-default.`
      );
    }

    const report = {
      exposedSchemas: ["public", "next_forge"],
      tables: tables.rows,
      permissivePolicies: permissive.rows,
      exposedHookRpc: rpcExposure.rows,
      rlsAutoEnableTrigger: autoEnable.rows.length > 0,
      authenticatedAndAnonGrants: clientGrants.rows,
      orgRlsHelpersInstalled: orgHelpers.rows.map((row) => row.proname),
      hookTablesWithoutPolicies: noPolicy
        .filter((row) =>
          [
            "mfa_failed_verification_attempts",
            "password_failed_verification_attempts",
          ].includes(row.table_name)
        )
        .map((row) => `${row.schema_name}.${row.table_name}`),
      recommendations,
    };

    if (jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
      return;
    }

    console.log("RLS audit — public + next_forge\n");
    console.log(
      `Tables: ${tables.rows.length} (${tables.rows.filter((r) => r.rls_enabled).length} with RLS)`
    );
    console.log(
      `Auto-enable trigger: ${report.rlsAutoEnableTrigger ? "installed" : "missing"}`
    );
    console.log(`Permissive (USING true) policies: ${permissive.rows.length}`);
    console.log(`Exposed hook/trigger RPC grants: ${rpcExposure.rows.length}`);
    console.log(
      `PostgREST table grants (authenticated/anon): ${clientGrants.rows.length}`
    );
    console.log(
      `Org RLS helpers: ${report.orgRlsHelpersInstalled.join(", ") || "missing"}`
    );

    if (report.hookTablesWithoutPolicies.length > 0) {
      console.log(
        `\nHook tables (RLS, no policies — expected): ${report.hookTablesWithoutPolicies.join(", ")}`
      );
    }

    if (recommendations.length > 0) {
      console.log("\nRecommendations:");
      for (const item of recommendations) {
        console.log(`  - ${item}`);
      }
    } else {
      console.log("\nNo RLS recommendations.");
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
