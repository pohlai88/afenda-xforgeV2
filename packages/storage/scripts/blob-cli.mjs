#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { del, get, put } from "@vercel/blob";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(packageRoot, "../..");

function loadEnv(filePath, { overwrite = false } = {}) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(
      /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=(.*)$/
    );
    if (!match) {
      continue;
    }

    if (!overwrite && process.env[match[1]]) {
      continue;
    }

    process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
}

for (const relativePath of [".env.config", ".env.secret", "apps/app/.env.local"]) {
  loadEnv(path.join(repoRoot, relativePath), { overwrite: true });
}

const resolvePublicBlobToken = () =>
  process.env.XFORGE_PUB_BLOB_READ_WRITE_TOKEN ??
  process.env.BLOB_READ_WRITE_TOKEN;

const resolvePrivateBlobToken = () =>
  process.env.XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN ??
  process.env.XFROGE_READ_WRITE_TOKEN ??
  process.env.BLOB_READ_WRITE_TOKEN;

const command = process.argv[2] ?? "help";

if (command === "probe-public") {
  const token = resolvePublicBlobToken();
  const storeId = process.env.XFORGE_PUB_STORE_ID;
  if (!token || !storeId) {
    console.error("Missing XFORGE_PUB_BLOB_READ_WRITE_TOKEN or XFORGE_PUB_STORE_ID");
    process.exit(1);
  }

  const blob = await put(`diagnostics/${Date.now()}-public-probe.txt`, "public probe", {
    access: "public",
    contentType: "text/plain",
    storeId,
    token,
  });
  console.log("Public upload ok:", blob.url);
  await del(blob.pathname, { storeId, token });
  console.log("Public delete ok");
  process.exit(0);
}

if (command === "probe-private") {
  const token = resolvePrivateBlobToken();
  const storeId = process.env.XFORGE_STORE_ID ?? process.env.XFROGE_STORE_ID;
  if (!token || !storeId) {
    console.error(
      "Missing XFORGE_PRIVATE_BLOB_READ_WRITE_TOKEN or XFORGE_STORE_ID"
    );
    process.exit(1);
  }

  const blob = await put(`diagnostics/${Date.now()}-private-probe.txt`, "private probe", {
    access: "private",
    contentType: "text/plain",
    storeId,
    token,
  });
  console.log("Private upload ok:", blob.url);

  const file = await get(blob.url, { access: "private", token });
  if (!file?.stream) {
    console.error("Private read failed");
    process.exit(1);
  }
  console.log("Private read ok");

  await del(blob.pathname, { storeId, token });
  console.log("Private delete ok");
  process.exit(0);
}

console.error("Usage: node scripts/blob-cli.mjs [probe-public|probe-private]");
process.exit(1);
