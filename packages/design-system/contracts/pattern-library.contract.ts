const afendaPatternIds = [
  "approval-review",
  "batch-posting",
  "primary-detail",
  "audit-log-viewer",
  "exception-handling",
  "bulk-selection",
  "data-reconciliation",
  "policy-lock",
  "long-running-job",
] as const;

const afendaPatternStateValues = [
  "idle",
  "loading",
  "empty",
  "error",
  "partial",
  "conflict",
  "offline",
  "forbidden",
  "readonly",
  "success",
  "stale",
] as const;

type AfendaPatternId = (typeof afendaPatternIds)[number];
type AfendaPatternState = (typeof afendaPatternStateValues)[number];

type AfendaPatternBlockFamily =
  | "advanced"
  | "foundation"
  | "metadata"
  | "operator"
  | "workflow";

interface AfendaPatternBlockRequirement {
  readonly family: AfendaPatternBlockFamily;
  readonly name: string;
  readonly role: string;
}

interface AfendaPatternDefinition<
  TId extends AfendaPatternId = AfendaPatternId,
> {
  readonly auditRule: string;
  readonly description: string;
  readonly evidenceRule: string;
  readonly id: TId;
  readonly name: string;
  readonly requiredBlocks: readonly AfendaPatternBlockRequirement[];
  readonly requiredStates: readonly AfendaPatternState[];
  readonly riskRule: string;
  readonly whenToUse: string;
}

type AfendaPatternLibrary = {
  readonly [TId in AfendaPatternId]: AfendaPatternDefinition<TId>;
};

