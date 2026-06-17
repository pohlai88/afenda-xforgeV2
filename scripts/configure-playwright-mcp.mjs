#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const projectMcpPath = path.join(repoRoot, ".cursor", "mcp.json");
const mcpConfigPath = "apps/app/e2e/playwright-mcp.config.json";

const playwrightMcp = {
  command: "npx",
  args: ["-y", "@playwright/mcp@latest", "--config", mcpConfigPath],
};

const mcp = fs.existsSync(projectMcpPath)
  ? JSON.parse(fs.readFileSync(projectMcpPath, "utf8"))
  : { mcpServers: {} };

mcp.mcpServers.playwright = playwrightMcp;

fs.mkdirSync(path.dirname(projectMcpPath), { recursive: true });
fs.writeFileSync(projectMcpPath, `${JSON.stringify(mcp, null, 2)}\n`);

console.log("Configured playwright MCP in .cursor/mcp.json");
console.log(`  config: ${mcpConfigPath}`);
console.log("  base URL: http://localhost:3000 (start `pnpm --filter app dev` first)");
console.log("");
console.log("Reload MCP in Cursor Settings → MCP after saving.");
