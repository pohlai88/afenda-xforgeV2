#!/usr/bin/env node

/**
 * Applies passkey / WebAuthn settings to the linked Supabase project via Management API.
 * MCP has no auth config write tool — use this after editing supabase/config.toml.
 *
 * Usage: pnpm supabase:apply-passkey-config
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

function parseWebauthnFromConfig() {
  const configPath = path.join(root, "supabase", "config.toml");
  const text = fs.readFileSync(configPath, "utf8");

  const rpDisplayName =
    text.match(/^\s*rp_display_name\s*=\s*"([^"]+)"/m)?.[1] ?? "afenda-xforge";
  const rpId =
    text.match(/^\s*rp_id\s*=\s*"([^"]+)"/m)?.[1] ?? "nexuscanon.com";

  const originsBlock = text.match(/^\s*rp_origins\s*=\s*\[([\s\S]*?)\]/m)?.[1];

  const origins = originsBlock
    ? [...originsBlock.matchAll(/"([^"]+)"/g)].map((match) => match[1])
    : ["https://www.nexuscanon.com", "https://nexuscanon.com"];

  const compatibleOrigins = origins.filter((origin) => {
    try {
      const hostname = new URL(origin).hostname;
      return hostname === rpId || hostname.endsWith(`.${rpId}`);
    } catch {
      return false;
    }
  });

  const skipped = origins.filter((item) => !compatibleOrigins.includes(item));
  if (skipped.length > 0) {
    console.warn(
      `Skipping origins incompatible with rp_id "${rpId}" (hosted API rejects loopback with production RP ID):`,
      skipped.join(", ")
    );
  }

  const passkeyEnabled = /^\s*enabled\s*=\s*true/m.test(
    text.split("[auth.passkey]")[1]?.split("[auth.webauthn]")[0] ?? ""
  );

  return {
    passkey_enabled: passkeyEnabled,
    webauthn_rp_display_name: rpDisplayName,
    webauthn_rp_id: rpId,
    webauthn_rp_origins: compatibleOrigins.join(","),
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

  const payload = parseWebauthnFromConfig();

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

  console.log("Passkey configuration applied:");
  console.log(
    JSON.stringify(
      {
        passkey_enabled: updated.passkey_enabled,
        webauthn_rp_id: updated.webauthn_rp_id,
        webauthn_rp_display_name: updated.webauthn_rp_display_name,
        webauthn_rp_origins: updated.webauthn_rp_origins,
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
