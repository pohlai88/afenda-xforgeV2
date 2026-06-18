"use client";

import { cn } from "../../lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ClipboardCheckIcon,
  FileClockIcon,
  FilesIcon,
  FilterIcon,
  LockIcon,
  PanelsTopLeftIcon,
  ScaleIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "../afenda-ui/button";
import type {
  ApprovalQueueRow,
  CommandSearchGroup,
  RiskEvidenceItem,
} from "./advanced";
import {
  AdvancedDataTable,
  ApprovalQueueBlock,
  CommandSearchBlock,
  OperationalDashboardShell,
  RiskEvidencePanel,
} from "./advanced";
import { blockRecipe } from "./block-recipes";
import type { ReversibleBulkMode } from "./erp-state";
import { ReversibleBulkActionBar } from "./erp-state";
import type {
  ActiveFilter,
  BlockAction,
  BlockTone,
  PageHeaderMeta,
  StatsMetric,
} from "./foundation";
import { FilterBar, PageHeader, StatsStrip } from "./foundation";
import type {
  AuditTrailEvent,
  EntitySummaryField,
  StatusTimelineItem,
} from "./operator";
import {
  AuditTrailPanel,
  EntitySummaryPanel,
  StatusTimeline,
} from "./operator";

interface WorkflowStatus {
  readonly label: string;
  readonly tone?: BlockTone;
}

interface WorkflowScope {
  readonly period?: string;
  readonly tenant?: string;
  readonly timezone?: string;
}

interface WorkflowFilter {
  readonly activeFilters?: readonly ActiveFilter[];
  readonly resultCount?: number | string;
  readonly searchPlaceholder?: string;
}

type WorkflowSectionProps = Omit<ComponentProps<"section">, "title">;

interface EvidenceRecord {
  readonly evidenceId: string;
  readonly kind: string;
  readonly owner: string;
  readonly retention: string;
  readonly status: string;
  readonly tone: BlockTone;
  readonly updatedAt: string;
}

interface PolicyLockRow {
  readonly lockId: string;
  readonly owner: string;
  readonly policy: string;
  readonly scope: string;
  readonly state: string;
  readonly tone: BlockTone;
  readonly unlockAt: string;
}

interface BatchPostingRow {
  readonly amount: string;
  readonly batchId: string;
  readonly owner: string;
  readonly records: string;
  readonly status: string;
  readonly tenant: string;
  readonly tone: BlockTone;
}

type ApprovalControlCenterProps = WorkflowSectionProps & {
  readonly actions?: readonly BlockAction[] | ReactNode;
  readonly approvals: readonly ApprovalQueueRow[];
  readonly evidence: readonly RiskEvidenceItem[];
  readonly filters?: ReactNode;
  readonly metrics: readonly StatsMetric[];
  readonly meta?: readonly PageHeaderMeta[];
  readonly progress?: ComponentProps<typeof RiskEvidencePanel>["progress"];
  readonly scope?: WorkflowScope;
  readonly searchGroups: readonly CommandSearchGroup[];
  readonly status?: WorkflowStatus;
};

function ApprovalControlCenter({
  actions,
  approvals,
  className,
  evidence,
  filters,
  metrics,
  meta,
  progress,
  scope,
  searchGroups,
  status = { label: "Controlled", tone: "success" },
  ...props
}: ApprovalControlCenterProps) {
  return (
    <OperationalDashboardShell
      actions={actions}
      className={className}
      description="Review tenant-scoped approvals, evidence completeness, and policy locks before posting operational changes."
      filters={filters ?? <WorkflowScopeFilters scope={scope} />}
      meta={meta ?? workflowScopeMeta(scope)}
      nav={approvalNav}
      status={status}
      tabs={[
        {
          content: (
            <div className="grid min-w-0 gap-4">
              <StatsStrip columns={3} metrics={metrics} />
              <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
                <ApprovalQueueBlock rows={approvals} />
                <div className="grid min-w-0 content-start gap-4">
                  <RiskEvidencePanel
                    evidence={evidence}
                    metrics={metrics.slice(0, 3)}
                    progress={progress}
                  />
                  <CommandSearchBlock groups={searchGroups} />
                </div>
              </section>
            </div>
          ),
          count: approvals.length,
          label: "Queue",
          value: "queue",
        },
        {
          content: (
            <RiskEvidencePanel
              evidence={evidence}
              metrics={metrics.slice(0, 3)}
              progress={progress}
              title="Approval evidence"
            />
          ),
          count: evidence.length,
          label: "Evidence",
          value: "evidence",
        },
      ]}
      title="Approval control center"
      {...props}
    />
  );
}

