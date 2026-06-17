#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function tokenFrom(filePath) {
  if (!fs.existsSync(filePath)) return "";
  const match = fs.readFileSync(filePath, "utf8").match(/^BLOB_READ_WRITE_TOKEN=(.*)$/m);
  return match?.[1]?.trim().replace(/^["']|["']$/g, "") ?? "";
}

const files = {
  config: path.join(repoRoot, ".env.config"),
  secret: path.join(repoRoot, ".env.secret"),
  app: path.join(repoRoot, "apps/app/.env.local"),
};

for (const [name, filePath] of Object.entries(files)) {
  const token = tokenFrom(filePath);
  console.log(`${name}: len=${token.length} prefix=${token.slice(0, 16)}`);
}

const config = tokenFrom(files.config);
const secret = tokenFrom(files.secret);
const app = tokenFrom(files.app);
console.log(`config==secret: ${config === secret}`);
console.log(`secret==app: ${secret === app}`);
