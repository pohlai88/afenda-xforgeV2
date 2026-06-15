#!/usr/bin/env node

/**
 * Links the repo to the remote Supabase project using env from .env / .env.secret.
 * Optionally prints config diff (local config.toml vs remote).
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const envPath = path.join(root, ".env");
const secretPath = path.join(root, ".env.secret");
const diffOnly = process.argv.includes("--diff-only");

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

const projectRef = parseToken(envPath, "SUPABASE_PROJECT_ID");
const accessToken = parseToken(secretPath, "SUPABASE_ACCESS_TOKEN");

if (!projectRef) {
  console.error("SUPABASE_PROJECT_ID missing in .env");
  process.exit(1);
}

const supabaseDir = path.join(root, "supabase");
const configPath = path.join(supabaseDir, "config.toml");

if (!fs.existsSync(configPath)) {
  console.log("Running supabase init…");
  const init = spawnSync("pnpm", ["exec", "supabase", "init"], {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });

  if (init.status !== 0) {
    process.exit(init.status ?? 1);
  }
}

const env = {
  ...process.env,
  ...(accessToken ? { SUPABASE_ACCESS_TOKEN: accessToken } : {}),
};

if (!accessToken) {
  console.warn(
    "SUPABASE_ACCESS_TOKEN not found in .env.secret — run `supabase login` or add a personal access token."
  );
  console.warn("https://supabase.com/dashboard/account/tokens");
}

const args = diffOnly
  ? ["exec", "supabase", "link", "--project-ref", projectRef]
  : ["exec", "supabase", "link", "--project-ref", projectRef, "--yes"];

console.log(
  diffOnly
    ? `Comparing supabase/config.toml with remote project ${projectRef}…`
    : `Linking to Supabase project ${projectRef}…`
);

const link = spawnSync("pnpm", args, {
  cwd: root,
  env,
  stdio: "inherit",
  shell: true,
});

process.exit(link.status ?? 1);
