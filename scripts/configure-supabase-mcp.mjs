#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const LINE_BREAK = /\r?\n/;
const globalMcpPath = path.join(
  process.env.USERPROFILE ?? process.env.HOME ?? "",
  ".cursor",
  "mcp.json"
);
const envPath = path.resolve(import.meta.dirname, "../.env");
const secretPath = path.resolve(import.meta.dirname, "../.env.secret");

const DEFAULT_FEATURES = [
  "docs",
  "database",
  "debugging",
  "development",
  "functions",
  "branching",
  "storage",
];

function parseToken(text, key) {
  for (const line of text.split(LINE_BREAK)) {
    const match = line.match(
      new RegExp(`^\\s*(?:export\\s+)?${key}\\s*=(.*)$`)
    );
    if (match) {
      return match[1].trim().replace(/^["']|["']$/g, "");
    }
  }

  return "";
}

function readEnvFile(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

const envText = readEnvFile(envPath);
const secretText = readEnvFile(secretPath);
const projectRef =
  parseToken(envText, "SUPABASE_PROJECT_ID") ||
  parseToken(secretText, "SUPABASE_PROJECT_ID");
const accessToken = parseToken(secretText, "SUPABASE_ACCESS_TOKEN");

if (!projectRef) {
  console.error(
    "SUPABASE_PROJECT_ID not found in .env or .env.secret. Run `pnpm env:sync` first."
  );
  process.exit(1);
}

const features = DEFAULT_FEATURES.join(",");
const url = `https://mcp.supabase.com/mcp?project_ref=${projectRef}&features=${encodeURIComponent(features)}`;

const supabaseMcp = {
  type: "http",
  url,
};

if (accessToken) {
  supabaseMcp.headers = {
    Authorization: `Bearer ${accessToken}`,
  };
}

const mcp = fs.existsSync(globalMcpPath)
  ? JSON.parse(fs.readFileSync(globalMcpPath, "utf8"))
  : { mcpServers: {} };

mcp.mcpServers.supabase = supabaseMcp;

fs.writeFileSync(globalMcpPath, `${JSON.stringify(mcp, null, 2)}\n`);

console.log(`Configured supabase MCP in global ~/.cursor/mcp.json`);
console.log(`  project_ref: ${projectRef}`);
console.log(
  accessToken
    ? "  auth: personal access token from .env.secret"
    : "  auth: OAuth (complete login in Cursor on first connect)"
);
console.log(`  features: ${features}`);
console.log("");
console.log(
  "MCP auth gap: no get_auth_config tool. Use `pnpm supabase:auth-config` or Supabase CLI + supabase/config.toml."
);
