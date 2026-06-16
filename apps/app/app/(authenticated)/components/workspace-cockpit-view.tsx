"use client";

import {
  blockRecipe,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/design-system";
import { cn } from "@repo/design-system/lib/utils";
import {
  CockpitKbdHint,
  CockpitMiniSparkline,
  CockpitStatusChip,
  CockpitStatusLabel,
  statusDotClass,
  statusTextClass,
} from "./cockpit-status-ui";
import {
  cockpitActivities,
  cockpitAuditEvents,
  cockpitKpis,
  cockpitQueueRowKeys,
  cockpitQueueTables,
  cockpitSequenceSteps,
  getCockpitQueueRowKey,
  type CockpitKpiItem,
  type CockpitQueueRow,
  type CockpitQueueRowKey,
  type CockpitQueueTable,
} from "./workspace-cockpit-data";
import {
  CockpitQueueScope,
  useCockpitQueueRow,
} from "./workspace-cockpit-queue";
import { WorkspaceCommandBar } from "./workspace-command-bar";
import { useWorkspaceKeyboard } from "./workspace-keyboard-provider";

export function WorkspaceCockpitView() {
  return (
    <CockpitQueueScope rowKeys={cockpitQueueRowKeys}>
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_var(--xforge-layout-audit-rail)]">
        <section className={cn(blockRecipe("blockStack"), "min-w-0")}>
          <WorkspaceCommandBar />
          <TenantDashboardHeader />
          <div className="grid gap-4 lg:grid-cols-2">
            {cockpitQueueTables.map((table) => (
              <WorkQueueTable key={table.id} table={table} />
            ))}
          </div>
          <RecentActivityPanel />
          <WorkspaceKeyboardHints />
        </section>
        <AuditEvidenceRail />
      </div>
    </CockpitQueueScope>
  );
}

function TenantDashboardHeader() {
  return (
    <section className={cn(blockRecipe("blockPanel", "blockPanelPadding"))}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_11rem]">
        <div className={cn(blockRecipe("blockStack"), "gap-2")}>
          <CockpitStatusChip label="Overview lane" tone="blue" />
          <div>
            <h2 className="font-semibold text-[18px] text-text-primary leading-5 tracking-tight">
              Governed tenant dashboard
            </h2>
            <p className={cn(blockRecipe("blockDescription"), "mt-1 max-w-2xl")}>
              Signed in with tenant role admin. Sensitive reads stay tenant and
              company scoped.
            </p>
          </div>
        </div>
        <div
          className={cn(
            blockRecipe("blockPanel", "blockPanelPadding"),
            "grid content-start gap-1 bg-surface-muted/20"
          )}
        >
          <div className={blockRecipe("blockMetricLabel")}>Execution guard</div>
          <div
            className={cn(
              blockRecipe("blockMetric"),
              "font-mono text-[var(--status-success)] tabular-nums slashed-zero"
            )}
          >
            10/10
          </div>
          <div className={blockRecipe("blockDescription")}>
            auth, tenant, grants, audit
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cockpitKpis.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>
    </section>
  );
}

function KpiCard({ delta, detail, title, tone, trend, value }: CockpitKpiItem) {
  return (
    <div className={cn(blockRecipe("blockPanel", "blockPanelPadding"))}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            className={cn("size-2 shrink-0 rounded-full", statusDotClass[tone])}
          />
          <span className={blockRecipe("blockMetricLabel")}>{title}</span>
        </div>
        <CockpitMiniSparkline tone={tone} values={trend} />
      </div>
      <div
        className={cn(
          blockRecipe("blockMetric"),
          "mt-2 font-mono text-[18px] tabular-nums slashed-zero"
        )}
      >
        {value}
      </div>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className={cn("text-[11px] tabular-nums", statusTextClass[tone])}>
          {delta}
        </span>
        <span className={blockRecipe("blockDescription")}>{detail}</span>
      </div>
    </div>
  );
}