const afendaPatternLibrary = {
  "approval-review": {
    auditRule:
      "Every approve, reject, request-change, and delegate action records actor, policy, reason, and evidence scope.",
    description:
      "Review, approve, reject, or return operational records with visible evidence and policy context.",
    evidenceRule:
      "Show row evidence, SLA, policy reason, approver chain, and missing evidence inline with the decision surface.",
    id: "approval-review",
    name: "Approval review",
    requiredBlocks: [
      { family: "foundation", name: "PageHeader", role: "Scope and status" },
      { family: "advanced", name: "ApprovalQueueBlock", role: "Dense queue" },
      { family: "advanced", name: "RiskEvidencePanel", role: "Evidence" },
      {
        family: "operator",
        name: "PermissionActionToolbar",
        role: "Governed decisions",
      },
    ],
    requiredStates: ["loading", "empty", "error", "forbidden", "readonly"],
    riskRule:
      "Denied approvals remain visible as disabled actions with exact reason; hidden blocks are reserved for sensitive policy scope.",
    whenToUse:
      "Use when an operator must make or inspect a policy-governed decision before posting or changing a record.",
  },
  "audit-log-viewer": {
    auditRule:
      "Audit rows are immutable, chronological, and preserve event id, source, actor, target, hash, and retention metadata.",
    description:
      "Inspect immutable event trails without mixing audit evidence with transient notifications.",
    evidenceRule:
      "Use direct event rows and filters; avoid decorative charts unless they answer a specific audit question.",
    id: "audit-log-viewer",
    name: "Audit log viewer",
    requiredBlocks: [
      { family: "foundation", name: "FilterBar", role: "Event filters" },
      { family: "operator", name: "AuditTrailPanel", role: "Audit trail" },
      {
        family: "operator",
        name: "ImmutableAuditTimeline",
        role: "Evidence trail",
      },
    ],
    requiredStates: ["loading", "empty", "error", "partial", "forbidden"],
    riskRule:
      "Do not use toast or optimistic UI as the audit record; audit events must be persisted by the app layer.",
    whenToUse:
      "Use when users need to inspect what happened, who did it, and why it is allowed.",
  },
  "batch-posting": {
    auditRule:
      "Posting, hold, release, retry, and rollback actions emit batch-scoped audit events with selected-count and policy state.",
    description:
      "Review a batch before posting, including validation state, failed rows, locks, and reversible operations.",
    evidenceRule:
      "Show validation summary, failed row evidence, policy locks, totals, and posting readiness before the primary action.",
    id: "batch-posting",
    name: "Batch posting",
    requiredBlocks: [
      {
        family: "workflow",
        name: "BatchPostingReview",
        role: "Posting workspace",
      },
      { family: "foundation", name: "StatsStrip", role: "Batch metrics" },
      { family: "operator", name: "BulkActionBar", role: "Batch actions" },
      { family: "advanced", name: "RiskEvidencePanel", role: "Validation" },
    ],
    requiredStates: ["loading", "empty", "error", "partial", "conflict"],
    riskRule:
      "Primary posting is disabled until failed validation, missing evidence, policy lock, and stale-source states are resolved.",
    whenToUse:
      "Use when an operator posts many records and needs confidence before committing changes.",
  },
  "bulk-selection": {
    auditRule:
      "Bulk actions include selected count, reversible or confirmation state, audit scope, and disabled reason.",
    description:
      "Select, review, confirm, apply, and undo actions across dense operational rows.",
    evidenceRule:
      "Keep selection visible in the table and action bar; never hide affected-count or undo window.",
    id: "bulk-selection",
    name: "Bulk selection",
    requiredBlocks: [
      { family: "operator", name: "DataTableShell", role: "Selectable rows" },
      {
        family: "operator",
        name: "BulkActionBar",
        role: "Selection controls",
      },
      {
        family: "advanced",
        name: "ReversibleBulkActionBar",
        role: "Confirm and undo",
      },
    ],
    requiredStates: ["empty", "error", "forbidden", "readonly", "success"],
    riskRule:
      "Destructive bulk actions require confirmation and must remain reversible when business policy allows.",
    whenToUse:
      "Use when a repeated action applies to more than one row in a governed table.",
  },
  "data-reconciliation": {
    auditRule:
      "Match, unmatch, accept variance, and retry-source actions include source versions and variance reason.",
    description:
      "Compare two or more sources, resolve variance, and keep partial-source failures visible.",
    evidenceRule:
      "Show source freshness, matched rows, exceptions, variance values, and per-source retry affordances.",
    id: "data-reconciliation",
    name: "Data reconciliation",
    requiredBlocks: [
      { family: "foundation", name: "StatsStrip", role: "Variance summary" },
      { family: "operator", name: "DataTableShell", role: "Matched rows" },
      {
        family: "advanced",
        name: "RiskEvidencePanel",
        role: "Exception evidence",
      },
      { family: "metadata", name: "MetadataPageRenderer", role: "Sources" },
    ],
    requiredStates: ["loading", "empty", "error", "partial", "stale"],
    riskRule:
      "Partial data must render successful sources and mark failed sources inline; one failed feed must not blank the workspace.",
    whenToUse:
      "Use when finance, inventory, or compliance data must be matched across systems.",
  },
  "exception-handling": {
    auditRule:
      "Exception open, assign, waive, approve, and close events record policy, owner, reason, and expiry where relevant.",
    description:
      "Triage policy exceptions with owner, severity, due time, evidence, and explicit resolution path.",
    evidenceRule:
      "Show policy, scope, owner, severity, due time, supporting evidence, and available resolution actions.",
    id: "exception-handling",
    name: "Exception handling",
    requiredBlocks: [
      {
        family: "operator",
        name: "EntitySummaryPanel",
        role: "Exception summary",
      },
      {
        family: "operator",
        name: "PolicyExceptionSummary",
        role: "Policy details",
      },
      {
        family: "foundation",
        name: "FormSection",
        role: "Resolution reason",
      },
    ],
    requiredStates: ["loading", "empty", "error", "forbidden", "readonly"],
    riskRule:
      "Resolution actions are disabled until required reason, owner, and evidence fields are complete.",
    whenToUse:
      "Use when business policy permits an override but requires explanation and traceability.",
  },
  "long-running-job": {
    auditRule:
      "Start, cancel, retry, complete, and fail events include job id, actor, progress, and affected scope.",
    description:
      "Track background operations such as posting, import, export, reconciliation, or evidence sync.",
    evidenceRule:
      "Show current phase, progress, last event, retry/cancel rules, and affected records without blocking unrelated work.",
    id: "long-running-job",
    name: "Long-running job state",
    requiredBlocks: [
      {
        family: "foundation",
        name: "PageHeader",
        role: "Operation identity",
      },
      {
        family: "operator",
        name: "StatusTimeline",
        role: "Job events",
      },
      {
        family: "advanced",
        name: "RuntimeStateBlock",
        role: "Progress and failure",
      },
    ],
    requiredStates: ["idle", "loading", "error", "partial", "success"],
    riskRule:
      "Cancellation and retry must declare whether the operation is idempotent, reversible, or already committed.",
    whenToUse:
      "Use when an operation may outlive the current page interaction or has multiple server-side phases.",
  },
  "policy-lock": {
    auditRule:
      "Lock, unlock, request access, and override events record policy id, scope, actor, reason, and expiry.",
    description:
      "Show why a record or tenant is locked, who can unlock it, and what evidence is required.",
    evidenceRule:
      "Show lock reason, policy id, owner, expiry, affected actions, and unlock requirements.",
    id: "policy-lock",
    name: "Policy lock / unlock",
    requiredBlocks: [
      {
        family: "workflow",
        name: "PolicyLockManager",
        role: "Lock workspace",
      },
      {
        family: "operator",
        name: "PermissionActionToolbar",
        role: "Unlock controls",
      },
      {
        family: "advanced",
        name: "RiskEvidencePanel",
        role: "Lock evidence",
      },
    ],
    requiredStates: ["forbidden", "readonly", "error", "conflict"],
    riskRule:
      "Locked actions remain visible but disabled unless policy says the whole block must be hidden.",
    whenToUse:
      "Use when policy intentionally prevents changes until a governed unlock path is satisfied.",
  },
  "primary-detail": {
    auditRule:
      "Detail actions keep the primary row id and active scope in their audit payload.",
    description:
      "Navigate dense lists while keeping selected-record evidence, summary, and actions in view.",
    evidenceRule:
      "Show selected row identity, summary fields, audit/evidence panel, and back-to-list affordance on narrow screens.",
    id: "primary-detail",
    name: "Master-detail / primary-detail",
    requiredBlocks: [
      { family: "operator", name: "DataTableShell", role: "Primary list" },
      {
        family: "operator",
        name: "EntitySummaryPanel",
        role: "Selected record",
      },
      {
        family: "operator",
        name: "RowEvidencePanel",
        role: "Detail evidence",
      },
    ],
    requiredStates: ["loading", "empty", "error", "forbidden", "readonly"],
    riskRule:
      "Selection changes must not discard dirty detail edits, conflict warnings, or queued offline changes.",
    whenToUse:
      "Use when operators repeatedly scan a list and inspect or act on one selected record.",
  },
} as const satisfies AfendaPatternLibrary;

const afendaPatternLibraryEntries = afendaPatternIds.map(
  (id) => afendaPatternLibrary[id]
);

export {
  afendaPatternIds,
  afendaPatternLibrary,
  afendaPatternLibraryEntries,
  afendaPatternStateValues,
};
export type {
  AfendaPatternBlockFamily,
  AfendaPatternBlockRequirement,
  AfendaPatternDefinition,
  AfendaPatternId,
  AfendaPatternLibrary,
  AfendaPatternState,
};