type TenantOperationsWorkspaceProps = WorkflowSectionProps & {
  readonly actions?: readonly BlockAction[] | ReactNode;
  readonly auditEvents: readonly AuditTrailEvent[];
  readonly fields: readonly EntitySummaryField[];
  readonly filter?: WorkflowFilter;
  readonly metrics: readonly StatsMetric[];
  readonly scope?: WorkflowScope;
  readonly status?: WorkflowStatus;
  readonly timeline: readonly StatusTimelineItem[];
};

function TenantOperationsWorkspace({
  actions,
  auditEvents,
  className,
  fields,
  filter,
  metrics,
  scope,
  status = { label: "Tenant scoped", tone: "info" },
  timeline,
  ...props
}: TenantOperationsWorkspaceProps) {
  return (
    <section
      className={cn(blockRecipe("blockShell", "blockStack"), className)}
      data-slot="tenant-operations-workspace-block"
      {...props}
    >
      <PageHeader
        actions={actions}
        description="Tenant identity, operational controls, and recent accountable activity in one dense workspace."
        meta={workflowScopeMeta(scope)}
        status={status}
        title="Tenant operations workspace"
      />
      <StatsStrip columns={4} metrics={metrics} />
      <FilterBar
        activeFilters={filter?.activeFilters}
        resultCount={filter?.resultCount}
        searchPlaceholder={
          filter?.searchPlaceholder ?? "Search tenant operations..."
        }
      >
        <WorkflowScopeFilters scope={scope} />
      </FilterBar>
      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="grid min-w-0 content-start gap-4">
          <EntitySummaryPanel
            fields={fields}
            status={status}
            title="Tenant summary"
          />
          <StatusTimeline items={timeline} title="Operational timeline" />
        </div>
        <AuditTrailPanel
          description="Immutable actions for this tenant and period."
          events={auditEvents}
          title="Recent audit trail"
        />
      </section>
    </section>
  );
}

type AuditEvidenceWorkspaceProps = WorkflowSectionProps & {
  readonly actions?: readonly BlockAction[] | ReactNode;
  readonly auditEvents: readonly AuditTrailEvent[];
  readonly evidence: readonly RiskEvidenceItem[];
  readonly evidenceRecords: readonly EvidenceRecord[];
  readonly filter?: WorkflowFilter;
  readonly metrics: readonly StatsMetric[];
  readonly progress?: ComponentProps<typeof RiskEvidencePanel>["progress"];
  readonly scope?: WorkflowScope;
  readonly status?: WorkflowStatus;
};

function AuditEvidenceWorkspace({
  actions,
  auditEvents,
  className,
  evidence,
  evidenceRecords,
  filter,
  metrics,
  progress,
  scope,
  status = { label: "Evidence tracked", tone: "success" },
  ...props
}: AuditEvidenceWorkspaceProps) {
  return (
    <section
      className={cn(blockRecipe("blockShell", "blockStack"), className)}
      data-slot="audit-evidence-workspace-block"
      {...props}
    >
      <PageHeader
        actions={actions}
        description="Validate evidence coverage, retention status, and immutable audit events before downstream posting."
        meta={workflowScopeMeta(scope)}
        status={status}
        title="Audit evidence workspace"
      />
      <FilterBar
        activeFilters={filter?.activeFilters}
        resultCount={filter?.resultCount ?? evidenceRecords.length}
        searchPlaceholder={
          filter?.searchPlaceholder ?? "Search evidence, owner, audit ID..."
        }
      >
        <WorkflowScopeFilters scope={scope} />
      </FilterBar>
      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <AdvancedDataTable
          columns={evidenceRecordColumns}
          data={evidenceRecords}
          getRowId={(row) => row.evidenceId}
          searchPlaceholder="Search evidence records..."
          title="Evidence records"
        />
        <div className="grid min-w-0 content-start gap-4">
          <RiskEvidencePanel
            evidence={evidence}
            metrics={metrics.slice(0, 3)}
            progress={progress}
          />
          <AuditTrailPanel events={auditEvents} title="Evidence audit events" />
        </div>
      </section>
    </section>
  );
}

type PolicyLockManagerProps = WorkflowSectionProps & {
  readonly actions?: readonly BlockAction[] | ReactNode;
  readonly evidence: readonly RiskEvidenceItem[];
  readonly filter?: WorkflowFilter;
  readonly locks: readonly PolicyLockRow[];
  readonly metrics: readonly StatsMetric[];
  readonly scope?: WorkflowScope;
  readonly status?: WorkflowStatus;
};

