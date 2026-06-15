#!/usr/bin/env node

/**
 * Sync security_update_password_require_current_password via Management API.
 * Supabase MCP has no auth-config write tool — this script is the sync path.
 *
 * Usage: node scripts/supabase-sync-require-current-password.mjs [--verify-only]
 */

import fs from "node:fs";
import path from "node:path";
import {
  hostedSection,
  readHostedConfigText,
} from "./supabase-auth-hosted-config.mjs";

const root = path.resolve(import.meta.dirname, "..");
const envPath = path.join(root, ".env");
const secretPath = path.join(root, ".env.secret");
const configPath = path.join(root, "supabase", "config.toml");
const verifyOnly = process.argv.includes("--verify-only");

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

function readDesiredValue() {
  const passwordBlock = hostedSection(
    readHostedConfigText(),
    "[auth_hosted.password]"
  );
  const match = passwordBlock.match(
    /^\s*require_current_password_on_change\s*=\s*(true|false)/m
  );
  return match?.[1] === "true";
}

async function fetchAuthConfig(projectRef, accessToken) {
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    throw new Error(
      `GET config/auth failed (${response.status}): ${await response.text()}`
    );
  }

  return response.json();
}

async function patchAuthConfig(projectRef, accessToken, body) {
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error(
      `PATCH config/auth failed (${response.status}): ${await response.text()}`
    );
  }

  return response.json();
}

function summarize(config) {
  return {
    security_update_password_require_current_password:
      config.security_update_password_require_current_password,
    security_update_password_require_reauthentication:
      config.security_update_password_require_reauthentication,
    password_hibp_enabled: config.password_hibp_enabled,
  };
}

async function main() {
  const projectRef = parseToken(envPath, "SUPABASE_PROJECT_ID");
  const accessToken = parseToken(secretPath, "SUPABASE_ACCESS_TOKEN");
  const desired = readDesiredValue();

  if (!(projectRef && accessToken)) {
    console.error("Missing SUPABASE_PROJECT_ID or SUPABASE_ACCESS_TOKEN");
    process.exit(1);
  }

  console.log("Project:", projectRef);
  console.log("Desired require_current_password_on_change:", desired);

  const before = await fetchAuthConfig(projectRef, accessToken);
  console.log("Before:", JSON.stringify(summarize(before), null, 2));

  if (verifyOnly) {
    process.exit(
      before.security_update_password_require_current_password === desired
        ? 0
        : 1
    );
  }

  if (before.security_update_password_require_current_password === desired) {
    console.log("Already in sync.");
    return;
  }

  // Patch only the target field first (minimal diff).
  let after = await patchAuthConfig(projectRef, accessToken, {
    security_update_password_require_current_password: desired,
  });

  if (after.security_update_password_require_current_password !== desired) {
    console.warn(
      "Isolated PATCH did not stick — retrying with reauthentication flag bundled."
    );
    after = await patchAuthConfig(projectRef, accessToken, {
      security_update_password_require_reauthentication: true,
      security_update_password_require_current_password: desired,
    });
  }

  console.log(
    "After PATCH response:",
    JSON.stringify(summarize(after), null, 2)
  );

  const confirmed = await fetchAuthConfig(projectRef, accessToken);
  console.log(
    "After GET verify:",
    JSON.stringify(summarize(confirmed), null, 2)
  );

  if (confirmed.security_update_password_require_current_password !== desired) {
    console.error(
      "Remote still does not match config.toml — Dashboard toggle may be required."
    );
    process.exit(1);
  }

  console.log("Synced successfully.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
