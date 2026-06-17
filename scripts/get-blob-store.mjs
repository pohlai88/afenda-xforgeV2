#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const storeId = process.argv[2];

if (!storeId) {
  console.error("Usage: node scripts/get-blob-store.mjs <storeId>");
  process.exit(1);
}

function loadToken() {
  for (const relativePath of [".env.secret", ".env.config"]) {
    const filePath = path.join(repoRoot, relativePath);
    if (!fs.existsSync(filePath)) continue;
    const match = fs.readFileSync(filePath, "utf8").match(/^BLOB_READ_WRITE_TOKEN=(.*)$/m);
    if (!match) continue;
    const value = match[1].trim().replace(/^["']|["']$/g, "");
    if (value) return value;
  }
  return "";
}

const token = loadToken();
if (!token) {
  console.error("Missing BLOB_READ_WRITE_TOKEN");
  process.exit(1);
}

const result = spawnSync(
  "vercel",
  ["blob", "get-store", storeId, "--rw-token", token],
  { encoding: "utf8", shell: true }
);

process.stdout.write(result.stdout ?? "");
process.stderr.write(result.stderr ?? "");
process.exit(result.status ?? 1);