function PolicyLockManager({
  actions,
  className,
  evidence,
  filter,
  locks,
  metrics,
  scope,
  status = { label: "Locks enforced", tone: "warning" },
  ...props
}: PolicyLockManagerProps) {
  return (
    <section
      className={cn(blockRecipe("blockShell", "blockStack"), className)}
      data-slot="policy-lock-manager-block"
      {...props}
    >
      <PageHeader
        actions={actions}
        description="Inspect active policy locks, ownership, expiration, and release evidence before unlocking operational changes."
        meta={workflowScopeMeta(scope)}
        status={status}
        title="Policy lock manager"
      />
      <StatsStrip columns={3} metrics={metrics} />
      <FilterBar
        activeFilters={filter?.activeFilters}
        resultCount={filter?.resultCount ?? locks.length}
        searchPlaceholder={
          filter?.searchPlaceholder ?? "Search policy, scope, owner..."
        }
      >
        <WorkflowScopeFilters scope={scope} />
      </FilterBar>
      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <AdvancedDataTable
          columns={policyLockColumns}
          data={locks}
          getRowId={(row) => row.lockId}
          searchPlaceholder="Search policy locks..."
          title="Policy locks"
        />
        <RiskEvidencePanel
          evidence={evidence}
          metrics={metrics.slice(0, 3)}
          title="Release evidence"
        />
      </section>
    </section>
  );
}

type BatchPostingReviewProps = WorkflowSectionProps & {
  readonly actions?: readonly BlockAction[] | ReactNode;
  readonly auditEvents: readonly AuditTrailEvent[];
  readonly bulkMode?: ReversibleBulkMode;
  readonly batches: readonly BatchPostingRow[];
  readonly filter?: WorkflowFilter;
  readonly metrics: readonly StatsMetric[];
  readonly scope?: WorkflowScope;
  readonly selectedCount?: number;
  readonly status?: WorkflowStatus;
};

function BatchPostingReview({
  actions,
  auditEvents,
  batches,
  bulkMode = "confirming",
  className,
  filter,
  metrics,
  scope,
  selectedCount = 2,
  status = { label: "Pre-post review", tone: "info" },
  ...props
}: BatchPostingReviewProps) {
  return (
    <section
      className={cn(blockRecipe("blockShell", "blockStack"), className)}
      data-slot="batch-posting-review-block"
      {...props}
    >
      <PageHeader
        actions={actions}
        description="Confirm ready batches, exception counts, and audit coverage before posting operational changes."
        meta={workflowScopeMeta(scope)}
        status={status}
        title="Batch posting review"
      />
      <StatsStrip columns={4} metrics={metrics} />
      <FilterBar
        activeFilters={filter?.activeFilters}
        resultCount={filter?.resultCount ?? batches.length}
        searchPlaceholder={
          filter?.searchPlaceholder ?? "Search batch, tenant, owner..."
        }
      >
        <WorkflowScopeFilters scope={scope} />
      </FilterBar>
      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <div className="grid min-w-0 content-start gap-3">
          <ReversibleBulkActionBar
            actionLabel="Post selected"
            mode={bulkMode}
            selectedCount={selectedCount}
          />
          <AdvancedDataTable
            bulkActions={
              <>
                <Button size="sm" variant="secondary">
                  <ShieldCheckIcon aria-hidden="true" className="size-4" />
                  Post selected
                </Button>
                <Button size="sm" variant="quiet">
                  <LockIcon aria-hidden="true" className="size-4" />
                  Hold
                </Button>
              </>
            }
            columns={batchPostingColumns}
            data={batches}
            getRowId={(row) => row.batchId}
            searchPlaceholder="Search posting batches..."
            title="Posting batches"
          />
        </div>
        <AuditTrailPanel events={auditEvents} title="Posting audit trail" />
      </section>
    </section>
  );
}

