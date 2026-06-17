#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const keys = [
  "BLOB_READ_WRITE_TOKEN",
  "XFORGE_PUB_BLOB_READ_WRITE_TOKEN",
  "XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN",
  "XFROGE_READ_WRITE_TOKEN",
  "XFORGE_PUB_STORE_ID",
  "XFORGE_STORE_ID",
  "XFROGE_STORE_ID",
  "BLOB_STORE_ID",
];

for (const file of [".env.config", ".env.secret", ".env.local", "apps/app/.env.local"]) {
  const filePath = path.join(repoRoot, file);
  if (!fs.existsSync(filePath)) continue;
  console.log(`\n${file}:`);
  const text = fs.readFileSync(filePath, "utf8");
  for (const key of keys) {
    const match = text.match(new RegExp(`^${key}=(.*)$`, "m"));
    if (!match) {
      console.log(`  ${key}: (missing)`);
      continue;
    }
    const value = match[1].trim().replace(/^["']|["']$/g, "");
    console.log(`  ${key}: set (len=${value.length}, prefix=${value.slice(0, 20)}…)`);
  }
}
