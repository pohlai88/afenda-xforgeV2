#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const keys = [
  "XFORGE_PUB_BLOB_READ_WRITE_TOKEN",
  "XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN",
  "XFORGE_PUB_STORE_ID",
  "XFORGE_STORE_ID",
  "BLOB_READ_WRITE_TOKEN",
];
const files = [
  ".env.config",
  ".env.secret",
  ".env.local",
  "apps/app/.env.local",
];

function parseEnv(text) {
  const entries = new Map();
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(
      /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=(.*)$/
    );
    if (!match) continue;
    entries.set(
      match[1],
      match[2].trim().replace(/^["']|["']$/g, "")
    );
  }
  return entries;
}

function isSet(value) {
  return Boolean(value && value.trim());
}

console.log("Blob env presence (values not shown)\n");

for (const relativePath of files) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    console.log(`${relativePath}: (missing)`);
    continue;
  }

  const entries = parseEnv(fs.readFileSync(filePath, "utf8"));
  const status = keys
    .map((key) => `${key}=${isSet(entries.get(key)) ? "set" : "empty"}`)
    .join(", ");
  console.log(`${relativePath}: ${status}`);
}

const appLocal = parseEnv(
  fs.readFileSync(path.join(root, "apps/app/.env.local"), "utf8")
);
const secret = parseEnv(fs.readFileSync(path.join(root, ".env.secret"), "utf8"));

const missingInApp = [
  ["XFORGE_PUB_BLOB_READ_WRITE_TOKEN", secret.get("XFORGE_PUB_BLOB_READ_WRITE_TOKEN")],
  ["XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN", secret.get("XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN")],
  ["XFORGE_PUB_STORE_ID", secret.get("XFORGE_PUB_STORE_ID") ?? appLocal.get("XFORGE_PUB_STORE_ID")],
  ["XFORGE_STORE_ID", secret.get("XFORGE_STORE_ID") ?? appLocal.get("XFORGE_STORE_ID")],
].filter(([key, value]) => isSet(value) && !isSet(appLocal.get(key)));

if (missingInApp.length > 0) {
  console.log("\nAction: run `pnpm env:sync` — apps/app/.env.local missing:");
  for (const [key] of missingInApp) {
    console.log(`  - ${key}`);
  }
  process.exitCode = 1;
}
