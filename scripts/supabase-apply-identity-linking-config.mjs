#!/usr/bin/env node

/**
 * Enables manual identity linking on the hosted Supabase project via Management API.
 * MCP has no auth config write tool — use after editing supabase/config.toml.
 *
 * Usage: pnpm supabase:apply-identity-linking-config
 */

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const envPath = path.join(root, ".env");
const secretPath = path.join(root, ".env.secret");

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

function parseManualLinkingFromConfig() {
  const configPath = path.join(root, "supabase", "config.toml");
  const text = fs.readFileSync(configPath, "utf8");
  const authSection =
    text.split("[auth]")[1]?.split("[auth.sessions]")[0] ?? "";
  const enabled = /^\s*enable_manual_linking\s*=\s*true/m.test(authSection);

  return {
    security_manual_linking_enabled: enabled,
  };
}

async function main() {
  const projectRef = parseToken(envPath, "SUPABASE_PROJECT_ID");
  const accessToken = parseToken(secretPath, "SUPABASE_ACCESS_TOKEN");

  if (!projectRef) {
    console.error("SUPABASE_PROJECT_ID missing in .env");
    process.exit(1);
  }

  if (!accessToken) {
    console.error(
      "SUPABASE_ACCESS_TOKEN missing in .env.secret — create one at https://supabase.com/dashboard/account/tokens"
    );
    process.exit(1);
  }

  const payload = parseManualLinkingFromConfig();

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    console.error(
      `Management API PATCH failed (${response.status}): ${await response.text()}`
    );
    process.exit(1);
  }

  const updated = await response.json();

  console.log("Identity linking configuration applied:");
  console.log(
    JSON.stringify(
      {
        security_manual_linking_enabled:
          updated.security_manual_linking_enabled,
        mailer_autoconfirm: updated.mailer_autoconfirm,
        mailer_allow_unverified_email_sign_ins:
          updated.mailer_allow_unverified_email_sign_ins,
        external_google_enabled: updated.external_google_enabled,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
