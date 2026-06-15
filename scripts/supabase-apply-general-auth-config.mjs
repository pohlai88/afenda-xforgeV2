#!/usr/bin/env node

/**
 * Applies Supabase Auth *general* settings to the hosted project via Management API.
 * Covers: sign-up, confirm email, anonymous sign-in, manual linking, HIBP passwords.
 *
 * MCP has no auth config write tool — use after editing supabase/config.toml.
 *
 * Usage: pnpm supabase:apply-general-auth-config
 */

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const configPath = path.join(root, "supabase", "config.toml");
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

function section(text, header) {
  const start = text.indexOf(header);
  if (start === -1) {
    return "";
  }

  const rest = text.slice(start + header.length);
  const next = rest.search(/^\[[^\]]+\]/m);
  return next === -1 ? rest : rest.slice(0, next);
}

function flag(sectionText, key, fallback = false) {
  const match = sectionText.match(
    new RegExp(`^\\s*${key}\\s*=\\s*(true|false)`, "m")
  );
  return match ? match[1] === "true" : fallback;
}

function parseGeneralAuthFromConfig() {
  const text = fs.readFileSync(configPath, "utf8");
  const authSection = section(text, "[auth]");
  const emailSection = section(text, "[auth.email]");
  const anonymousSection = section(text, "[auth.external.anonymous_users]");
  const passwordSection = section(text, "[auth.password]");

  const enableSignup = flag(authSection, "enable_signup", true);
  const enableManualLinking = flag(authSection, "enable_manual_linking", false);
  const enableConfirmations = flag(emailSection, "enable_confirmations", true);
  const anonymousEnabled = flag(anonymousSection, "enabled", false);
  const hibpEnabled = flag(passwordSection, "hibp_enabled", false);

  return {
    disable_signup: !enableSignup,
    mailer_autoconfirm: !enableConfirmations,
    external_anonymous_users_enabled: anonymousEnabled,
    security_manual_linking_enabled: enableManualLinking,
    password_hibp_enabled: hibpEnabled,
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
      "SUPABASE_ACCESS_TOKEN missing in .env.secret — https://supabase.com/dashboard/account/tokens"
    );
    process.exit(1);
  }

  const payload = parseGeneralAuthFromConfig();

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

  console.log("General auth configuration applied:");
  console.log(
    JSON.stringify(
      {
        allow_new_signups: !updated.disable_signup,
        confirm_email_required: !updated.mailer_autoconfirm,
        anonymous_sign_ins: updated.external_anonymous_users_enabled,
        manual_linking: updated.security_manual_linking_enabled,
        leaked_password_protection: updated.password_hibp_enabled,
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
