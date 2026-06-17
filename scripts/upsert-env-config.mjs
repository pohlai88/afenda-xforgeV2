#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(repoRoot, ".env.config");
const key = process.argv[2];
const value = process.argv[3];

if (!key || !value) {
  console.error("Usage: node scripts/upsert-env-config.mjs KEY VALUE");
  process.exit(1);
}

if (!fs.existsSync(configPath)) {
  console.error("Missing .env.config");
  process.exit(1);
}

const lines = fs.readFileSync(configPath, "utf8").split(/\r?\n/);
const pattern = new RegExp(`^\\s*(?:export\\s+)?${key}\\s*=`);
let replaced = false;

const nextLines = lines.map((line) => {
  if (!pattern.test(line)) {
    return line;
  }
  replaced = true;
  return `${key}=${value}`;
});

if (!replaced) {
  nextLines.push(`${key}=${value}`);
}

fs.writeFileSync(configPath, `${nextLines.join("\n").replace(/\n?$/, "\n")}`);
console.log(`updated .env.config ${key}`);
