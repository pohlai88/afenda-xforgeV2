#!/usr/bin/env node

/**
 * Enables the MFA verification Postgres hook on the hosted Supabase project.
 * Requires migration 0012_mfa_verification_hook.sql applied first.
 *
 * Usage: pnpm supabase:apply-mfa-verification-hook
 * Prefer: pnpm supabase:apply-auth-hooks -- --hook=mfa_verification_attempt
 */

import { spawnSync } from "node:child_process";
import path from "node:path";

const scriptPath = path.join(
  import.meta.dirname,
  "supabase-apply-auth-hooks.mjs"
);

const result = spawnSync(
  process.execPath,
  [scriptPath, "--hook=mfa_verification_attempt"],
  { stdio: "inherit" }
);

process.exit(result.status ?? 1);
