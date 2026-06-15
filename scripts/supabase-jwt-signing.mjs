#!/usr/bin/env node

/**
 * JWT signing keys + API key mode health report (MCP gap workaround).
 *
 * Usage:
 *   pnpm supabase:jwt-signing
 *   pnpm supabase:jwt-signing --json
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env");
const configPath = path.join(root, ".env.config");
const secretPath = path.join(root, ".env.secret");
const jsonOutput = process.argv.includes("--json");

function resolveSigningSystem(activeKeys) {
  if (
    activeKeys.some(
      (key) => key.algorithm === "ES256" || key.algorithm === "RS256"
    )
  ) {
    return "asymmetric";
  }

  if (activeKeys.every((key) => key.algorithm === "HS256")) {
    return "legacy_hs256_only";
  }

  return "unknown";
}

function formatEnabledState(value) {
  if (value === null) {
    return "unknown";
  }

  return value ? "yes" : "no";
}

function detectClientKeyMode(key) {
  if (!key) {
    return "missing";
  }
  if (key.startsWith("sb_publishable_")) {
    return "publishable";
  }
  if (key.startsWith("eyJ")) {
    return "legacy_anon_jwt";
  }
  return "unknown";
}

function detectServerKeyMode(key) {
  if (!key) {
    return "missing";
  }
  if (key.startsWith("sb_secret_")) {
    return "secret";
  }
  if (key.startsWith("eyJ")) {
    return "legacy_service_role_jwt";
  }
  return "unknown";
}

function describeJwtAlgorithm(algorithm) {
  switch (algorithm) {
    case "ES256":
      return "ES256 (P-256 elliptic curve)";
    case "RS256":
      return "RS256 (RSA 2048)";
    case "HS256":
      return "HS256 (shared secret — legacy)";
    default:
      return algorithm;
  }
}

function describeClientKeyMode(mode) {
  switch (mode) {
    case "publishable":
      return "Publishable (sb_publishable_…)";
    case "legacy_anon_jwt":
      return "Legacy anon JWT (deprecated)";
    case "missing":
      return "Not configured";
    default:
      return "Unknown key format";
  }
}

function describeServerKeyMode(mode) {
  switch (mode) {
    case "secret":
      return "Secret (sb_secret_…)";
    case "legacy_service_role_jwt":
      return "Legacy service_role JWT (deprecated)";
    case "missing":
      return "Not configured";
    default:
      return "Unknown key format";
  }
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

function readEnvValue(key) {
  return (
    parseToken(configPath, key) ||
    parseToken(envPath, key) ||
    parseToken(secretPath, key) ||
    parseToken(path.join(root, ".env.local"), key) ||
    parseToken(path.join(root, "apps", "app", ".env.local"), key)
  );
}

async function fetchLegacyAnonEnabled(projectRef, accessToken) {
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/api-keys`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  const keys = await response.json();
  const legacyAnon = Array.isArray(keys)
    ? keys.find((entry) => entry?.name === "anon" || entry?.type === "legacy")
    : null;

  return legacyAnon ? !legacyAnon.disabled : null;
}

async function main() {
  const projectRef = readEnvValue("SUPABASE_PROJECT_ID");
  const accessToken = readEnvValue("SUPABASE_ACCESS_TOKEN");
  const supabaseUrl =
    readEnvValue("NEXT_PUBLIC_SUPABASE_URL") ||
    readEnvValue("SUPABASE_API_URL")?.replace(/\/rest\/v1\/?$/, "");

  const clientKey =
    readEnvValue("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ||
    readEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY") ||
    readEnvValue("SUPABASE_PUBLISHABLE_KEY") ||
    readEnvValue("SUPABASE_ANON_PUBLIC");

  const serverKey =
    readEnvValue("SUPABASE_SECRET_KEY") ||
    readEnvValue("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl) {
    console.error("NEXT_PUBLIC_SUPABASE_URL missing");
    process.exit(1);
  }

  const jwksUrl = `${supabaseUrl.replace(/\/$/, "")}/auth/v1/.well-known/jwks.json`;
  const jwksResponse = await fetch(jwksUrl);

  if (!jwksResponse.ok) {
    console.error(`JWKS fetch failed (${jwksResponse.status})`);
    process.exit(1);
  }

  const jwks = await jwksResponse.json();
  const activeKeys = (jwks.keys ?? [])
    .filter((key) => key.kid && key.alg && key.kty)
    .map((key) => ({
      kid: key.kid,
      algorithm: key.alg,
      keyType: key.kty,
    }));

  const apiKeys = {
    client: detectClientKeyMode(clientKey),
    server: detectServerKeyMode(serverKey),
  };

  const signingSystem = resolveSigningSystem(activeKeys);

  let legacyAnonKeyEnabled = null;

  if (projectRef && accessToken) {
    legacyAnonKeyEnabled = await fetchLegacyAnonEnabled(
      projectRef,
      accessToken
    );
  }

  const recommendations = [];

  if (signingSystem === "asymmetric") {
    recommendations.push(
      "Asymmetric signing active — verify sessions with getClaims(), not JWT_SECRET."
    );
  }

  if (apiKeys.client === "publishable" && apiKeys.server === "secret") {
    recommendations.push(
      "Publishable + secret keys configured — disable legacy anon/service_role when dashboard last-used is clear."
    );
  }

  if (apiKeys.client === "legacy_anon_jwt") {
    recommendations.push(
      "Migrate client env to NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
  }

  if (apiKeys.server === "legacy_service_role_jwt") {
    recommendations.push("Migrate server env to SUPABASE_SECRET_KEY.");
  }

  if (legacyAnonKeyEnabled) {
    recommendations.push(
      "Legacy anon API key is still enabled in Supabase — disable after clients switch to publishable key."
    );
  }

  const report = {
    projectRef: projectRef || null,
    jwksUrl,
    signingSystem,
    activeKeys: activeKeys.map((key) => ({
      ...key,
      algorithmLabel: describeJwtAlgorithm(key.algorithm),
    })),
    apiKeys: {
      client: apiKeys.client,
      clientLabel: describeClientKeyMode(apiKeys.client),
      server: apiKeys.server,
      serverLabel: describeServerKeyMode(apiKeys.server),
    },
    legacyAnonKeyEnabled,
    verificationMethod: "getClaims_jwks",
    recommendations,
  };

  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log(`JWT signing report — ${projectRef ?? supabaseUrl}\n`);
  console.log(`Signing system: ${signingSystem}`);
  console.log(`JWKS: ${jwksUrl}`);
  console.log("\nTrusted keys:");
  for (const key of report.activeKeys) {
    console.log(`  ${key.algorithmLabel} · kid ${key.kid}`);
  }
  console.log(`\nClient key: ${report.apiKeys.clientLabel}`);
  console.log(`Server key: ${report.apiKeys.serverLabel}`);
  console.log(
    `Legacy anon enabled: ${formatEnabledState(legacyAnonKeyEnabled)}`
  );

  if (recommendations.length > 0) {
    console.log("\nRecommendations:");
    for (const item of recommendations) {
      console.log(`  - ${item}`);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
