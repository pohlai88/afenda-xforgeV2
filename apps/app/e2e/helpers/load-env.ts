import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const e2eDir = path.dirname(fileURLToPath(import.meta.url));
export const appDir = path.resolve(e2eDir, "../..");
export const repoRoot = path.resolve(appDir, "../..");
export const e2eOutputDir = path.join(repoRoot, "output/playwright/app");

/** Mirrors `scripts/sync-env.mjs` source → destination resolution. */
const ENV_LOAD_ORDER = [
  path.join(repoRoot, ".env.config"),
  path.join(repoRoot, ".env.secret"),
  path.join(repoRoot, ".env"),
  path.join(repoRoot, ".env.local"),
  path.join(appDir, ".env.local"),
] as const;

const ENV_LINE_PATTERN = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=(.*)$/;
const ENV_VALUE_QUOTES_PATTERN = /^["']|["']$/g;

export interface E2eSupabaseEnvStatus {
  anonOrPublishableKey: boolean;
  readyForBrowserAuthTests: boolean;
  readyForIntegrationTests: boolean;
  serviceRoleKey: boolean;
  url: boolean;
}

export interface E2eBlobEnvStatus {
  privateBlobToken: boolean;
  privateStoreId: boolean;
  publicBlobToken: boolean;
  publicStoreId: boolean;
  readyForPrivateBlob: boolean;
  readyForUploadTests: boolean;
}

export type E2eCheckProject =
  | "report"
  | "auth-flows"
  | "authenticated"
  | "orbit-case"
  | "orbit-case-blob"
  | "full";

export const loadEnvFile = (envPath: string): boolean => {
  if (!fs.existsSync(envPath)) {
    return false;
  }

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(ENV_LINE_PATTERN);
    if (!match || process.env[match[1]]) {
      continue;
    }

    process.env[match[1]] = match[2]
      .trim()
      .replace(ENV_VALUE_QUOTES_PATTERN, "");
  }

  return true;
};

export const loadE2eEnv = (): string[] => {
  const loaded: string[] = [];

  for (const envPath of ENV_LOAD_ORDER) {
    if (loadEnvFile(envPath)) {
      loaded.push(path.relative(repoRoot, envPath));
    }
  }

  return loaded;
};

const resolveSupabaseUrl = (): string =>
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_API_URL ?? "";

const resolveServiceRoleKey = (): string =>
  process.env.SUPABASE_SECRET_KEY ??
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  "";

const resolveAnonOrPublishableKey = (): string =>
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_PUBLISHABLE_KEY ??
  process.env.SUPABASE_ANON_PUBLIC ??
  "";

export const getE2eSupabaseEnvStatus = (): E2eSupabaseEnvStatus => {
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

export const assertE2eSupabaseEnv = (): {
  loaded: string[];
  status: E2eSupabaseEnvStatus;
} => {
  const loaded = loadE2eEnv();
  const status = getE2eSupabaseEnvStatus();

  return { loaded, status };
};

const resolvePrivateBlobToken = (): string | undefined =>
  process.env.XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN ??
  process.env.XFROGE_PRIVATE_READ_WRITE_TOKEN ??
  process.env.XFROGE_READ_WRITE_TOKEN;

const resolvePrivateStoreId = (): string | undefined =>
  process.env.XFORGE_STORE_ID ??
  process.env.XFROGE_PRIVATE_STORE_ID ??
  process.env.XFROGE_STORE_ID;

export const getE2eBlobEnvStatus = (): E2eBlobEnvStatus => {
  const publicBlobToken = Boolean(process.env.XFORGE_PUB_BLOB_READ_WRITE_TOKEN);
  const privateBlobToken = Boolean(resolvePrivateBlobToken());
  const publicStoreId = Boolean(process.env.XFORGE_PUB_STORE_ID);
  const privateStoreId = Boolean(resolvePrivateStoreId());

  return {
    publicBlobToken,
    privateBlobToken,
    publicStoreId,
    privateStoreId,
    readyForUploadTests: publicBlobToken && publicStoreId,
    readyForPrivateBlob: privateBlobToken && privateStoreId,
  };
};

export const getPlaywrightBaseUrl = (): string =>
  process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export const getE2eAuthStoragePath = (): string =>
  path.join(e2eOutputDir, ".auth/e2e-user.json");

export const getE2eBlobWebServerEnv = (): Record<string, string> => {
  const entries = {
    XFORGE_PUB_BLOB_READ_WRITE_TOKEN:
      process.env.XFORGE_PUB_BLOB_READ_WRITE_TOKEN,
    XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN: resolvePrivateBlobToken(),
    XFORGE_PUB_STORE_ID: process.env.XFORGE_PUB_STORE_ID,
    XFORGE_STORE_ID: resolvePrivateStoreId(),
  };

  return Object.fromEntries(
    Object.entries(entries).filter((entry): entry is [string, string] =>
      Boolean(entry[1])
    )
  );
};

export const getE2eWebServerEnv = (): Record<string, string> => ({
  ...getE2eBlobWebServerEnv(),
  DEBUG: "",
  ELECTRON_RUN_AS_NODE: "",
  NEXT_TELEMETRY_DISABLED: "1",
  NODE_INSPECT_RESUME_ON_START: "",
  NODE_ENV: "development",
  NODE_OPTIONS: "--no-deprecation",
  VSCODE_INSPECTOR_OPTIONS: "",
});

export const isE2eProjectReady = (
  project: E2eCheckProject,
  supabase: E2eSupabaseEnvStatus,
  blob: E2eBlobEnvStatus
): boolean => {
  switch (project) {
    case "report":
      return true;
    case "auth-flows":
      return supabase.readyForBrowserAuthTests;
    case "authenticated":
    case "orbit-case":
      return (
        supabase.readyForBrowserAuthTests && supabase.readyForIntegrationTests
      );
    case "orbit-case-blob":
      return (
        supabase.readyForBrowserAuthTests &&
        blob.readyForUploadTests &&
        blob.readyForPrivateBlob
      );
    case "full":
      return (
        supabase.readyForBrowserAuthTests &&
        supabase.readyForIntegrationTests &&
        blob.readyForUploadTests &&
        blob.readyForPrivateBlob
      );
    default:
      return true;
  }
};

export const requireE2eGlobalSetupEnv = (): void => {
  const status = getE2eSupabaseEnvStatus();
  if (status.readyForIntegrationTests) {
    return;
  }

  throw new Error(
    [
      "E2E global setup requires NEXT_PUBLIC_SUPABASE_URL and a service role key.",
      "Run: pnpm test:e2e:env",
      "Or set PLAYWRIGHT_SKIP_GLOBAL_SETUP=1 for auth-flow-only runs without user provisioning.",
    ].join(" ")
  );
};
