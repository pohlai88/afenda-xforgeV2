#!/usr/bin/env node

/**
 * Health report for Supabase Auth audit logs (MCP gap workaround).
 *
 * Usage:
 *   pnpm supabase:auth-audit
 *   pnpm supabase:auth-audit --json
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
const envPath = path.join(root, ".env");
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

async function fetchManagementAuthConfig(projectRef, accessToken) {
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Management auth config failed (${response.status}): ${await response.text()}`
    );
  }

  return response.json();
}

async function runAuditSql(databaseUrl, query) {
  const client = new pg.Client({ connectionString: databaseUrl });

  await client.connect();

  try {
    return await client.query(query);
  } finally {
    await client.end();
  }
}

async function main() {
  const projectRef = parseToken(envPath, "SUPABASE_PROJECT_ID");
  const accessToken = parseToken(secretPath, "SUPABASE_ACCESS_TOKEN");
  const databaseUrl =
    parseToken(envPath, "DATABASE_URL") ||
    parseToken(secretPath, "DATABASE_URL");

  if (!projectRef) {
    console.error("SUPABASE_PROJECT_ID missing in .env");
    process.exit(1);
  }

  if (!accessToken) {
    console.error(
      "SUPABASE_ACCESS_TOKEN missing in .env.secret — https://supabase.com/dashboard/account/tokens"
    );
    process.exit(1);
  }

  if (!databaseUrl) {
    console.error("DATABASE_URL missing in .env or .env.secret");
    process.exit(1);
  }

  const management = await fetchManagementAuthConfig(projectRef, accessToken);

  const totals = await runAuditSql(
    databaseUrl,
    `SELECT
      COUNT(*)::int AS total_7d,
      COUNT(*) FILTER (
        WHERE NULLIF(TRIM(ip_address), '') IS NOT NULL
      )::int AS with_audit_ip_7d
    FROM auth.audit_log_entries
    WHERE created_at > now() - interval '7 days'`
  );

  const byAction = await runAuditSql(
    databaseUrl,
    `SELECT
      payload->>'action' AS action,
      COUNT(*)::int AS total
    FROM auth.audit_log_entries
    WHERE created_at > now() - interval '7 days'
    GROUP BY 1
    ORDER BY total DESC
    LIMIT 12`
  );

  const sessionIpSample = await runAuditSql(
    databaseUrl,
    `SELECT COUNT(*)::int AS sessions_with_ip_7d
    FROM auth.sessions
    WHERE created_at > now() - interval '7 days'
      AND ip IS NOT NULL`
  );

  const report = {
    projectRef,
    audit: {
      postgresStorageEnabled: !management.audit_log_disable_postgres,
      totalEventsLast7Days: totals.rows[0]?.total_7d ?? 0,
      eventsWithAuditIpLast7Days: totals.rows[0]?.with_audit_ip_7d ?? 0,
      sessionsWithIpLast7Days: sessionIpSample.rows[0]?.sessions_with_ip_7d ?? 0,
      topActionsLast7Days: byAction.rows,
    },
    ipForwarding: {
      sbForwardedForEnabled: Boolean(
        management.security_sb_forwarded_for_enabled
      ),
      note:
        "auth.audit_log_entries.ip_address is often empty on hosted Supabase; join auth.sessions for sign-in IP.",
    },
    recommendations: [],
  };

  if (!report.audit.postgresStorageEnabled) {
    report.recommendations.push(
      "Postgres audit storage is disabled — SQL queries against auth.audit_log_entries will stop receiving new rows."
    );
  }

  if (!report.ipForwarding.sbForwardedForEnabled) {
    report.recommendations.push(
      "Enable sb_forwarded_for_enabled and run pnpm supabase:apply-rate-limits for server-side Auth rate limits behind Vercel."
    );
  }

  if (
    report.audit.totalEventsLast7Days > 0 &&
    report.audit.eventsWithAuditIpLast7Days === 0
  ) {
    report.recommendations.push(
      "Audit rows lack ip_address — use auth.sessions.ip in app UI (AuthAuditLogSection) until GoTrue populates audit IP."
    );
  }

  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log(`Auth audit report — project ${projectRef}\n`);
  console.log(
    `Postgres storage: ${report.audit.postgresStorageEnabled ? "enabled" : "disabled"}`
  );
  console.log(
    `Events (7d): ${report.audit.totalEventsLast7Days} (${report.audit.eventsWithAuditIpLast7Days} with audit IP, ${report.audit.sessionsWithIpLast7Days} sessions with IP)`
  );
  console.log(
    `IP forwarding: ${report.ipForwarding.sbForwardedForEnabled ? "enabled" : "disabled"}`
  );
  console.log("\nTop actions (7d):");
  for (const row of report.audit.topActionsLast7Days) {
    console.log(`  ${row.action ?? "unknown"}: ${row.total}`);
  }

  if (report.recommendations.length > 0) {
    console.log("\nRecommendations:");
    for (const item of report.recommendations) {
      console.log(`  - ${item}`);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
