import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const e2eDir = path.dirname(fileURLToPath(import.meta.url));
export const appDir = path.resolve(e2eDir, "../..");
export const repoRoot = path.resolve(appDir, "../..");

/** Mirrors `scripts/sync-env.mjs` source → destination resolution. */
const ENV_LOAD_ORDER = [
  path.join(repoRoot, ".env.config"),
  path.join(repoRoot, ".env.secret"),
  path.join(repoRoot, ".env"),
  path.join(repoRoot, ".env.local"),
  path.join(appDir, ".env.local"),
];

const ENV_LINE_PATTERN =
  /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=(.*)$/;
const ENV_LINE_SPLIT_PATTERN = /\r?\n/;
const ENV_VALUE_QUOTES_PATTERN = /^["']|["']$/g;

export const loadEnvFile = (envPath) => {
  if (!fs.existsSync(envPath)) {
    return false;
  }

  for (const line of fs
    .readFileSync(envPath, "utf8")
    .split(ENV_LINE_SPLIT_PATTERN)) {
    const match = line.match(ENV_LINE_PATTERN);
    if (!match || process.env[match[1]]) {
      continue;
    }

    process.env[match[1]] = match[2].trim().replace(ENV_VALUE_QUOTES_PATTERN, "");
  }

  return true;
};

export const loadE2eEnv = () => {
  const loaded = [];

  for (const envPath of ENV_LOAD_ORDER) {
    if (loadEnvFile(envPath)) {
      loaded.push(path.relative(repoRoot, envPath));
    }
  }

  return loaded;
};

const resolveSupabaseUrl = () =>
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_API_URL ?? "";

const resolveServiceRoleKey = () =>
  process.env.SUPABASE_SECRET_KEY ??
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  "";

const resolveAnonOrPublishableKey = () =>
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_PUBLISHABLE_KEY ??
  process.env.SUPABASE_ANON_PUBLIC ??
  "";

export const getE2eSupabaseEnvStatus = () => {
  const url = resolveSupabaseUrl();
  const serviceRoleKey = resolveServiceRoleKey();
  const anonKey = resolveAnonOrPublishableKey();

  return {
    url: Boolean(url),
    serviceRoleKey: Boolean(serviceRoleKey),
    anonOrPublishableKey: Boolean(anonKey),
    readyForIntegrationTests: Boolean(url && serviceRoleKey),
    readyForBrowserAuthTests: Boolean(url && anonKey),
  };
};

export const assertE2eSupabaseEnv = () => {
  const loaded = loadE2eEnv();
  const status = getE2eSupabaseEnvStatus();

  return { loaded, status };
};
