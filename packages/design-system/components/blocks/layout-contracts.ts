type AfendaBlockFamily =
  | "page-header"
  | "filter-bar"
  | "data-table-shell"
  | "entity-summary-panel"
  | "audit-trail-panel"
  | "stats-strip"
  | "empty-panel"
  | "form-section";

interface AfendaBlockLayoutContract {
  readonly allowedPrimitiveFamilies: readonly string[];
  readonly anatomy: readonly string[];
  readonly notes: readonly string[];
  readonly purpose: string;
  readonly requiredRecipes: readonly string[];
}

const afendaBlockLayoutContracts = {
  "page-header": {
    purpose: "Orient the operator to the current workspace, record, or module.",
    anatomy: [
      "blockShell",
      "blockHeader",
      "blockHeaderContent",
      "blockToolbar",
    ],
    requiredRecipes: [
      "blockShell",
      "blockHeader",
      "blockTitle",
      "blockDescription",
    ],
    allowedPrimitiveFamilies: ["button", "badge", "breadcrumb", "tabs"],
    notes: [
      "Do not own page max-width.",
      "Actions belong in blockToolbar, not inside title text.",
    ],
  },
  "filter-bar": {
    purpose: "Collect reversible filters and table-local view controls.",
    anatomy: ["blockPanel", "blockPanelPadding", "blockToolbar"],
    requiredRecipes: ["blockPanel", "blockToolbar"],
    allowedPrimitiveFamilies: ["button", "input", "select", "popover", "badge"],
    notes: [
      "Filters are quiet actions, not primary decisions.",
      "Do not embed destructive actions in filter bars.",
    ],
  },
  "data-table-shell": {
    purpose:
      "Wrap evidence tables with title, controls, table, and pagination.",
    anatomy: [
      "blockPanel",
      "blockHeader",
      "blockToolbar",
      "table",
      "pagination",
    ],
    requiredRecipes: ["blockPanel", "blockHeader", "blockToolbar"],
    allowedPrimitiveFamilies: [
      "table",
      "button",
      "checkbox",
      "badge",
      "pagination",
    ],
    notes: [
      "Table owns rows and cells; shell owns context and controls.",
      "Bulk action state must be explicit and reversible.",
    ],
  },
  "entity-summary-panel": {
    purpose:
      "Summarize one record, tenant, employee, invoice, or workflow object.",
    anatomy: ["blockPanel", "blockHeader", "blockSection", "blockMetric"],
    requiredRecipes: ["blockPanel", "blockHeader", "blockSection"],
    allowedPrimitiveFamilies: ["badge", "item", "separator", "button"],
    notes: [
      "Summary panels are metadata surfaces, not editable forms.",
      "Use field primitives only when the panel is explicitly editable.",
    ],
  },
  "audit-trail-panel": {
    purpose:
      "Present irreversible history, evidence, and operator accountability.",
    anatomy: ["blockPanel", "blockHeader", "blockSection"],
    requiredRecipes: ["blockPanel", "blockHeader", "blockSectionDivider"],
    allowedPrimitiveFamilies: ["table", "item", "badge", "separator"],
    notes: [
      "Audit rows must preserve time, actor, target, and outcome.",
      "Do not use toast or transient UI for audit-critical details.",
    ],
  },
  "stats-strip": {
    purpose:
      "Expose compact operational pressure, counts, SLA, and exceptions.",
    anatomy: ["blockShell", "blockSection", "blockMetric", "blockMetricLabel"],
    requiredRecipes: ["blockShell", "blockMetric", "blockMetricLabel"],
    allowedPrimitiveFamilies: ["badge", "progress", "separator"],
    notes: [
      "Prefer tabular numbers.",
      "Do not replace evidence tables with metric strips.",
    ],
  },
  "empty-panel": {
    purpose: "Explain absence of data and provide the next safe action.",
    anatomy: ["blockEmpty", "blockTitle", "blockDescription", "blockToolbar"],
    requiredRecipes: ["blockEmpty", "blockTitle", "blockDescription"],
    allowedPrimitiveFamilies: ["empty", "button"],
    notes: [
      "Only one primary action is allowed.",
      "Empty panels must explain whether the state is expected or exceptional.",
    ],
  },
  "form-section": {
    purpose:
      "Group related fields with label, hint, error, and audit-safe rhythm.",
    anatomy: ["blockPanel", "blockHeader", "blockSection"],
    requiredRecipes: ["blockPanel", "blockHeader", "blockSection"],
    allowedPrimitiveFamilies: [
      "field",
      "input",
      "textarea",
      "select",
      "checkbox",
    ],
    notes: [
      "Field owns label-control-hint-error grammar.",
      "Form section owns grouping and hierarchy only.",
    ],
  },
} as const satisfies Record<AfendaBlockFamily, AfendaBlockLayoutContract>;

export { afendaBlockLayoutContracts };
export type { AfendaBlockFamily, AfendaBlockLayoutContract };
