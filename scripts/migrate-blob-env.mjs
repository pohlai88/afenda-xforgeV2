#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(repoRoot, ".env.config");
const secretPath = path.join(repoRoot, ".env.secret");

function parseEnv(text) {
  const entries = new Map();
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(
      /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=(.*)$/
    );
    if (!match) continue;
    entries.set(match[1], match[2].trim());
  }
  return entries;
}

function strip(value) {
  return value.trim().replace(/^["']|["']$/g, "");
}

function quote(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') || trimmed.startsWith("'")) {
    return trimmed;
  }
  return `"${trimmed}"`;
}

function writeEnv(filePath, entries, order) {
  const keys = order.length > 0 ? order : Array.from(entries.keys());
  const uniqueKeys = [...new Set(keys.filter((key) => entries.has(key)))];
  const lines = uniqueKeys.map((key) => `${key}=${entries.get(key)}`);
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`);
}

const config = parseEnv(fs.readFileSync(configPath, "utf8"));
const secret = parseEnv(fs.readFileSync(secretPath, "utf8"));

const configBlob = config.get("BLOB_READ_WRITE_TOKEN");
const privateToken =
  config.get("XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN") ??
  config.get("XFROGE_READ_WRITE_TOKEN");

if (configBlob && strip(configBlob).includes("dGy99ePfbZPbbLWk")) {
  secret.set("XFORGE_PUB_BLOB_READ_WRITE_TOKEN", quote(strip(configBlob)));
  config.delete("BLOB_READ_WRITE_TOKEN");
  console.log("migrated public blob token → .env.secret XFORGE_PUB_BLOB_READ_WRITE_TOKEN");
}

if (privateToken) {
  secret.set(
    "XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN",
    quote(strip(privateToken))
  );
  config.delete("XFROGE_READ_WRITE_TOKEN");
  config.delete("XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN");
  console.log("migrated private blob token → .env.secret XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN");
}

if (config.has("XFROGE_STORE_ID") && config.has("XFORGE_STORE_ID")) {
  config.delete("XFROGE_STORE_ID");
  console.log("removed duplicate XFROGE_STORE_ID from .env.config");
}

writeEnv(secretPath, secret, [
  ...Array.from(secret.keys()).filter((key) => ![
    "XFORGE_PUB_BLOB_READ_WRITE_TOKEN",
    "XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN",
    "BLOB_READ_WRITE_TOKEN",
  ].includes(key)),
  "XFORGE_PUB_BLOB_READ_WRITE_TOKEN",
  "XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN",
  "BLOB_READ_WRITE_TOKEN",
]);

writeEnv(configPath, config, Array.from(config.keys()));
console.log("done — run pnpm env:sync");
