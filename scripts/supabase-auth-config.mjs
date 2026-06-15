#!/usr/bin/env node

/**
 * Fetches Supabase Auth configuration the MCP server does not expose.
 *
 * Sources:
 * 1. Management API — full auth service config (requires SUPABASE_ACCESS_TOKEN)
 * 2. Public Auth API — provider toggles at /auth/v1/settings (anon key only)
 *
 * Usage:
 *   pnpm supabase:auth-config
 *   pnpm supabase:auth-config --json > supabase/auth.remote.json
 */

import fs from "node:fs";
import path from "node:path";
import { summarizeAppliedHooks } from "./supabase-auth-hook-utils.mjs";

const root = path.resolve(import.meta.dirname, "..");
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

function readSupabaseEnv() {
  const projectRef = parseToken(envPath, "SUPABASE_PROJECT_ID");
  const accessToken = parseToken(secretPath, "SUPABASE_ACCESS_TOKEN");
  const supabaseUrl =
    parseToken(envPath, "NEXT_PUBLIC_SUPABASE_URL") ||
    parseToken(envPath, "SUPABASE_API_URL");
  const anonKey =
    parseToken(envPath, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ||
    parseToken(envPath, "NEXT_PUBLIC_SUPABASE_ANON_KEY") ||
    parseToken(envPath, "SUPABASE_PUBLISHABLE_KEY") ||
    parseToken(envPath, "SUPABASE_ANON_PUBLIC");

  return { projectRef, accessToken, supabaseUrl, anonKey };
}

const SENSITIVE_AUTH_KEYS =
  /(?:^|_)secret(?:$|_)|smtp_pass|hook_.*_secrets?|template|notification|subject|content|client_secret|auth_token/i;

function redactManagementConfig(config) {
  return Object.fromEntries(
    Object.entries(config).filter(([key]) => !SENSITIVE_AUTH_KEYS.test(key))
  );
}

function summarizeForUi(publicSettings, managementConfig) {
  const external = publicSettings?.external ?? {};
  const m = managementConfig ?? {};

  return {
    providers: {
      email: external.email ?? true,
      google: external.google ?? false,
      phone: external.phone ?? false,
      anonymous: external.anonymous_users ?? false,
    },
    signup: {
      disableSignup: publicSettings?.disable_signup ?? false,
      mailerAutoconfirm: publicSettings?.mailer_autoconfirm ?? false,
      anonymousUsers:
        external.anonymous_users ??
        m.external_anonymous_users_enabled ??
        false,
    },
    passkeys: {
      enabled:
        publicSettings?.passkeys_enabled ??
        m.passkey_enabled ??
        false,
      rpId: m.webauthn_rp_id ?? null,
      rpDisplayName: m.webauthn_rp_display_name ?? null,
      rpOrigins: m.webauthn_rp_origins ?? null,
    },
    mfa: {
      maxEnrolledFactors: m.mfa_max_enrolled_factors ?? null,
      phoneEnrollEnabled: m.mfa_phone_enroll_enabled ?? null,
      phoneVerifyEnabled: m.mfa_phone_verify_enabled ?? null,
      totpEnrollEnabled: m.mfa_totp_enroll_enabled ?? null,
      totpVerifyEnabled: m.mfa_totp_verify_enabled ?? null,
    },
    urls: {
      siteUrl: m.site_url ?? null,
      additionalRedirectUrls: m.additional_redirect_urls ?? null,
      uriAllowList: m.uri_allow_list ?? null,
    },
    sessions: {
      jwtExpSeconds: m.jwt_exp ?? null,
      timeboxHours: m.sessions_timebox ?? null,
      inactivityTimeoutHours: m.sessions_inactivity_timeout ?? null,
      singlePerUser: m.sessions_single_per_user ?? null,
      refreshTokenRotationEnabled: m.refresh_token_rotation_enabled ?? null,
      refreshTokenReuseIntervalSeconds:
        m.security_refresh_token_reuse_interval ?? null,
    },
    security: {
      captchaEnabled: m.security_captcha_enabled ?? null,
      captchaProvider: m.security_captcha_provider ?? null,
      passwordMinLength: m.password_min_length ?? null,
      manualLinkingEnabled: m.security_manual_linking_enabled ?? null,
    },
    otp: {
      length: m.mailer_otp_length ?? 6,
      expSeconds: m.mailer_otp_exp ?? 3600,
      rateLimitSeconds: m.rate_limit_otp ?? null,
    },
    hooks: summarizeAppliedHooks(m),
    audit: {
      postgresStorageEnabled: !m.audit_log_disable_postgres,
    },
    smtp: {
      configured: Boolean(m.smtp_host),
      host: m.smtp_host ?? null,
      port: m.smtp_port ?? null,
      adminEmail: m.smtp_admin_email ?? null,
      senderName: m.smtp_sender_name ?? null,
      maxFrequencySeconds: m.smtp_max_frequency ?? null,
      rateLimitEmailSentPerHour: m.rate_limit_email_sent ?? null,
    },
  };
}

async function fetchPublicSettings(supabaseUrl, anonKey) {
  const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
    headers: { apikey: anonKey },
  });

  if (!response.ok) {
    throw new Error(
      `Public auth settings failed (${response.status}): ${await response.text()}`
    );
  }

  return response.json();
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

function printHumanReport(payload) {
  console.log("Supabase Auth configuration report");
  console.log(`Project: ${payload.projectRef}`);
  console.log("");
  console.log("MCP gap: no get_auth_config tool — use this script or Supabase CLI.");
  console.log("");
  console.log("UI summary:");
  console.log(JSON.stringify(payload.uiSummary, null, 2));
  console.log("");
  console.log("Public /auth/v1/settings:");
  console.log(JSON.stringify(payload.publicSettings, null, 2));

  if (payload.managementConfig) {
    console.log("");
    console.log("Management API (secrets redacted):");
    console.log(JSON.stringify(payload.managementConfig, null, 2));
  } else {
    console.log("");
    console.log(
      "Management API: skipped — add SUPABASE_ACCESS_TOKEN to .env.secret"
    );
    console.log("  Create token: https://supabase.com/dashboard/account/tokens");
  }
}

async function main() {
  const { projectRef, accessToken, supabaseUrl, anonKey } = readSupabaseEnv();

  if (!projectRef) {
    console.error("SUPABASE_PROJECT_ID missing in .env");
    process.exit(1);
  }

  if (!supabaseUrl || !anonKey) {
    console.error(
      "NEXT_PUBLIC_SUPABASE_URL and anon/publishable key missing in .env"
    );
    process.exit(1);
  }

  const publicSettings = await fetchPublicSettings(supabaseUrl, anonKey);

  let managementConfig = null;
  if (accessToken) {
    managementConfig = redactManagementConfig(
      await fetchManagementAuthConfig(projectRef, accessToken)
    );
  }

  const payload = {
    projectRef,
    fetchedAt: new Date().toISOString(),
    publicSettings,
    managementConfig,
    uiSummary: summarizeForUi(publicSettings, managementConfig),
  };

  if (jsonOutput) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  printHumanReport(payload);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
