#!/usr/bin/env node

/**
 * Applies password-auth settings from supabase/config.toml via Management API:
 * email confirmations, password policy, redirect URLs (PKCE /auth/confirm flow).
 *
 * Usage: pnpm supabase:apply-password-auth-config
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

function extractSection(configText, sectionName) {
  const pattern = new RegExp(
    `^\\[${sectionName.replace(/\./g, "\\.")}\\]\\s*\\n([\\s\\S]*?)(?=\\n\\[)`,
    "m"
  );
  const match = pattern.exec(configText);
  if (match) {
    return match[1];
  }

  const tailPattern = new RegExp(
    `^\\[${sectionName.replace(/\./g, "\\.")}\\]\\s*\\n([\\s\\S]*)$`,
    "m"
  );
  return tailPattern.exec(configText)?.[1] ?? "";
}

function readBool(section, key) {
  const match = section.match(
    new RegExp(`^\\s*${key}\\s*=\\s*(true|false)`, "m")
  );
  return match?.[1] === "true";
}

function readString(section, key) {
  return section.match(new RegExp(`^\\s*${key}\\s*=\\s*"([^"]*)"`, "m"))?.[1];
}

const PASSWORD_CHARACTER_PRESETS = {
  lower_upper_letters_digits_symbols:
    "abcdefghijklmnopqrstuvwxyz:ABCDEFGHIJKLMNOPQRSTUVWXYZ:0123456789:!@#$%^&*()_+-=[]{};'\\\\:\"|<>?,./`~",
};

function resolvePasswordCharacters(value) {
  if (!value) {
    return undefined;
  }

  return PASSWORD_CHARACTER_PRESETS[value] ?? value;
}

function readInt(section, key) {
  const value = section.match(
    new RegExp(`^\\s*${key}\\s*=\\s*(\\d+)`, "m")
  )?.[1];
  return value ? Number(value) : undefined;
}

function parseAuthSection(configText) {
  const normalized = configText.replace(/\r\n/g, "\n");
  const authBlock = extractSection(normalized, "auth");
  const emailBlock = extractSection(normalized, "auth.email");
  const hostedPasswordBlock = hostedSection(
    readHostedConfigText(),
    "[auth_hosted.password]"
  );

  const redirectBlock =
    authBlock.match(/additional_redirect_urls\s*=\s*\[([\s\S]*?)\]/m)?.[1] ??
    "";
  const redirectUrls = [...redirectBlock.matchAll(/"([^"]+)"/g)].map(
    (match) => match[1]
  );

  const enableSignup = readBool(authBlock, "enable_signup");
  const emailSignup = readBool(emailBlock, "enable_signup");
  const enableConfirmations = readBool(emailBlock, "enable_confirmations");
  const securePasswordChange = readBool(emailBlock, "secure_password_change");
  const requireCurrentPassword = readBool(
    hostedPasswordBlock,
    "require_current_password_on_change"
  );

  return {
    site_url: readString(authBlock, "site_url"),
    uri_allow_list: redirectUrls.join(","),
    disable_signup: enableSignup === false,
    external_email_enabled: emailSignup !== false,
    mailer_autoconfirm: enableConfirmations === false,
    password_min_length: readInt(authBlock, "minimum_password_length"),
    password_required_characters: resolvePasswordCharacters(
      readString(authBlock, "password_requirements")
    ),
    password_hibp_enabled: readBool(hostedPasswordBlock, "hibp_enabled"),
    security_update_password_require_reauthentication: securePasswordChange,
    security_update_password_require_current_password: requireCurrentPassword,
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

  const configText = fs.readFileSync(configPath, "utf8");
  const payload = parseAuthSection(configText);

  if (!payload.uri_allow_list) {
    console.error(
      "uri_allow_list is empty — check supabase/config.toml additional_redirect_urls"
    );
    process.exit(1);
  }

  console.log("Applying password-auth config to project", projectRef);
  console.log(JSON.stringify(payload, null, 2));

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

  console.log("Password-auth config applied:");
  console.log(
    JSON.stringify(
      {
        site_url: updated.site_url,
        uri_allow_list: updated.uri_allow_list,
        disable_signup: updated.disable_signup,
        mailer_autoconfirm: updated.mailer_autoconfirm,
        external_email_enabled: updated.external_email_enabled,
        password_min_length: updated.password_min_length,
        password_required_characters: updated.password_required_characters,
        password_hibp_enabled: updated.password_hibp_enabled,
        secure_password_change:
          updated.security_update_password_require_reauthentication,
        require_current_password_on_change:
          updated.security_update_password_require_current_password,
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
