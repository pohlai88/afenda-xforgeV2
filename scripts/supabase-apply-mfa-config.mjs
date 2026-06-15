#!/usr/bin/env node

/**
 * Applies MFA TOTP settings from supabase/config.toml via Management API.
 * Usage: pnpm supabase:apply-mfa-config
 */

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const envPath = path.join(root, ".env");
const secretPath = path.join(root, ".env.secret");
const configPath = path.join(root, "supabase", "config.toml");

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

function readBool(section, key) {
  const match = section.match(
    new RegExp(`^\\s*${key}\\s*=\\s*(true|false)`, "m")
  );
  return match?.[1] === "true";
}

function readInt(section, key) {
  const value = section.match(
    new RegExp(`^\\s*${key}\\s*=\\s*(\\d+)`, "m")
  )?.[1];
  return value ? Number(value) : undefined;
}

async function main() {
  const projectRef = parseToken(envPath, "SUPABASE_PROJECT_ID");
  const accessToken = parseToken(secretPath, "SUPABASE_ACCESS_TOKEN");
  const configText = fs.readFileSync(configPath, "utf8");
  const mfaBlock =
    /\[auth\.mfa\]\s*\n([\s\S]*?)(?=\n\[)/m.exec(configText)?.[1] ?? "";
  const totpBlock =
    /\[auth\.mfa\.totp\]\s*\n([\s\S]*?)(?=\n\[)/m.exec(configText)?.[1] ?? "";

  const payload = {
    mfa_max_enrolled_factors: readInt(mfaBlock, "max_enrolled_factors") ?? 10,
    mfa_totp_enroll_enabled: readBool(totpBlock, "enroll_enabled"),
    mfa_totp_verify_enabled: readBool(totpBlock, "verify_enabled"),
  };

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
  console.log("MFA config applied:");
  console.log(
    JSON.stringify(
      {
        mfa_max_enrolled_factors: updated.mfa_max_enrolled_factors,
        mfa_totp_enroll_enabled: updated.mfa_totp_enroll_enabled,
        mfa_totp_verify_enabled: updated.mfa_totp_verify_enabled,
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
