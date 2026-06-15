#!/usr/bin/env node

/**
 * Applies custom Auth SMTP settings to the hosted Supabase project via Management API.
 * Without custom SMTP, Auth only sends to org team addresses (email_address_not_authorized).
 *
 * Required in .env.secret:
 *   SUPABASE_SMTP_PASSWORD — Zoho/app password for the SMTP user
 *
 * Optional overrides (.env.config or .env.secret):
 *   SUPABASE_SMTP_HOST, SUPABASE_SMTP_PORT, SUPABASE_SMTP_USER,
 *   SUPABASE_SMTP_ADMIN_EMAIL, SUPABASE_SMTP_SENDER_NAME,
 *   SUPABASE_SMTP_MAX_FREQUENCY, AUTH_RATE_LIMIT_EMAIL_SENT
 *
 * Usage: pnpm supabase:apply-smtp-config
 */

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const configPath = path.join(root, "supabase", "config.toml");
const configEnvPath = path.join(root, ".env.config");
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

function readEnvValue(key) {
  return (
    parseToken(secretPath, key) ||
    parseToken(configEnvPath, key) ||
    parseToken(envPath, key)
  );
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

function readString(sectionText, key) {
  const quoted = sectionText.match(
    new RegExp(`^\\s*${key}\\s*=\\s*"([^"]*)"`, "m")
  );
  if (quoted?.[1]) {
    return quoted[1];
  }

  const bare = sectionText.match(new RegExp(`^\\s*${key}\\s*=\\s*(\\S+)`, "m"));
  return bare?.[1] ?? "";
}

function resolveEnvSubstitution(value) {
  const match = value.match(/^env\(([^)]+)\)$/);
  if (!match) {
    return value;
  }

  return readEnvValue(match[1]);
}

function parseSmtpFromConfig() {
  const text = fs.readFileSync(configPath, "utf8");
  const smtpSection = section(text, "[auth.email.smtp]");
  const rateSection = section(text, "[auth.rate_limit]");

  const host =
    readEnvValue("SUPABASE_SMTP_HOST") || readString(smtpSection, "host");
  const portRaw =
    readEnvValue("SUPABASE_SMTP_PORT") || readString(smtpSection, "port");
  const user =
    resolveEnvSubstitution(readString(smtpSection, "user")) ||
    readEnvValue("SUPABASE_SMTP_USER");
  const pass =
    resolveEnvSubstitution(readString(smtpSection, "pass")) ||
    readEnvValue("SUPABASE_SMTP_PASSWORD");
  const adminEmail =
    readEnvValue("SUPABASE_SMTP_ADMIN_EMAIL") ||
    readString(smtpSection, "admin_email");
  const senderName =
    readEnvValue("SUPABASE_SMTP_SENDER_NAME") ||
    readString(smtpSection, "sender_name") ||
    readEnvValue("NEXT_PUBLIC_APP_NAME") ||
    "Afenda";

  const smtpMaxFrequency = readEnvValue("SUPABASE_SMTP_MAX_FREQUENCY") || "60";

  const rateLimitEmailSent =
    readEnvValue("AUTH_RATE_LIMIT_EMAIL_SENT") ||
    readString(rateSection, "email_sent") ||
    "100";

  return {
    host,
    port: Number(portRaw),
    user,
    pass,
    adminEmail: adminEmail || user,
    senderName,
    smtpMaxFrequency: Number(smtpMaxFrequency),
    rateLimitEmailSent: Number(rateLimitEmailSent),
    enabled: /^\s*enabled\s*=\s*true/m.test(smtpSection),
  };
}

function buildManagementPayload(parsed) {
  if (!parsed.enabled) {
    return {
      external_email_enabled: true,
    };
  }

  return {
    external_email_enabled: true,
    mailer_secure_email_change_enabled: true,
    mailer_autoconfirm: false,
    smtp_host: parsed.host,
    smtp_port: String(parsed.port),
    smtp_user: parsed.user,
    smtp_pass: parsed.pass,
    smtp_admin_email: parsed.adminEmail,
    smtp_sender_name: parsed.senderName,
    smtp_max_frequency: parsed.smtpMaxFrequency,
    rate_limit_email_sent: parsed.rateLimitEmailSent,
  };
}

async function main() {
  const projectRef = readEnvValue("SUPABASE_PROJECT_ID");
  const accessToken = readEnvValue("SUPABASE_ACCESS_TOKEN");

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

  const parsed = parseSmtpFromConfig();

  if (!parsed.enabled) {
    console.error(
      "[auth.email.smtp] enabled = false in supabase/config.toml — nothing to apply."
    );
    process.exit(1);
  }

  const missing = [];
  if (!parsed.host) {
    missing.push("SUPABASE_SMTP_HOST or [auth.email.smtp] host");
  }
  if (!parsed.port) {
    missing.push("SUPABASE_SMTP_PORT or [auth.email.smtp] port");
  }
  if (!parsed.user) {
    missing.push("SUPABASE_SMTP_USER or [auth.email.smtp] user");
  }
  if (!parsed.pass) {
    missing.push(
      "SUPABASE_SMTP_PASSWORD in .env.secret (Zoho app password for SMTP)"
    );
  }
  if (!parsed.adminEmail) {
    missing.push("SUPABASE_SMTP_ADMIN_EMAIL or [auth.email.smtp] admin_email");
  }

  if (missing.length > 0) {
    console.error("Custom SMTP configuration is incomplete:");
    for (const item of missing) {
      console.error(`  - ${item}`);
    }
    console.error("");
    console.error(
      "Dashboard fallback: Authentication → SMTP → https://supabase.com/dashboard/project/_/auth/smtp"
    );
    process.exit(1);
  }

  const payload = buildManagementPayload(parsed);

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
    const body = await response.text();
    console.error(`Management API PATCH failed (${response.status}): ${body}`);
    process.exit(1);
  }

  const updated = await response.json();

  console.log("Custom SMTP configuration applied:");
  console.log(
    JSON.stringify(
      {
        smtp_host: updated.smtp_host,
        smtp_port: updated.smtp_port,
        smtp_user: updated.smtp_user,
        smtp_admin_email: updated.smtp_admin_email,
        smtp_sender_name: updated.smtp_sender_name,
        smtp_max_frequency: updated.smtp_max_frequency,
        rate_limit_email_sent: updated.rate_limit_email_sent,
        external_email_enabled: updated.external_email_enabled,
      },
      null,
      2
    )
  );
  console.log("");
  console.log(
    "Verify deliverability: DKIM/DMARC/SPF on your sending domain; adjust rate limits if needed."
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