function WorkQueueTable({ table }: { readonly table: CockpitQueueTable }) {
  return (
    <section className={cn(blockRecipe("blockPanel"), "overflow-hidden")}>
      <div
        className={cn(
          blockRecipe("blockHeader", "blockPanelPadding"),
          "border-border-default border-b pb-3"
        )}
      >
        <div className={blockRecipe("blockHeaderContent")}>
          <h2 className={blockRecipe("blockTitle")}>{table.title}</h2>
          <p className={blockRecipe("blockDescription")}>{table.subtitle}</p>
        </div>
        {table.action ? (
          <Button className="gap-2" size="sm" variant="secondary">
            {table.action}
            {table.actionHint ? (
              <kbd className="rounded border border-border-default bg-surface-muted/60 px-1 font-mono text-[10px] text-text-tertiary tabular-nums">
                {table.actionHint}
              </kbd>
            ) : null}
          </Button>
        ) : null}
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-8 px-3 py-2 text-[11px]">Name</TableHead>
            <TableHead className="h-8 px-3 py-2 font-mono text-[11px]">
              Record ID
            </TableHead>
            <TableHead className="h-8 px-3 py-2 text-right text-[11px]">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.rows.map((row) => {
            const rowKey = getCockpitQueueRowKey(table.id, row.id);

            return (
              <QueueTableRow key={rowKey} row={row} rowKey={rowKey} />
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
}

function QueueTableRow({
  row,
  rowKey,
}: {
  readonly row: CockpitQueueRow;
  readonly rowKey: CockpitQueueRowKey;
}) {
  const { selected, setRowRef } = useCockpitQueueRow(rowKey);

  return (
    <TableRow
      aria-selected={selected}
      className={cn(
        "cursor-default transition-colors duration-80 hover:bg-surface-hover",
        selected &&
          "border-l-2 border-l-brand-primary bg-brand-primary/6 hover:bg-brand-primary/8"
      )}
      ref={setRowRef}
      tabIndex={selected ? 0 : -1}
    >
      <TableCell className="px-3 py-2 font-medium text-[13px]">
        {row.name}
      </TableCell>
      <TableCell className="px-3 py-2 font-mono text-[12px] text-text-secondary tabular-nums slashed-zero">
        {row.id}
      </TableCell>
      <TableCell className="px-3 py-2 text-right">
        <CockpitStatusLabel label={row.status} tone={row.tone} />
      </TableCell>
    </TableRow>
  );
}

function RecentActivityPanel() {
  return (
    <section className={cn(blockRecipe("blockPanel"), "overflow-hidden")}>
      <div className="border-border-default border-b px-[var(--card-padding)] py-3">
        <h2 className={blockRecipe("blockTitle")}>Recent audit activity</h2>
      </div>
      <ul className="divide-y divide-border-default">
        {cockpitActivities.map((activity) => (
          <li
            className="flex items-center gap-3 px-3 py-2 transition-colors duration-80 hover:bg-surface-hover"
            key={activity.title}
          >
            <CockpitStatusLabel label={activity.label} tone={activity.tone} />
            <span className="min-w-0 flex-1 truncate font-medium text-[13px]">
              {activity.title}
            </span>
            <time
              className="shrink-0 font-mono text-[11px] text-text-tertiary tabular-nums"
              dateTime={activity.time}
            >
              {activity.time}
            </time>
          </li>
        ))}
      </ul>
    </section>
  );
}

function WorkspaceKeyboardHints() {
  const { openShortcutsDialog } = useWorkspaceKeyboard();

  return (
    <p
      className={cn(
        blockRecipe("blockDescription"),
        "font-mono text-[11px] tabular-nums"
      )}
    >
      <CockpitKbdHint keys="⌘K" /> command palette ·{" "}
      <CockpitKbdHint keys="J/K" /> navigate rows · <CockpitKbdHint keys="E" />{" "}
      edit selected ·{" "}
      <button
        className="underline-offset-2 hover:underline"
        onClick={openShortcutsDialog}
        type="button"
      >
        <CockpitKbdHint keys="?" /> shortcuts
      </button>
    </p>
  );
}

function AuditEvidenceRail() {
  return (
    <aside
      className={cn(
        blockRecipe("blockPanel", "blockPanelPadding"),
        "grid h-fit gap-4"
      )}
    >
      <div>
        <h2 className={blockRecipe("blockTitle")}>Audit evidence</h2>
        <p className={cn(blockRecipe("blockDescription"), "mt-1")}>
          Docked rail exposes risk without stealing the main workflow.
        </p>
      </div>
      <CockpitStatusChip label="Scope: system-admin.overview" tone="blue" />
      <div className="grid gap-3">
        {cockpitAuditEvents.map((event) => (
          <div className="flex gap-3" key={event.title}>
            <span
              aria-hidden="true"
              className={cn(
                "mt-1 h-11 w-0.5 shrink-0 rounded-full",
                statusDotClass[event.tone]
              )}
            />
            <div className="min-w-0">
              <div className="font-medium text-[13px]">{event.title}</div>
              <div className="truncate font-mono text-[11px] text-text-secondary tabular-nums slashed-zero">
                {event.meta}
              </div>
            </div>
          </div>
        ))}
      </div>
      <SequenceList />
      <Button className="w-fit" size="sm" variant="secondary">
        Export evidence
      </Button>
      <div
        className={cn(
          blockRecipe("blockPanel", "blockPanelPadding"),
          "bg-surface-muted/20"
        )}
      >
        <div className={blockRecipe("blockTitle")}>Selected evidence detail</div>
        <div className="mt-2">
          <CockpitStatusChip label="Company grant missing" tone="amber" />
        </div>
        <p className={cn(blockRecipe("blockDescription"), "mt-2")}>
          Request attempted to read a company-scoped record without a matching
          grant. The domain operation was blocked before mutation.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
          <button
            className={cn("hover:underline", statusTextClass.green)}
            type="button"
          >
            Recheck grant
          </button>
          <span aria-hidden="true" className="text-text-tertiary">
            ·
          </span>
          <button
            className={cn("hover:underline", statusTextClass.blue)}
            type="button"
          >
            Open policy
          </button>
        </div>
      </div>
    </aside>
  );
}

function SequenceList() {
  return (
    <div
      className={cn(
        blockRecipe("blockPanel", "blockPanelPadding"),
        "grid gap-2 bg-surface-muted/20"
      )}
    >
      {cockpitSequenceSteps.map((step, index) => (
        <div className="flex items-center gap-2" key={step}>
          <span className="flex size-5 items-center justify-center rounded-full bg-brand-primary font-mono font-semibold text-[10px] text-brand-primary-foreground tabular-nums">
            {index + 1}
          </span>
          <span className="font-medium text-[13px]">{step}</span>
        </div>
      ))}
    </div>
  );
}