const evidenceRecordColumns: ColumnDef<EvidenceRecord, unknown>[] = [
  {
    accessorKey: "evidenceId",
    header: "Evidence ID",
    cell: ({ row }) => (
      <span className="font-mono text-text-secondary tabular-nums">
        {row.original.evidenceId}
      </span>
    ),
  },
  {
    accessorKey: "kind",
    header: "Type",
  },
  {
    accessorKey: "owner",
    header: "Owner",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <WorkflowStatusDot row={row.original} />,
  },
  {
    accessorKey: "retention",
    header: "Retention",
    cell: ({ row }) => (
      <span className="font-mono tabular-nums">{row.original.retention}</span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => (
      <span className="font-mono text-text-secondary tabular-nums">
        {row.original.updatedAt}
      </span>
    ),
  },
];

const policyLockColumns: ColumnDef<PolicyLockRow, unknown>[] = [
  {
    accessorKey: "lockId",
    header: "Lock ID",
    cell: ({ row }) => (
      <span className="font-mono text-text-secondary tabular-nums">
        {row.original.lockId}
      </span>
    ),
  },
  {
    accessorKey: "policy",
    header: "Policy",
  },
  {
    accessorKey: "scope",
    header: "Scope",
  },
  {
    accessorKey: "owner",
    header: "Owner",
  },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => <WorkflowStatusDot row={row.original} />,
  },
  {
    accessorKey: "unlockAt",
    header: "Unlock at",
    cell: ({ row }) => (
      <span className="font-mono tabular-nums">{row.original.unlockAt}</span>
    ),
  },
];

const batchPostingColumns: ColumnDef<BatchPostingRow, unknown>[] = [
  {
    accessorKey: "batchId",
    header: "Batch ID",
    cell: ({ row }) => (
      <span className="font-mono text-text-secondary tabular-nums">
        {row.original.batchId}
      </span>
    ),
  },
  {
    accessorKey: "tenant",
    header: "Tenant",
  },
  {
    accessorKey: "owner",
    header: "Owner",
  },
  {
    accessorKey: "records",
    header: "Records",
    cell: ({ row }) => (
      <span className="font-mono tabular-nums">{row.original.records}</span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="block text-right font-mono tabular-nums">
        {row.original.amount}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <WorkflowStatusDot row={row.original} />,
  },
];

function WorkflowScopeFilters({ scope }: { readonly scope?: WorkflowScope }) {
  return (
    <div className={blockRecipe("blockToolbar")}>
      <Button size="sm" variant="quiet">
        <FilterIcon aria-hidden="true" className="size-4" />
        {scope?.period ?? "Current period"}
      </Button>
      <Button size="sm" variant="quiet">
        <SlidersHorizontalIcon aria-hidden="true" className="size-4" />
        {scope?.timezone ?? "UTC+07"}
      </Button>
    </div>
  );
}

function WorkflowStatusDot({
  row,
}: {
  readonly row: {
    readonly state?: string;
    readonly status?: string;
    readonly tone: BlockTone;
  };
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full",
          workflowToneDotClassName[row.tone]
        )}
      />
      <span>{row.status ?? row.state}</span>
    </span>
  );
}

function workflowScopeMeta(scope?: WorkflowScope): readonly PageHeaderMeta[] {
  return [
    { id: "tenant", label: scope?.tenant ?? "Tenant scope" },
    { id: "period", label: scope?.period ?? "Current period" },
    { id: "timezone", label: scope?.timezone ?? "UTC+07" },
  ];
}

const workflowToneDotClassName: Record<BlockTone, string> = {
  critical: "bg-critical",
  info: "bg-info",
  neutral: "bg-text-tertiary",
  success: "bg-success",
  warning: "bg-warning",
};

const approvalNav = [
  {
    active: true,
    icon: <ClipboardCheckIcon aria-hidden="true" className="size-4" />,
    label: "Approvals",
  },
  {
    icon: <FilesIcon aria-hidden="true" className="size-4" />,
    label: "Evidence",
  },
  {
    icon: <LockIcon aria-hidden="true" className="size-4" />,
    label: "Policies",
  },
  {
    icon: <ScaleIcon aria-hidden="true" className="size-4" />,
    label: "Posting",
  },
  {
    icon: <FileClockIcon aria-hidden="true" className="size-4" />,
    label: "Audit",
  },
  {
    icon: <PanelsTopLeftIcon aria-hidden="true" className="size-4" />,
    label: "Workspace",
  },
] as const;

export {
  ApprovalControlCenter,
  AuditEvidenceWorkspace,
  BatchPostingReview,
  PolicyLockManager,
  TenantOperationsWorkspace,
};
export type {
  ApprovalControlCenterProps,
  AuditEvidenceWorkspaceProps,
  BatchPostingReviewProps,
  BatchPostingRow,
  EvidenceRecord,
  PolicyLockManagerProps,
  PolicyLockRow,
  TenantOperationsWorkspaceProps,
  WorkflowFilter,
  WorkflowScope,
  WorkflowStatus,
};
