"use client";

import {
  Badge,
  Button,
  Checkbox,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Kbd,
  KbdSequence,
  Progress,
  Separator,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/design-system";
import { cn } from "@repo/design-system/lib/utils";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Header,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ClockIcon,
  Columns3Icon,
  DatabaseIcon,
  SearchIcon,
  ShieldAlertIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { useMemo, useState } from "react";
import { blockRecipe } from "./block-recipes";
import type { BlockAction, PageHeaderMeta, StatsMetric } from "./foundation";
import { BlockActionButton, FormSection, PageHeader } from "./foundation";

type BlockTone = "neutral" | "info" | "success" | "warning" | "critical";
type SaveState = "idle" | "saving" | "saved" | "conflict" | "offline" | "error";

const metricToneClassName: Record<BlockTone, string> = {
  neutral: "",
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  critical: "text-danger",
};

const tableSkeletonRows = [
  "skeleton-row-1",
  "skeleton-row-2",
  "skeleton-row-3",
  "skeleton-row-4",
  "skeleton-row-5",
  "skeleton-row-6",
] as const;

type AdvancedDataTableProps<TData extends object> =
  ComponentProps<"section"> & {
    readonly actions?: readonly BlockAction[] | ReactNode;
    readonly bulkActions?: ReactNode;
    readonly columns: readonly ColumnDef<TData, unknown>[];
    readonly data: readonly TData[];
    readonly description?: ReactNode;
    readonly emptyMessage?: ReactNode;
    readonly getRowId?: (row: TData, index: number) => string;
    readonly getRowSelectionLabel?: (row: TData) => string;
    readonly initialPageSize?: number;
    readonly isLoading?: boolean;
    readonly searchPlaceholder?: string;
    readonly title: ReactNode;
  };

function AdvancedDataTable<TData extends object>({
  actions,
  bulkActions,
  className,
  columns,
  data,
  description,
  emptyMessage = "No records match the current view.",
  getRowId,
  getRowSelectionLabel = getDefaultRowSelectionLabel,
  initialPageSize = 10,
  isLoading = false,
  searchPlaceholder = "Search table...",
  title,
  ...props
}: AdvancedDataTableProps<TData>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const tableColumns = useMemo<ColumnDef<TData, unknown>[]>(
    () => [
      {
        id: "select",
        enableHiding: false,
        enableSorting: false,
        header: ({ table }) => (
          <Checkbox
            aria-label="Select all rows"
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(Boolean(value))
            }
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            aria-label={getRowSelectionLabel(row.original)}
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
          />
        ),
      },
      ...columns,
    ],
    [columns, getRowSelectionLabel]
  );
  const tableData = useMemo(() => [...data], [data]);

  const table = useReactTable({
    columns: tableColumns,
    data: tableData,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId,
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      columnVisibility,
      globalFilter,
      rowSelection,
      sorting,
    },
  });

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <section
      className={cn(blockRecipe("blockPanel"), "overflow-hidden", className)}
      data-slot="advanced-data-table-block"
      {...props}
    >
      <div className="grid gap-3 p-[var(--card-padding)]">
        <div className={blockRecipe("blockHeader")}>
          <div className={blockRecipe("blockHeaderContent")}>
            <h2 className={blockRecipe("blockTitle")}>{title}</h2>
            {description ? (
              <p className={blockRecipe("blockDescription")}>{description}</p>
            ) : null}
          </div>
          <div className={blockRecipe("blockToolbar")}>
            <AdvancedBlockActions actions={actions} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="quiet">
                  <Columns3Icon aria-hidden="true" className="size-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Visible columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      checked={column.getIsVisible()}
                      key={column.id}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(Boolean(value))
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative min-w-56 flex-1 lg:max-w-80">
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-tertiary"
            />
            <Input
              aria-label="Search table"
              className="pl-9"
              onChange={(event) => setGlobalFilter(event.target.value)}
              placeholder={searchPlaceholder}
              value={globalFilter}
            />
          </div>
          <div className="flex items-center gap-2 text-[length:var(--xforge-font-caption-size)] text-text-secondary tabular-nums leading-[var(--xforge-font-caption-line-height)]">
            <span>{table.getFilteredRowModel().rows.length} rows</span>
            <span aria-hidden="true">/</span>
            <span>{selectedCount} selected</span>
            <KbdSequence>
              <Kbd size="sm">J</Kbd>
              <Kbd size="sm">K</Kbd>
            </KbdSequence>
          </div>
        </div>

        {selectedCount > 0 ? (
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-[var(--xforge-radius-md)] border border-brand-primary/30 bg-brand-primary/5 px-3 py-2">
            <span className="font-medium text-[13px] text-text-primary tabular-nums">
              {selectedCount} selected
            </span>
            <div className={blockRecipe("blockToolbar")}>
              {bulkActions}
              <Button
                onClick={() => table.resetRowSelection()}
                size="sm"
                variant="quiet"
              >
                Clear
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <Table className="rounded-none border-x-0 border-b-0" variant="plain">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  <AdvancedTableHeaderContent header={header} />
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading
            ? tableSkeletonRows
                .slice(0, Math.min(initialPageSize, tableSkeletonRows.length))
                .map((rowKey) => (
                  <TableRow key={rowKey}>
                    {table.getVisibleFlatColumns().map((column) => (
                      <TableCell key={column.id}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            : null}
          {!isLoading && table.getRowModel().rows.length
            ? table.getRowModel().rows.map((row) => (
                <TableRow
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : null}
          {isLoading || table.getRowModel().rows.length ? null : (
            <TableRow>
              <TableCell
                className="h-24 text-center text-text-secondary"
                colSpan={table.getVisibleFlatColumns().length}
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 border-border-default border-t p-3">
        <span className="text-[length:var(--xforge-font-caption-size)] text-text-secondary tabular-nums leading-[var(--xforge-font-caption-line-height)]">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {Math.max(table.getPageCount(), 1)}
        </span>
        <div className={blockRecipe("blockToolbar")}>
          <Button
            aria-label="First page"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
            size="icon-sm"
            variant="quiet"
          >
            <ChevronsLeftIcon aria-hidden="true" className="size-4" />
          </Button>
          <Button
            aria-label="Previous page"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            size="icon-sm"
            variant="quiet"
          >
            <ChevronLeftIcon aria-hidden="true" className="size-4" />
          </Button>
          <Button
            aria-label="Next page"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            size="icon-sm"
            variant="quiet"
          >
            <ChevronRightIcon aria-hidden="true" className="size-4" />
          </Button>
          <Button
            aria-label="Last page"
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            size="icon-sm"
            variant="quiet"
          >
            <ChevronsRightIcon aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function AdvancedTableHeaderContent<TData extends object>({
  header,
}: {
  readonly header: Header<TData, unknown>;
}) {
  if (header.isPlaceholder) {
    return null;
  }

  const content = flexRender(
    header.column.columnDef.header,
    header.getContext()
  );

  if (!header.column.getCanSort()) {
    return content;
  }

  return (
    <Button
      aria-label={`Sort by ${header.column.id}`}
      className="h-auto justify-start gap-1 px-0 py-0 text-left font-inherit text-inherit hover:text-text-primary focus-visible:text-text-primary"
      onClick={header.column.getToggleSortingHandler()}
      size="sm"
      type="button"
      variant="quiet"
    >
      {content}
      <ChevronDownIcon
        aria-hidden="true"
        className={cn(
          "size-3 transition-transform motion-reduce:transition-none",
          header.column.getIsSorted() === "asc" && "rotate-180",
          !header.column.getIsSorted() && "opacity-35"
        )}
      />
    </Button>
  );
}

interface CommandSearchItem {
  readonly description?: ReactNode;
  readonly id: string;
  readonly keywords?: readonly string[];
  readonly onSelect?: () => void;
  readonly shortcut?: string;
  readonly title: string;
  readonly tone?: BlockTone;
}

interface CommandSearchGroup {
  readonly heading: string;
  readonly items: readonly CommandSearchItem[];
}

type CommandSearchBlockProps = ComponentProps<"section"> & {
  readonly groups: readonly CommandSearchGroup[];
  readonly placeholder?: string;
  readonly title?: ReactNode;
};

function CommandSearchBlock({
  className,
  groups,
  placeholder = "Search tenants, approvals, policies...",
  title = "Command search",
  ...props
}: CommandSearchBlockProps) {
  return (
    <section
      className={cn(blockRecipe("blockPanel"), "overflow-hidden", className)}
      data-slot="command-search-block"
      {...props}
    >
      <div className="flex items-center justify-between gap-3 border-border-default border-b px-3 py-2">
        <h2 className={blockRecipe("blockTitle")}>{title}</h2>
        <KbdSequence>
          <Kbd size="sm">Ctrl</Kbd>
          <Kbd size="sm">K</Kbd>
        </KbdSequence>
      </div>
      <Command>
        <CommandInput placeholder={placeholder} />
        <CommandList>
          <CommandEmpty>No matching operational records.</CommandEmpty>
          {groups.map((group, index) => (
            <div key={group.heading}>
              {index > 0 ? <CommandSeparator /> : null}
              <CommandGroup heading={group.heading}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.id}
                    keywords={item.keywords ? [...item.keywords] : undefined}
                    onSelect={item.onSelect}
                    value={`${item.title} ${item.description ?? ""}`}
                  >
                    <StatusDot tone={item.tone ?? "neutral"} />
                    <span className="grid min-w-0 gap-0.5">
                      <span className="truncate font-medium">{item.title}</span>
                      {item.description ? (
                        <span className="truncate text-text-secondary">
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                    {item.shortcut ? (
                      <CommandShortcut>{item.shortcut}</CommandShortcut>
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ))}
        </CommandList>
      </Command>
    </section>
  );
}

interface ApprovalQueueRow {
  readonly amount: string;
  readonly approvalId: string;
  readonly assignee: string;
  readonly evidence: string;
  readonly requestedAt: string;
  readonly risk: BlockTone;
  readonly sla: string;
  readonly tenant: string;
}

type ApprovalQueueBlockProps = Omit<
  AdvancedDataTableProps<ApprovalQueueRow>,
  "columns" | "data" | "title"
> & {
  readonly rows: readonly ApprovalQueueRow[];
};

const approvalQueueColumns: ColumnDef<ApprovalQueueRow, unknown>[] = [
  {
    accessorKey: "approvalId",
    header: "Approval ID",
    cell: ({ row }) => (
      <span className="font-mono text-text-secondary">
        {row.original.approvalId}
      </span>
    ),
  },
  {
    accessorKey: "tenant",
    header: "Tenant",
    cell: ({ row }) => (
      <div className="grid gap-0.5">
        <span className="font-medium">{row.original.tenant}</span>
        <span className="text-text-secondary">{row.original.evidence}</span>
      </div>
    ),
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
  },
  {
    accessorKey: "risk",
    header: "Risk",
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-2">
        <StatusDot tone={row.original.risk} />
        <span className="capitalize">{row.original.risk}</span>
      </span>
    ),
  },
  {
    accessorKey: "sla",
    header: "SLA",
    cell: ({ row }) => (
      <span className="font-mono tabular-nums">{row.original.sla}</span>
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
];

function ApprovalQueueBlock({ rows, ...props }: ApprovalQueueBlockProps) {
  return (
    <AdvancedDataTable
      bulkActions={
        <>
          <Button size="sm" variant="secondary">
            Approve
          </Button>
          <Button size="sm" variant="quiet">
            Reassign
          </Button>
        </>
      }
      columns={approvalQueueColumns}
      data={rows}
      description="Review evidence, SLA pressure, and tenant boundaries before approval."
      getRowId={(row) => row.approvalId}
      getRowSelectionLabel={(row) => `Select approval ${row.approvalId}`}
      searchPlaceholder="Search approval, tenant, assignee..."
      title="Approval queue"
      {...props}
    />
  );
}

interface RiskEvidenceItem {
  readonly actor: string;
  readonly detail: ReactNode;
  readonly id: string;
  readonly time: string;
  readonly tone?: BlockTone;
}

type RiskEvidencePanelProps = ComponentProps<"section"> & {
  readonly evidence: readonly RiskEvidenceItem[];
  readonly metrics: readonly StatsMetric[];
  readonly progress?: {
    readonly label: string;
    readonly tone?: "brand" | "success" | "warning" | "danger" | "neutral";
    readonly value: number;
  };
  readonly title?: ReactNode;
};

function RiskEvidencePanel({
  className,
  evidence,
  metrics,
  progress,
  title = "Risk evidence",
  ...props
}: RiskEvidencePanelProps) {
  return (
    <section
      className={cn(
        blockRecipe("blockPanel", "blockPanelPadding"),
        "grid gap-4",
        className
      )}
      data-slot="risk-evidence-panel-block"
      {...props}
    >
      <div className={blockRecipe("blockHeader")}>
        <div className={blockRecipe("blockHeaderContent")}>
          <h2 className={blockRecipe("blockTitle")}>{title}</h2>
          <p className={blockRecipe("blockDescription")}>
            Current controls, audit pressure, and accountable events.
          </p>
        </div>
        <Badge tone="warning" variant="outline">
          Evidence required
        </Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div
            className="grid min-w-0 gap-1 border-border-default border-t pt-3 first:border-t-0 first:pt-0 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-3 sm:first:border-l-0 sm:first:pl-0"
            key={metric.id}
          >
            <span className={blockRecipe("blockMetricLabel")}>
              {metric.label}
            </span>
            <strong
              className={cn(
                blockRecipe("blockMetric"),
                metricToneClassName[metric.tone ?? "neutral"]
              )}
            >
              {metric.value}
            </strong>
            {metric.description ? (
              <p className={blockRecipe("blockDescription")}>
                {metric.description}
              </p>
            ) : null}
          </div>
        ))}
      </div>
      {progress ? (
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3 text-[length:var(--xforge-font-caption-size)] leading-[var(--xforge-font-caption-line-height)]">
            <span className="text-text-secondary">{progress.label}</span>
            <span className="font-mono text-text-primary tabular-nums">
              {progress.value}%
            </span>
          </div>
          <Progress
            aria-label={`${progress.label} progress`}
            tone={progress.tone ?? "warning"}
            value={progress.value}
          />
        </div>
      ) : null}
      <Separator />
      {evidence.length ? (
        <ol className="grid gap-3">
          {evidence.map((item) => (
            <li className="grid grid-cols-[auto_1fr] gap-3" key={item.id}>
              <StatusDot tone={item.tone ?? "neutral"} />
              <div className="grid min-w-0 gap-1">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="font-medium text-text-primary">
                    {item.actor}
                  </span>
                  <span className="font-mono text-text-secondary text-xs tabular-nums">
                    {item.time}
                  </span>
                </div>
                <p className={blockRecipe("blockDescription")}>{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="rounded-[var(--xforge-radius-sm)] border border-border-default border-dashed bg-surface px-3 py-2 text-text-secondary text-xs">
          No evidence events are attached to this record yet.
        </div>
      )}
    </section>
  );
}

type RecordEditorBlockProps = ComponentProps<typeof FormSection> & {
  readonly lastSavedAt?: string;
  readonly saveState?: SaveState;
};

const saveStateMeta: Record<
  SaveState,
  { readonly label: string; readonly tone: BlockTone; readonly icon: ReactNode }
> = {
  idle: {
    label: "Idle",
    tone: "neutral",
    icon: <ClockIcon aria-hidden="true" className="size-4" />,
  },
  saving: {
    label: "Saving",
    tone: "info",
    icon: <DatabaseIcon aria-hidden="true" className="size-4" />,
  },
  saved: {
    label: "Saved",
    tone: "success",
    icon: <CheckCircle2Icon aria-hidden="true" className="size-4" />,
  },
  conflict: {
    label: "Conflict",
    tone: "warning",
    icon: <ShieldAlertIcon aria-hidden="true" className="size-4" />,
  },
  offline: {
    label: "Offline",
    tone: "warning",
    icon: <AlertTriangleIcon aria-hidden="true" className="size-4" />,
  },
  error: {
    label: "Save failed",
    tone: "critical",
    icon: <AlertTriangleIcon aria-hidden="true" className="size-4" />,
  },
};

function RecordEditorBlock({
  actions,
  footer,
  lastSavedAt,
  saveState = "idle",
  status,
  ...props
}: RecordEditorBlockProps) {
  const state = saveStateMeta[saveState];

  return (
    <FormSection
      actions={
        <>
          <Badge tone={blockToneToBadgeTone[state.tone]} variant="outline">
            {state.icon}
            {state.label}
          </Badge>
          {actions}
        </>
      }
      footer={
        footer ?? (
          <span>
            {lastSavedAt
              ? `Last saved ${lastSavedAt}.`
              : "Changes are staged locally until saved."}
          </span>
        )
      }
      status={status}
      {...props}
    />
  );
}

interface DashboardTab {
  readonly content: ReactNode;
  readonly count?: number;
  readonly label: string;
  readonly value: string;
}

type OperationalDashboardShellProps = ComponentProps<"section"> & {
  readonly actions?: readonly BlockAction[] | ReactNode;
  readonly description?: ReactNode;
  readonly filters?: ReactNode;
  readonly meta?: readonly PageHeaderMeta[];
  readonly nav?: readonly {
    readonly active?: boolean;
    readonly icon?: ReactNode;
    readonly label: string;
  }[];
  readonly status?: {
    readonly label: string;
    readonly tone?: BlockTone;
  };
  readonly tabs: readonly DashboardTab[];
  readonly title: ReactNode;
};

function OperationalDashboardShell({
  actions,
  className,
  description,
  filters,
  meta,
  nav,
  status,
  tabs,
  title,
  ...props
}: OperationalDashboardShellProps) {
  const defaultTab = tabs[0]?.value;

  return (
    <section
      className={cn(
        "grid min-h-[640px] min-w-0 grid-cols-1 overflow-hidden rounded-[var(--card-radius)] border border-border-default bg-surface text-text-primary lg:grid-cols-[220px_1fr]",
        className
      )}
      data-slot="operational-dashboard-shell-block"
      {...props}
    >
      {nav?.length ? (
        <aside className="grid content-start gap-2 border-border-default border-b bg-surface-muted/50 p-3 lg:border-r lg:border-b-0">
          <div className="mb-1 flex items-center justify-between gap-2 px-2">
            <span className="font-semibold text-[13px]">Afenda ERP</span>
            <Kbd size="sm">⌘K</Kbd>
          </div>
          <nav aria-label="Operational navigation" className="grid gap-1">
            {nav.map((item) => (
              <Button
                aria-current={item.active ? "page" : undefined}
                className={cn(
                  "h-8 justify-start gap-2 px-2 text-left text-text-secondary hover:bg-surface-hover hover:text-text-primary",
                  item.active && "bg-brand-primary/10 text-brand-primary"
                )}
                key={item.label}
                size="sm"
                type="button"
                variant="quiet"
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </Button>
            ))}
          </nav>
        </aside>
      ) : null}
      <div className="grid min-w-0 content-start gap-4 p-4">
        <PageHeader
          actions={actions}
          description={description}
          meta={meta}
          status={status}
          title={title}
        />
        {filters}
        <Tabs defaultValue={defaultTab}>
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
                {typeof tab.count === "number" ? (
                  <span className="font-mono text-text-secondary tabular-nums">
                    {tab.count}
                  </span>
                ) : null}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

function getDefaultRowSelectionLabel<TData extends object>(row: TData) {
  if (
    "id" in row &&
    (typeof row.id === "string" || typeof row.id === "number")
  ) {
    return `Select row ${row.id}`;
  }

  return "Select row";
}

function StatusDot({ tone }: { readonly tone: BlockTone }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "mt-1 size-2 shrink-0 rounded-full",
        tone === "neutral" && "bg-text-tertiary",
        tone === "info" && "bg-info",
        tone === "success" && "bg-success",
        tone === "warning" && "bg-warning",
        tone === "critical" && "bg-danger"
      )}
    />
  );
}

const blockToneToBadgeTone: Record<
  BlockTone,
  ComponentProps<typeof Badge>["tone"]
> = {
  critical: "critical",
  info: "info",
  neutral: "neutral",
  success: "positive",
  warning: "warning",
};

function AdvancedBlockActions({
  actions,
}: {
  readonly actions?: readonly BlockAction[] | ReactNode;
}) {
  if (!actions) {
    return null;
  }

  if (isBlockActionArray(actions)) {
    return (
      <>
        {actions.map((action) => (
          <BlockActionButton action={action} key={action.key} />
        ))}
      </>
    );
  }

  return actions;
}

function isBlockActionArray(
  actions: readonly BlockAction[] | ReactNode
): actions is readonly BlockAction[] {
  return (
    Array.isArray(actions) &&
    actions.every(
      (action) =>
        action &&
        typeof action === "object" &&
        "key" in action &&
        typeof action.key === "string" &&
        "label" in action &&
        typeof action.label === "string"
    )
  );
}

export {
  AdvancedDataTable,
  ApprovalQueueBlock,
  CommandSearchBlock,
  OperationalDashboardShell,
  RecordEditorBlock,
  RiskEvidencePanel,
};
export type {
  AdvancedDataTableProps,
  ApprovalQueueBlockProps,
  ApprovalQueueRow,
  CommandSearchBlockProps,
  CommandSearchGroup,
  CommandSearchItem,
  DashboardTab,
  RecordEditorBlockProps,
  RiskEvidenceItem,
  RiskEvidencePanelProps,
};
