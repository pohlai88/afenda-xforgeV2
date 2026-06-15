import { Badge } from "@repo/design-system/components/afenda-ui/badge";
import { Button } from "@repo/design-system/components/afenda-ui/button";
import { Checkbox } from "@repo/design-system/components/afenda-ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/components/afenda-ui/table";
import {
  DataTableShell,
  EmptyPanel,
  FilterBar,
  PageHeader,
  ReversibleBulkActionBar,
  RuntimeStateBlock,
  SaveStateStrip,
  StatsStrip,
} from "@repo/design-system/components/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertTriangleIcon,
  ArchiveIcon,
  CheckCircle2Icon,
  DownloadIcon,
  FilterIcon,
  RefreshCcwIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { expect } from "storybook/test";

import {
  interactionStoryParameters,
  layoutStoryParameters,
  mobileViewportParameters,
} from "../../.storybook/essentials";

const meta = {
  title: "Blocks/Storybook Coverage",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "centered",
    docs: {
      description: {
        component:
          "Coverage matrix for Afenda enterprise blocks: happy path, dense data, runtime states, narrow viewport, and interaction coverage for filtering, selection, and reversible bulk actions.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

type ApprovalTone = "critical" | "info" | "success" | "warning";

interface ApprovalRow {
  readonly amount: string;
  readonly id: string;
  readonly owner: string;
  readonly sla: string;
  readonly status: string;
  readonly tenant: string;
  readonly tone: ApprovalTone;
}

const coverageRows: readonly ApprovalRow[] = [
  {
    amount: "86,420.00",
    id: "AP-10482",
    owner: "Mina Shah",
    sla: "1h 12m",
    status: "Ready",
    tenant: "Northwind Trading",
    tone: "success",
  },
  {
    amount: "14,310.50",
    id: "AP-10479",
    owner: "Jon Bell",
    sla: "38m",
    status: "SLA watch",
    tenant: "Aster Foods",
    tone: "warning",
  },
  {
    amount: "122,900.00",
    id: "AP-10471",
    owner: "Priya N.",
    sla: "Past due",
    status: "Locked",
    tenant: "Mercury Parts",
    tone: "critical",
  },
  {
    amount: "9,814.75",
    id: "AP-10468",
    owner: "Sam Keane",
    sla: "3h 04m",
    status: "Review",
    tenant: "Union Medical",
    tone: "info",
  },
  {
    amount: "42,180.20",
    id: "AP-10461",
    owner: "Rina Park",
    sla: "5h 18m",
    status: "Ready",
    tenant: "Orion Logistics",
    tone: "success",
  },
  {
    amount: "18,005.00",
    id: "AP-10458",
    owner: "Theo Grant",
    sla: "2h 44m",
    status: "Review",
    tenant: "Atlas Clinics",
    tone: "info",
  },
];

const denseRows = Array.from({ length: 18 }, (_, index) => {
  const source = coverageRows[index % coverageRows.length];

  return {
    ...source,
    id: `AP-${10_520 - index}`,
    tenant: `${source.tenant} ${index + 1}`,
  };
});

const coverageMetrics = [
  {
    id: "ready",
    label: "Ready",
    value: "86",
    description: "Records validated for posting.",
    tone: "success" as const,
    icon: <CheckCircle2Icon aria-hidden="true" />,
  },
  {
    id: "sla",
    label: "SLA risk",
    value: "14",
    description: "4 requests breach in the next 2 hours.",
    tone: "warning" as const,
    icon: <AlertTriangleIcon aria-hidden="true" />,
  },
  {
    id: "locked",
    label: "Policy locks",
    value: "7",
    description: "Tenant controls preventing unsafe edits.",
    tone: "info" as const,
    icon: <ShieldCheckIcon aria-hidden="true" />,
  },
  {
    id: "failed",
    label: "Failed sync",
    value: "2",
    description: "Vendor evidence retries required.",
    tone: "critical" as const,
    icon: <RefreshCcwIcon aria-hidden="true" />,
  },
];

export const HappyPath: Story = {
  render: () => (
    <main className="grid w-[min(1080px,calc(100vw-32px))] min-w-0 gap-4">
      <PageHeader
        actions={[
          {
            key: "export",
            label: "Export",
            icon: <DownloadIcon aria-hidden="true" />,
            variant: "quiet",
          },
          {
            key: "post-ready",
            label: "Post ready",
            icon: <ShieldCheckIcon aria-hidden="true" />,
            permission: "approval.post",
            variant: "primary",
          },
        ]}
        blockId="coverage-happy-header"
        description="Governed queue with identified blocks, operational intent, and ready runtime state."
        eyebrow="Coverage / Happy path"
        intent="approval"
        meta={[
          { id: "tenant", label: "Northwind Trading" },
          { id: "period", label: "June close" },
        ]}
        status={{ label: "Ready", tone: "success" }}
        title="Approval control center"
      />
      <StatsStrip blockId="coverage-happy-stats" metrics={coverageMetrics} />
      <FilterBar
        actions={[
          {
            key: "filters",
            label: "Filters",
            icon: <FilterIcon aria-hidden="true" />,
            variant: "secondary",
          },
        ]}
        activeFilters={[
          { id: "status", label: "Status: ready", tone: "success" },
          { id: "tenant", label: "Tenant scoped" },
        ]}
        blockId="coverage-happy-filters"
        intent="approval"
        resultCount={coverageRows.length}
        searchPlaceholder="Search approvals..."
      />
      <CoverageQueueTable rows={coverageRows.slice(0, 4)} />
    </main>
  ),
};

export const DenseDataPath: Story = {
  render: () => (
    <main className="grid w-[min(1180px,calc(100vw-32px))] min-w-0 gap-3">
      <PageHeader
        blockId="coverage-dense-header"
        density="compact"
        description="Compact density keeps high-volume admin pages scannable without each block inventing spacing."
        eyebrow="Coverage / Dense data"
        status={{ label: "18 rows", tone: "info" }}
        title="Tenant approval queue"
      />
      <DataTableShell
        blockId="coverage-dense-table"
        density="compact"
        footer="Showing 18 of 256 approvals"
        selectedCount={0}
        title="Dense approvals"
        toolbar={
          <>
            <Badge tone="warning" variant="outline">
              SLA first
            </Badge>
            <Badge tone="neutral" variant="outline">
              Compact
            </Badge>
          </>
        }
      >
        <ApprovalTable rows={denseRows} selectable={false} />
      </DataTableShell>
    </main>
  ),
};

export const EmptyErrorForbiddenPath: Story = {
  render: () => (
    <main className="grid w-[min(920px,calc(100vw-32px))] min-w-0 gap-3">
      <EmptyPanel
        blockId="coverage-empty-approvals"
        description="No approvals match the current tenant, status, and SLA filters."
        icon={<CheckCircle2Icon aria-hidden="true" />}
        title="No approvals waiting"
        tone="success"
      />
      <RuntimeStateBlock
        actions={[
          {
            key: "retry-evidence",
            label: "Retry sync",
            icon: <RefreshCcwIcon aria-hidden="true" />,
            variant: "secondary",
          },
        ]}
        blockId="coverage-error-evidence"
        description="Vendor evidence could not be loaded. Existing approvals remain read-only until the retry completes."
        state="error"
        title="Evidence sync failed"
      />
      <RuntimeStateBlock
        actions={[
          {
            key: "request-access",
            label: "Request access",
            icon: <ShieldCheckIcon aria-hidden="true" />,
            permission: "approval.policy.requestAccess",
            variant: "secondary",
          },
        ]}
        blockId="coverage-forbidden-policy"
        description="Approval policy is restricted to finance administrators for this tenant."
        state="forbidden"
        title="Permission required"
      />
    </main>
  ),
};

export const MobileNarrowViewportPath: Story = {
  parameters: {
    ...layoutStoryParameters,
    ...mobileViewportParameters,
  },
  render: () => (
    <main className="grid w-[calc(100vw-24px)] min-w-0 gap-3">
      <PageHeader
        actions={[
          {
            key: "archive",
            label: "Archive",
            icon: <ArchiveIcon aria-hidden="true" />,
            variant: "secondary",
          },
        ]}
        blockId="coverage-mobile-header"
        description="Narrow viewport path verifies toolbar wrapping, truncation, and compact operator copy."
        eyebrow="Coverage / Mobile"
        status={{ label: "SLA watch", tone: "warning" }}
        title="Approval queue"
      />
      <SaveStateStrip
        blockId="coverage-mobile-save"
        detail="Two edits are queued locally."
        saveState="offline"
      />
      <DataTableShell
        blockId="coverage-mobile-table"
        density="compact"
        footer="Showing 3 critical approvals"
        title="Critical approvals"
      >
        <ApprovalTable rows={coverageRows.slice(1, 4)} selectable={false} />
      </DataTableShell>
    </main>
  ),
};

export const InteractionSelectionFilteringBulkActions: Story = {
  parameters: interactionStoryParameters,
  tags: ["interaction"],
  render: () => <InteractiveApprovalCoverage />,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText("6 results")).toBeVisible();

    await userEvent.type(
      canvas.getByLabelText("Search approval coverage"),
      "Mercury"
    );
    await expect(canvas.getByText("1 results")).toBeVisible();
    await expect(canvas.getByText("Mercury Parts")).toBeVisible();

    await userEvent.click(canvas.getByRole("checkbox", { name: "Select all" }));
    await expect(canvas.getByText("1 selected")).toBeVisible();

    await userEvent.click(
      canvas.getByRole("button", { name: "Archive selected" })
    );
    await expect(canvas.getByText("Confirm required")).toBeVisible();

    await userEvent.click(
      canvas.getByRole("button", { name: "Confirm archive" })
    );
    await expect(canvas.getByText("Applied")).toBeVisible();

    await userEvent.click(canvas.getByRole("button", { name: "Undo archive" }));
    await expect(canvas.getByText("Reverted")).toBeVisible();
  },
};

function InteractiveApprovalCoverage() {
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(
    () => new Set()
  );
  const [bulkMode, setBulkMode] = useState<
    "idle" | "confirming" | "applied" | "reverted"
  >("idle");

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return coverageRows;
    }

    return coverageRows.filter((row) =>
      [row.id, row.tenant, row.owner, row.status]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [query]);

  const selectedCount = filteredRows.filter((row) =>
    selectedIds.has(row.id)
  ).length;
  const allVisibleSelected =
    filteredRows.length > 0 &&
    filteredRows.every((row) => selectedIds.has(row.id));

  const selectAllVisible = () => {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (allVisibleSelected) {
        for (const row of filteredRows) {
          next.delete(row.id);
        }
      } else {
        for (const row of filteredRows) {
          next.add(row.id);
        }
      }

      return next;
    });
    setBulkMode("idle");
  };

  const setRowSelected = (rowId: string, checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (checked) {
        next.add(rowId);
      } else {
        next.delete(rowId);
      }

      return next;
    });
    setBulkMode("idle");
  };

  return (
    <main className="grid w-[min(1080px,calc(100vw-32px))] min-w-0 gap-4">
      <PageHeader
        blockId="coverage-interaction-header"
        description="Interaction story validates the governed block wiring operators depend on: filter, selection, confirmation, and undo."
        eyebrow="Coverage / Interaction"
        status={{ label: "Interactive", tone: "info" }}
        title="Approval interaction coverage"
      />
      <FilterBar
        activeFilters={
          query
            ? [{ id: "query", label: `Search: ${query}`, tone: "info" }]
            : undefined
        }
        blockId="coverage-interaction-filter"
        onReset={() => {
          setQuery("");
          setSelectedIds(new Set());
          setBulkMode("idle");
        }}
        onSearchChange={(event) => {
          setQuery(event.target.value);
          setSelectedIds(new Set());
          setBulkMode("idle");
        }}
        resultCount={filteredRows.length}
        searchLabel="Search approval coverage"
        searchPlaceholder="Search tenant, owner, or approval..."
        searchValue={query}
      />
      <DataTableShell
        blockId="coverage-interaction-table"
        bulkActions={
          selectedCount > 0 ? (
            <ReversibleBulkActionBar
              actionLabel="Confirm archive"
              blockId="coverage-interaction-bulk"
              mode={bulkMode}
              onCancel={() => setBulkMode("idle")}
              onConfirm={() => setBulkMode("applied")}
              onUndo={() => setBulkMode("reverted")}
              selectedCount={selectedCount}
              summary="Archive is reversible for 15 minutes and records one audit event per selected approval."
              undoLabel="Undo archive"
            />
          ) : null
        }
        footer={`Showing ${filteredRows.length} approvals`}
        selectedCount={selectedCount}
        title="Selectable approval queue"
        toolbar={
          <Button
            disabled={selectedCount === 0}
            onClick={() => setBulkMode("confirming")}
            size="sm"
            variant="secondary"
          >
            <ArchiveIcon aria-hidden="true" className="size-4" />
            Archive selected
          </Button>
        }
      >
        <ApprovalTable
          allSelected={allVisibleSelected}
          onSelectAll={selectAllVisible}
          onSelectRow={setRowSelected}
          rows={filteredRows}
          selectable
          selectedIds={selectedIds}
        />
      </DataTableShell>
    </main>
  );
}

