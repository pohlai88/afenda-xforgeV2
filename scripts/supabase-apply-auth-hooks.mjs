#!/usr/bin/env node

/**
 * Applies Auth Hook settings from supabase/config.toml via Management API.
 * Postgres hook functions must exist first (pnpm migrate or Supabase MCP apply_migration).
 *
 * Usage:
 *   pnpm supabase:apply-auth-hooks
 *   pnpm supabase:apply-auth-hooks -- --hook mfa_verification_attempt
 */

import {
  AUTH_HOOK_API_FIELDS,
  ENTERPRISE_AUTH_HOOKS,
  parseAuthHooksFromConfig,
  patchAuthConfig,
  readSupabaseCredentials,
  summarizeAppliedHooks,
} from "./supabase-auth-hook-utils.mjs";

const hookFilter = process.argv
  .slice(2)
  .find((arg) => arg.startsWith("--hook="))
  ?.slice("--hook=".length);

function filterPayload(fullPayload, hookName) {
  if (!hookName) {
    return fullPayload;
  }

  const fields = AUTH_HOOK_API_FIELDS[hookName];
  if (!fields) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(fullPayload).filter(
      ([key]) =>
        key === fields.enabled ||
        key === fields.uri ||
        key === fields.secrets
    )
  );
}

function splitPayloadByPlan(payload) {
  const enterprise = {};
  const standard = {};

  for (const [hookName, fields] of Object.entries(AUTH_HOOK_API_FIELDS)) {
    if (payload[fields.enabled] === undefined) {
      continue;
    }

    const bucket = ENTERPRISE_AUTH_HOOKS.has(hookName) ? enterprise : standard;
    bucket[fields.enabled] = payload[fields.enabled];
    if (payload[fields.uri] !== undefined) {
      bucket[fields.uri] = payload[fields.uri];
    }
    if (fields.secrets && payload[fields.secrets] !== undefined) {
      bucket[fields.secrets] = payload[fields.secrets];
    }
  }

  return { enterprise, standard };
}

async function applyPayload(projectRef, accessToken, payload, label) {
  if (Object.keys(payload).length === 0) {
    return { ok: true, skipped: true };
  }

  const response = await patchAuthConfig(projectRef, accessToken, payload);

  if (!response.ok) {
    const body = await response.text();
    return { ok: false, status: response.status, body, label };
  }

  return { ok: true, config: await response.json(), label };
}

async function main() {
  const { projectRef, accessToken } = readSupabaseCredentials();

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

  const fullPayload = parseAuthHooksFromConfig();
  const payload = filterPayload(fullPayload, hookFilter);

  if (Object.keys(payload).length === 0) {
    console.error(
      hookFilter
        ? `No [auth.hook.${hookFilter}] section in supabase/config.toml`
        : "No auth hook sections found in supabase/config.toml"
    );
    process.exit(1);
  }

  const batches = hookFilter
    ? [{ payload, label: hookFilter }]
    : (() => {
        const { enterprise, standard } = splitPayloadByPlan(payload);
        return [
          { payload: standard, label: "standard (Free/Pro)" },
          { payload: enterprise, label: "enterprise (Teams/Enterprise)" },
        ];
      })();

  let lastConfig = null;
  const failures = [];

  for (const batch of batches) {
    const result = await applyPayload(
      projectRef,
      accessToken,
      batch.payload,
      batch.label
    );

    if (result.skipped) {
      continue;
    }

    if (!result.ok) {
      failures.push(result);
      continue;
    }

    lastConfig = result.config;
  }

  if (failures.length > 0 && !lastConfig) {
    for (const failure of failures) {
      console.error(
        `Management API PATCH failed for ${failure.label} (${failure.status}): ${failure.body}`
      );
    }

    const enterpriseFailure = failures.some((failure) => failure.status === 402);
    if (enterpriseFailure) {
      console.error("");
      console.error(
        "MFA and password verification hooks require Teams or Enterprise on hosted Supabase."
      );
      console.error(
        "Database functions are ready — upgrade the plan or enable in Dashboard → Authentication → Hooks."
      );
    }

    process.exitCode = enterpriseFailure ? 0 : 1;
    return;
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.warn(
        `Skipped ${failure.label} (${failure.status}): ${failure.body}`
      );
    }
    console.warn("");
    console.warn(
      "Standard hooks were applied. Enterprise hooks need Teams/Enterprise or Dashboard enablement."
    );
  }

  const summary = summarizeAppliedHooks(lastConfig ?? {});

  console.log("Auth hook configuration applied:");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
