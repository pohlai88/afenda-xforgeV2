#!/usr/bin/env node
/**
 * beforeShellExecution + beforeMCPExecution — only allow Drizzle migrations via
 * pnpm scripts (repair journal + drizzle-kit migrate). Blocks manual SQL apply,
 * direct drizzle-kit migrate/push, and Supabase apply_migration MCP.
 */
import { emit, log, parseStdinJson } from "./_hook-utils.mjs";

const TAG = "guard-drizzle-migrate";

const DENY_SHELL = {
  permission: "deny",
  user_message:
    "Database schema changes must use the repo Drizzle workflow: pnpm migrate (or pnpm --filter @repo/database db:migrate). Manual SQL / direct drizzle-kit migrate / MCP apply_migration are blocked.",
  agent_message:
    "Blocked non-Drizzle migration path. Use: pnpm migrate | pnpm --filter @repo/database db:migrate | db:repair-journal (repair only) | db:generate (generate only). Read-only: compare-migrations.mjs, db-migration-status.mjs.",
};

const DENY_MCP = {
  permission: "deny",
  user_message:
    "Supabase MCP apply_migration is blocked. Use pnpm migrate so migrations run through Drizzle journal repair + drizzle-kit migrate.",
  agent_message:
    "Blocked Supabase apply_migration. Use pnpm migrate or pnpm --filter @repo/database db:migrate instead of MCP DDL apply.",
};

const normalizeCommand = (command) =>
  command.trim().replace(/\s+/g, " ").replace(/\\\\/g, "/");

const isReadOnlyMigrationAudit = (command) =>
  /packages[/\\]database[/\\]scripts[/\\](compare-migrations|db-migration-status|list-migration-hashes)\.mjs/.test(
    command
  );

const isAllowedRepairJournal = (command) =>
  /pnpm\s+--filter\s+@repo\/database\s+db:repair-journal(:check)?(\s|$)/.test(
    command
  ) ||
  (/repair-drizzle-journal\.mjs/.test(command) &&
    !/\bdrizzle-kit\s+migrate\b/.test(command));

const isAllowedShellMigration = (command) => {
  const normalized = normalizeCommand(command);

  if (/^pnpm(\s+run\s+)?migrate(:deploy)?(\s|$)/.test(normalized)) {
    return true;
  }

  if (
    /pnpm\s+--filter\s+@repo\/database\s+db:(migrate|generate)(\s|$)/.test(
      normalized
    )
  ) {
    return true;
  }

  if (isAllowedRepairJournal(normalized)) {
    return true;
  }

  if (isReadOnlyMigrationAudit(normalized)) {
    return true;
  }

  return false;
};

const isBlockedShellMigration = (command) => {
  if (!command) {
    return false;
  }

  const normalized = normalizeCommand(command);

  if (isAllowedShellMigration(normalized)) {
    return false;
  }

  if (/\bdrizzle-kit\s+migrate\b/.test(normalized)) {
    return true;
  }

  if (/\bdrizzle-kit\s+push\b/.test(normalized)) {
    return true;
  }

  if (/\bapply-orbit-migrations\.mjs\b/.test(normalized)) {
    return true;
  }

  if (
    /\bpsql\b[\s\S]*packages[/\\]database[/\\]drizzle[/\\][\w-]+\.sql/.test(
      normalized
    )
  ) {
    return true;
  }

  if (
    /\bnode\b[\s\S]*packages[/\\]database[/\\]drizzle[/\\][\w-]+\.sql/.test(
      normalized
    )
  ) {
    return true;
  }

  if (
    /\bnode\b[\s\S]*packages[/\\]database[/\\]scripts[/\\][\w-]+\.mjs/.test(
      normalized
    ) &&
    /packages[/\\]database[/\\]drizzle[/\\]00\d{2}_/.test(normalized)
  ) {
    return true;
  }

  if (
    /\b(pool\.query|execute_sql|\.query\s*\()\b[\s\S]*packages[/\\]database[/\\]drizzle/.test(
      normalized
    )
  ) {
    return true;
  }

  return false;
};

const isBlockedMcpMigration = (input) => {
  const serverName = String(
    input.server ?? input.mcp_server ?? input.serverName ?? ""
  ).toLowerCase();
  const toolName = String(
    input.tool_name ?? input.toolName ?? input.name ?? input.mcp_tool ?? ""
  ).toLowerCase();

  if (toolName === "apply_migration") {
    return true;
  }

  if (toolName === "execute_sql" && /supabase/.test(serverName)) {
    const args = input.arguments ?? input.args ?? {};
    const query = String(args.query ?? args.sql ?? "").toLowerCase();

    if (!query) {
      return false;
    }

    const migrationLedger =
      /__drizzle_migrations|drizzle\.__drizzle_migrations/.test(query);
    const ddl =
      /\b(create|alter|drop|truncate)\b[\s\S]*\b(table|schema|function|index|policy|trigger|type)\b/.test(
        query
      );

    if (migrationLedger || ddl) {
      return true;
    }
  }

  return false;
};

const input = parseStdinJson();

if (input === null) {
  log(TAG, "invalid stdin JSON; allowing");
  emit({ permission: "allow" });
  process.exit(0);
}

const command = typeof input.command === "string" ? input.command : "";
const toolName = String(
  input.tool_name ?? input.toolName ?? input.name ?? input.mcp_tool ?? ""
);

if (command && isBlockedShellMigration(command)) {
  log(TAG, `blocked shell: ${normalizeCommand(command).slice(0, 120)}`);
  emit(DENY_SHELL);
  process.exit(0);
}

if (toolName && isBlockedMcpMigration(input)) {
  log(TAG, `blocked MCP: ${toolName}`);
  emit(DENY_MCP);
  process.exit(0);
}

emit({ permission: "allow" });
process.exit(0);