function CoverageQueueTable({
  rows,
}: {
  readonly rows: readonly ApprovalRow[];
}) {
  return (
    <DataTableShell
      blockId="coverage-happy-table"
      footer={`Showing ${rows.length} of ${coverageRows.length} approvals`}
      selectedCount={0}
      title="Approval queue"
      toolbar={
        <>
          <Badge tone="warning" variant="outline">
            SLA first
          </Badge>
          <Badge tone="neutral" variant="outline">
            Tenant scoped
          </Badge>
        </>
      }
    >
      <ApprovalTable rows={rows} selectable={false} />
    </DataTableShell>
  );
}

function ApprovalTable({
  allSelected = false,
  onSelectAll,
  onSelectRow,
  rows,
  selectable,
  selectedIds,
}: {
  readonly allSelected?: boolean;
  readonly onSelectAll?: () => void;
  readonly onSelectRow?: (rowId: string, checked: boolean) => void;
  readonly rows: readonly ApprovalRow[];
  readonly selectable: boolean;
  readonly selectedIds?: ReadonlySet<string>;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {selectable ? (
            <TableHead className="w-10">
              <Checkbox
                aria-label="Select all"
                checked={allSelected}
                onCheckedChange={(checked) => {
                  if (checked !== "indeterminate") {
                    onSelectAll?.();
                  }
                }}
              />
            </TableHead>
          ) : null}
          <TableHead>Approval</TableHead>
          <TableHead>Tenant</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">SLA</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            {selectable ? (
              <TableCell>
                <Checkbox
                  aria-label={`Select ${row.id}`}
                  checked={selectedIds?.has(row.id) ?? false}
                  onCheckedChange={(checked) => {
                    if (checked !== "indeterminate") {
                      onSelectRow?.(row.id, checked);
                    }
                  }}
                />
              </TableCell>
            ) : null}
            <TableCell className="font-mono tabular-nums">{row.id}</TableCell>
            <TableCell>{row.tenant}</TableCell>
            <TableCell>{row.owner}</TableCell>
            <TableCell className="text-right font-mono tabular-nums">
              {row.amount}
            </TableCell>
            <TableCell>
              <span className="inline-flex items-center gap-1.5 text-[12px] leading-5">
                <span
                  aria-hidden="true"
                  className={`size-1.5 rounded-full ${statusDotClassName[row.tone]}`}
                />
                {row.status}
              </span>
            </TableCell>
            <TableCell className="text-right font-mono tabular-nums">
              {row.sla}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const statusDotClassName: Record<ApprovalTone, string> = {
  critical: "bg-danger",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
};
