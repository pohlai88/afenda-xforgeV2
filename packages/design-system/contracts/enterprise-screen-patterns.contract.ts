const enterpriseScreenPatternIds = [
  "approval-operations-screen",
  "batch-posting-screen",
  "tenant-master-detail-screen",
  "audit-evidence-review-screen",
  "policy-lock-administration-screen",
  "reconciliation-workspace-screen",
  "exception-triage-screen",
  "long-running-job-monitor-screen",
] as const;

const enterpriseScreenPatternStateValues = [
  "first-use",
  "ready",
  "filtered-empty",
  "loading",
  "partial",
  "stale",
  "error",
  "forbidden",
  "readonly",
  "conflict",
  "offline",
] as const;

const enterpriseScreenPatternGateValues = [
  "typecheck",
  "storybook",
  "accessibility",
  "visual-baseline",
  "overflow",
  "diagnostics",
  "audit-payload",
] as const;

type EnterpriseScreenPatternId = (typeof enterpriseScreenPatternIds)[number];
type EnterpriseScreenPatternState =
  (typeof enterpriseScreenPatternStateValues)[number];
type EnterpriseScreenPatternGate =
  (typeof enterpriseScreenPatternGateValues)[number];

type EnterpriseScreenPatternDensity = "comfortable" | "dense" | "split-pane";
type EnterpriseScreenPatternOwner =
  | "app-team"
  | "design-system"
  | "domain-team";

interface EnterpriseScreenPatternDefinition<
  TId extends EnterpriseScreenPatternId = EnterpriseScreenPatternId,
> {
  readonly anatomy: readonly string[];
  readonly blocks: readonly string[];
  readonly density: EnterpriseScreenPatternDensity;
  readonly description: string;
  readonly do: readonly string[];
  readonly dont: readonly string[];
  readonly gates: readonly EnterpriseScreenPatternGate[];
  readonly id: TId;
  readonly name: string;
  readonly owner: EnterpriseScreenPatternOwner;
  readonly states: readonly EnterpriseScreenPatternState[];
  readonly whenToUse: string;
}

type EnterpriseScreenPatternCatalog = {
  readonly [TId in EnterpriseScreenPatternId]: EnterpriseScreenPatternDefinition<TId>;
};

const baselineGates = [
  "typecheck",
  "storybook",
  "accessibility",
  "visual-baseline",
  "overflow",
] as const satisfies readonly EnterpriseScreenPatternGate[];

const governedActionGates = [
  ...baselineGates,
  "diagnostics",
  "audit-payload",
] as const satisfies readonly EnterpriseScreenPatternGate[];

