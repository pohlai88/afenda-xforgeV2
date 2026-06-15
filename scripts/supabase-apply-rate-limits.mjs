#!/usr/bin/env node

/**
 * Applies Supabase Auth rate limits from supabase/config.toml via Management API.
 *
 * Usage: pnpm supabase:apply-rate-limits
 */

import fs from "node:fs";
import path from "node:path";
import {
  hostedSection,
  readHostedConfigText,
} from "./supabase-auth-hosted-config.mjs";

const root = path.resolve(import.meta.dirname, "..");
const configPath = path.join(root, "supabase", "config.toml");
const configEnvPath = path.join(root, ".env.config");
const envPath = path.join(root, ".env");
const secretPath = path.join(root, ".env.secret");

function readEnvValue(key) {
  return (
    parseToken(secretPath, key) ||
    parseToken(configEnvPath, key) ||
    parseToken(envPath, key)
  );
}

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

function readInt(sectionText, key) {
  const match = sectionText.match(
    new RegExp(`^\\s*${key}\\s*=\\s*(\\d+)`, "m")
  );
  return match ? Number(match[1]) : undefined;
}

function readBool(sectionText, key) {
  const match = sectionText.match(
    new RegExp(`^\\s*${key}\\s*=\\s*(true|false)`, "m")
  );
  return match ? match[1] === "true" : undefined;
}

function readString(sectionText, key) {
  const quoted = sectionText.match(
    new RegExp(`^\\s*${key}\\s*=\\s*"([^"]*)"`, "m")
  );
  if (quoted?.[1]) {
    return quoted[1];
  }

  const bare = sectionText.match(new RegExp(`^\\s*${key}\\s*=\\s*(\\S+)`, "m"));
  return bare?.[1];
}

/** Parse Go duration strings like 1m0s, 60s, or plain seconds. */
function parseDurationSeconds(value) {
  if (!value) {
    return undefined;
  }

  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  const minutesSeconds = value.match(/^(\d+)m(\d+)s$/);
  if (minutesSeconds) {
    return Number(minutesSeconds[1]) * 60 + Number(minutesSeconds[2]);
  }

  const secondsOnly = value.match(/^(\d+)s$/);
  if (secondsOnly) {
    return Number(secondsOnly[1]);
  }

  return undefined;
}

function parseRateLimitsFromConfig() {
  const text = fs.readFileSync(configPath, "utf8");
  const hostedText = readHostedConfigText();
  const hostedSectionRoot = hostedSection(hostedText, "[auth_hosted]");
  const hostedSessionsSection = hostedSection(hostedText, "[auth_hosted.sessions]");
  const emailSection = section(text, "[auth.email]");
  const rateSection = section(text, "[auth.rate_limit]");

  const envEmailSent = readEnvValue("AUTH_RATE_LIMIT_EMAIL_SENT");
  const envSmtpMaxFrequency = readEnvValue("SUPABASE_SMTP_MAX_FREQUENCY");
  const maxFrequency = envSmtpMaxFrequency
    ? Number(envSmtpMaxFrequency)
    : (parseDurationSeconds(readString(emailSection, "max_frequency")) ?? 60);

  return {
    rate_limit_email_sent: envEmailSent
      ? Number(envEmailSent)
      : readInt(rateSection, "email_sent"),
    rate_limit_sms_sent: readInt(rateSection, "sms_sent"),
    rate_limit_anonymous_users: readInt(rateSection, "anonymous_users"),
    rate_limit_token_refresh: readInt(rateSection, "token_refresh"),
    rate_limit_otp: readInt(rateSection, "sign_in_sign_ups"),
    rate_limit_verify: readInt(rateSection, "token_verifications"),
    rate_limit_web3: readInt(rateSection, "web3"),
    smtp_max_frequency: maxFrequency,
    security_sb_forwarded_for_enabled: readBool(
      hostedSectionRoot,
      "sb_forwarded_for_enabled"
    ),
    sessions_single_per_user: readBool(hostedSessionsSection, "single_per_user"),
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

  const payload = Object.fromEntries(
    Object.entries(parseRateLimitsFromConfig()).filter(
      ([, value]) => value !== undefined
    )
  );

  console.log("Applying auth rate limits to project", projectRef);
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

  console.log("Rate limits applied:");
  console.log(
    JSON.stringify(
      {
        rate_limit_email_sent: updated.rate_limit_email_sent,
        rate_limit_otp: updated.rate_limit_otp,
        rate_limit_verify: updated.rate_limit_verify,
        rate_limit_token_refresh: updated.rate_limit_token_refresh,
        rate_limit_sms_sent: updated.rate_limit_sms_sent,
        rate_limit_anonymous_users: updated.rate_limit_anonymous_users,
        rate_limit_web3: updated.rate_limit_web3,
        smtp_max_frequency: updated.smtp_max_frequency,
        security_sb_forwarded_for_enabled:
          updated.security_sb_forwarded_for_enabled,
        sessions_single_per_user: updated.sessions_single_per_user,
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
