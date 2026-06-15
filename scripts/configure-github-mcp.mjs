#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const LINE_BREAK = /\r?\n/;
const globalMcpPath = path.join(
  process.env.USERPROFILE ?? process.env.HOME ?? "",
  ".cursor",
  "mcp.json"
);
const secretPath = path.resolve(import.meta.dirname, "../.env.secret");

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

const secretText = fs.readFileSync(secretPath, "utf8");
const githubToken = parseToken(secretText, "GITHUB_TOKEN");
const context7ApiKey = parseToken(secretText, "CONTEXT7_API_KEY");

if (!githubToken) {
  console.error("GITHUB_TOKEN not found in .env.secret");
  process.exit(1);
}

const mcp = fs.existsSync(globalMcpPath)
  ? JSON.parse(fs.readFileSync(globalMcpPath, "utf8"))
  : { mcpServers: {} };

mcp.mcpServers.github = {
  url: "https://api.githubcopilot.com/mcp/",
  headers: {
    Authorization: `Bearer ${githubToken}`,
  },
};

if (context7ApiKey) {
  mcp.mcpServers.context7 = {
    url: "https://mcp.context7.com/mcp",
    headers: {
      CONTEXT7_API_KEY: context7ApiKey,
    },
  };
}

fs.writeFileSync(globalMcpPath, `${JSON.stringify(mcp, null, 2)}\n`);
console.log(
  "Configured github MCP" +
    (context7ApiKey ? " and context7 MCP" : "") +
    " in global ~/.cursor/mcp.json"
);
