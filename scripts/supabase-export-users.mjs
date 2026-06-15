#!/usr/bin/env node

/**
 * Export Supabase Auth users to CSV via Admin API (Management alternative to SQL Editor).
 *
 * Usage:
 *   pnpm supabase:export-users
 *   pnpm supabase:export-users --json
 *
 * Requires SUPABASE_SECRET_KEY (or legacy service role) in .env.secret / .env.local.
 */

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
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

const escapeCsv = (value) => `"${String(value).replaceAll('"', '""')}"`;

async function listAllUsers(url, secretKey) {
  const users = [];
  let page = 1;

  while (true) {
    const response = await fetch(
      `${url}/auth/v1/admin/users?page=${page}&per_page=200`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          apikey: secretKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Admin list users failed (${response.status}): ${await response.text()}`
      );
    }

    const body = await response.json();
    const batch = body.users ?? [];
    users.push(...batch);

    if (batch.length < 200) {
      break;
    }

    page += 1;
  }

  return users;
}

function toCsv(users) {
  const header = [
    "id",
    "email",
    "display_name",
    "created_at",
    "last_sign_in_at",
    "email_confirmed",
  ];

  const rows = users.map((user) =>
    [
      user.id,
      user.email ?? "",
      user.user_metadata?.name ?? "",
      user.created_at ?? "",
      user.last_sign_in_at ?? "",
      user.email_confirmed_at ? "true" : "false",
    ]
      .map(escapeCsv)
      .join(",")
  );

  return [header.join(","), ...rows].join("\n");
}

async function main() {
  const url =
    parseToken(path.join(root, ".env"), "NEXT_PUBLIC_SUPABASE_URL") ||
    parseToken(path.join(root, ".env.local"), "NEXT_PUBLIC_SUPABASE_URL");
  const secretKey =
    parseToken(path.join(root, ".env.secret"), "SUPABASE_SECRET_KEY") ||
    parseToken(path.join(root, ".env.secret"), "SUPABASE_SERVICE_ROLE_KEY") ||
    parseToken(path.join(root, ".env.local"), "SUPABASE_SECRET_KEY") ||
    parseToken(path.join(root, ".env.local"), "SUPABASE_SERVICE_ROLE_KEY");

  if (!(url && secretKey)) {
    console.error(
      "Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY (or service role key)."
    );
    process.exit(1);
  }

  const users = await listAllUsers(url, secretKey);

  if (jsonOutput) {
    console.log(JSON.stringify(users, null, 2));
    return;
  }

  console.log(toCsv(users));
  console.error(`Exported ${users.length} user(s).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