const enterpriseScreenPatterns = {
  "approval-operations-screen": {
    anatomy: [
      "Page header with tenant, period, and approval scope",
      "Stats strip for SLA, ready-to-post, and audit event pressure",
      "Filter bar with search, risk, tenant, and SLA filters",
      "Approval queue with row evidence and governed decision actions",
      "Evidence panel for selected row risk, policy, and audit context",
    ],
    blocks: [
      "PageHeader",
      "StatsStrip",
      "FilterBar",
      "ApprovalQueueBlock",
      "RiskEvidencePanel",
      "PermissionActionToolbar",
    ],
    density: "split-pane",
    description:
      "A screen for reviewing tenant-scoped approvals with evidence, policy status, and reversible governed actions.",
    do: [
      "Keep denied decisions visible with exact disabled reason.",
      "Preserve selection and evidence while filters change.",
      "Show row-level policy and SLA pressure before the action surface.",
    ],
    dont: [
      "Do not hide approval risk inside decorative charts.",
      "Do not post changes without audit reason and evidence scope.",
      "Do not clear dirty decision notes when the selected row changes.",
    ],
    gates: governedActionGates,
    id: "approval-operations-screen",
    name: "Approval operations screen",
    owner: "domain-team",
    states: [
      "ready",
      "filtered-empty",
      "loading",
      "partial",
      "forbidden",
      "readonly",
      "conflict",
    ],
    whenToUse:
      "Use when operators review policy-governed changes before posting or committing operational records.",
  },
  "audit-evidence-review-screen": {
    anatomy: [
      "Page header with entity, retention, and evidence scope",
      "Filter bar for actor, event type, time range, and source",
      "Immutable audit timeline or audit table",
      "Selected event evidence panel",
      "Metadata diagnostics panel in dev or Storybook only",
    ],
    blocks: [
      "PageHeader",
      "FilterBar",
      "ImmutableAuditTimeline",
      "AuditTrailPanel",
      "RowEvidencePanel",
      "MetadataPageRenderer",
    ],
    density: "dense",
    description:
      "A screen for inspecting immutable events and attached evidence without mixing audit records with transient notifications.",
    do: [
      "Render partial source failures inline instead of blanking the audit view.",
      "Keep event ids, actor, source, and timestamp visible.",
      "Use filtered-empty copy for no matching events after search.",
    ],
    dont: [
      "Do not use toast as the audit record.",
      "Do not make audit rows editable.",
      "Do not hide forbidden evidence without a policy reason.",
    ],
    gates: governedActionGates,
    id: "audit-evidence-review-screen",
    name: "Audit evidence review screen",
    owner: "domain-team",
    states: [
      "ready",
      "filtered-empty",
      "loading",
      "partial",
      "error",
      "forbidden",
    ],
    whenToUse:
      "Use when compliance, finance, or operations teams need to answer what changed, who changed it, and why it was allowed.",
  },
  "batch-posting-screen": {
    anatomy: [
      "Page header with batch identity and posting window",
      "Validation stats and blocked-row summary",
      "Dense table of posting records with failures and warnings",
      "Bulk selection and reversible posting actions",
      "Evidence panel for failed validation and policy locks",
    ],
    blocks: [
      "BatchPostingReview",
      "StatsStrip",
      "AdvancedDataTable",
      "ReversibleBulkActionBar",
      "RiskEvidencePanel",
    ],
    density: "dense",
    description:
      "A screen for validating, selecting, posting, holding, retrying, or rolling back operational batches.",
    do: [
      "Show selected count across pages when bulk selection spans pagination.",
      "Disable posting until validation, stale sources, and locks are resolved.",
      "Keep rollback or undo affordance visible when policy allows reversibility.",
    ],
    dont: [
      "Do not use integrated table select-all when a toolbar bulk selector is present.",
      "Do not hide failed rows after successful rows validate.",
      "Do not start a long-running job without state and audit visibility.",
    ],
    gates: governedActionGates,
    id: "batch-posting-screen",
    name: "Batch posting screen",
    owner: "domain-team",
    states: [
      "ready",
      "filtered-empty",
      "loading",
      "partial",
      "error",
      "conflict",
    ],
    whenToUse:
      "Use when users need confidence and traceability before committing many records.",
  },
  "exception-triage-screen": {
    anatomy: [
      "Page header with exception queue scope",
      "Filter bar for severity, owner, due time, and policy",
      "Exception table or queue",
      "Entity summary for selected exception",
      "Resolution form section with governed actions",
    ],
    blocks: [
      "PageHeader",
      "FilterBar",
      "DataTableShell",
      "EntitySummaryPanel",
      "PolicyExceptionSummary",
      "FormSection",
    ],
    density: "split-pane",
    description:
      "A screen for assigning, waiving, approving, or closing policy exceptions with reason and evidence.",
    do: [
      "Keep severity and due time scannable in the primary list.",
      "Require reason and expiry when policy allows waivers.",
      "Show readonly state for users who can inspect but not resolve.",
    ],
    dont: [
      "Do not bury required resolution fields below audit history.",
      "Do not allow silent close actions.",
      "Do not remove forbidden actions without explaining policy scope.",
    ],
    gates: governedActionGates,
    id: "exception-triage-screen",
    name: "Exception triage screen",
    owner: "domain-team",
    states: ["ready", "filtered-empty", "loading", "forbidden", "readonly"],
    whenToUse:
      "Use when policy exceptions need ownership, evidence, resolution, and audit traceability.",
  },
  "long-running-job-monitor-screen": {
    anatomy: [
      "Page header with job identity and affected scope",
      "Runtime state block with progress and phase",
      "Status timeline for server events",
      "Audit trail for start, retry, cancel, fail, and complete events",
      "Retry or cancel actions with idempotency notes",
    ],
    blocks: [
      "PageHeader",
      "RuntimeStateBlock",
      "StatusTimeline",
      "AuditTrailPanel",
      "PermissionActionToolbar",
    ],
    density: "comfortable",
    description:
      "A screen for monitoring async imports, postings, exports, reconciliations, or evidence sync jobs.",
    do: [
      "Declare whether retry and cancel are safe after partial completion.",
      "Keep unrelated navigation usable while the job runs.",
      "Show last event and affected records without requiring a page refresh.",
    ],
    dont: [
      "Do not replace job history with a spinner-only state.",
      "Do not hide failure details behind a generic error.",
      "Do not offer cancel after the operation is committed.",
    ],
    gates: governedActionGates,
    id: "long-running-job-monitor-screen",
    name: "Long-running job monitor screen",
    owner: "app-team",
    states: ["ready", "loading", "partial", "error", "offline"],
    whenToUse:
      "Use when an operation may continue beyond the current interaction or has multiple server phases.",
  },
  "policy-lock-administration-screen": {
    anatomy: [
      "Page header with policy scope and tenant",
      "Filter bar for lock state, owner, expiry, and policy",
      "Policy lock table with affected action counts",
      "Evidence panel for lock reason and unlock requirements",
      "Governed unlock, request access, and override actions",
    ],
    blocks: [
      "PolicyLockManager",
      "FilterBar",
      "AdvancedDataTable",
      "RiskEvidencePanel",
      "AuditSafeDestructiveAction",
    ],
    density: "dense",
    description:
      "A screen for administering policy locks and unlock paths across tenants, records, or operational periods.",
    do: [
      "Keep locked actions visible but disabled unless the whole scope is sensitive.",
      "Show policy id, reason, owner, expiry, and affected actions.",
      "Audit unlock and override events with reason and expiry.",
    ],
    dont: [
      "Do not present unlock as a normal primary action.",
      "Do not hide expired locks without showing audit history.",
      "Do not mix lock policy calculation into the design system.",
    ],
    gates: governedActionGates,
    id: "policy-lock-administration-screen",
    name: "Policy lock administration screen",
    owner: "domain-team",
    states: ["ready", "filtered-empty", "loading", "forbidden", "readonly"],
    whenToUse:
      "Use when users need to inspect, request, or administer policy locks with traceable unlock rules.",
  },
  "reconciliation-workspace-screen": {
    anatomy: [
      "Page header with reconciliation scope and source freshness",
      "Stats strip for matched, unmatched, variance, and stale sources",
      "Filter bar for source, variance, status, and owner",
      "Dense matched/unmatched table",
      "Evidence panel for selected variance and source diagnostics",
    ],
    blocks: [
      "PageHeader",
      "StatsStrip",
      "FilterBar",
      "AdvancedDataTable",
      "RiskEvidencePanel",
      "RuntimeStateBlock",
    ],
    density: "split-pane",
    description:
      "A screen for matching operational data across systems while keeping partial sources and variance evidence visible.",
    do: [
      "Render successful sources when another source fails.",
      "Show source freshness and version near variance decisions.",
      "Require variance reason for accept or override actions.",
    ],
    dont: [
      "Do not blank the workspace for one failed feed.",
      "Do not collapse matched and unmatched rows into the same visual state.",
      "Do not accept variance without source versions in the audit payload.",
    ],
    gates: governedActionGates,
    id: "reconciliation-workspace-screen",
    name: "Reconciliation workspace screen",
    owner: "domain-team",
    states: ["ready", "filtered-empty", "loading", "partial", "stale", "error"],
    whenToUse:
      "Use when finance, inventory, compliance, or operational records must be matched across systems.",
  },
  "tenant-master-detail-screen": {
    anatomy: [
      "Page header with tenant and operational scope",
      "Filter bar with search and saved filters",
      "Primary table or list with keyboard selection",
      "Detail panel for entity summary, form, and evidence",
      "Dirty, conflict, offline, and autosave states",
    ],
    blocks: [
      "PageHeader",
      "FilterBar",
      "DataTableShell",
      "EntitySummaryPanel",
      "RecordEditorBlock",
      "SaveStateStrip",
    ],
    density: "split-pane",
    description:
      "A screen for scanning tenant records while editing or reviewing one selected entity in context.",
    do: [
      "Prevent selection changes from discarding dirty edits.",
      "Keep primary identity visible in both table and detail panel.",
      "Use narrow viewport behavior that preserves back-to-list navigation.",
    ],
    dont: [
      "Do not use a marketing card layout for repeated operational edits.",
      "Do not let detail loading shift the table width.",
      "Do not hide autosave, conflict, or offline states.",
    ],
    gates: baselineGates,
    id: "tenant-master-detail-screen",
    name: "Tenant master-detail screen",
    owner: "app-team",
    states: [
      "ready",
      "first-use",
      "filtered-empty",
      "loading",
      "conflict",
      "offline",
      "readonly",
    ],
    whenToUse:
      "Use when operators repeatedly scan a list and inspect or edit one selected tenant record.",
  },
} as const satisfies EnterpriseScreenPatternCatalog;

const enterpriseScreenPatternEntries = enterpriseScreenPatternIds.map(
  (id) => enterpriseScreenPatterns[id]
);

export {
  enterpriseScreenPatternEntries,
  enterpriseScreenPatternGateValues,
  enterpriseScreenPatternIds,
  enterpriseScreenPatterns,
  enterpriseScreenPatternStateValues,
};
export type {
  EnterpriseScreenPatternCatalog,
  EnterpriseScreenPatternDefinition,
  EnterpriseScreenPatternDensity,
  EnterpriseScreenPatternGate,
  EnterpriseScreenPatternId,
  EnterpriseScreenPatternOwner,
  EnterpriseScreenPatternState,
};
