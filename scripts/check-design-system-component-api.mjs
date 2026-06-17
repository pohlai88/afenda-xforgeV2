import {
  auditAfendaUiComponentDirectory,
  createComponentApiAuditRegistry,
  formatComponentApiAuditFinding,
} from "../packages/design-system/governance/component-api-audit.mjs";

const root = process.cwd();
const findings = auditAfendaUiComponentDirectory({
  registry: createComponentApiAuditRegistry(root),
  root,
});

if (findings.length) {
  console.error(findings.map(formatComponentApiAuditFinding).join("\n"));
  process.exit(1);
}

console.log("Design system component API checks passed.");
