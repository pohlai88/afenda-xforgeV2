import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/components/afenda-ui/table";
import { cn } from "@repo/design-system/lib/utils";
import { blockRecipe } from "./block-recipes";
import { RuntimeStateBlock } from "./erp-state";
import type { BlockAction } from "./foundation";
import { EmptyPanel, FilterBar, PageHeader, StatsStrip } from "./foundation";
import type {
  MetadataBlock,
  MetadataBlockAction,
  MetadataBlockByType,
  MetadataDataBinding,
  MetadataPage,
  MetadataScalar,
  MetadataValue,
} from "./metadata-schema";
import { metadataPageSchema } from "./metadata-schema";
import { BulkActionBar, DataTableShell } from "./operator";
import { orchestrateBlockState } from "./state-orchestration";

type MetadataDataSources = Record<string, unknown>;
type MetadataActionSurface = "primary" | "bulk";

interface MetadataActionContext {
  readonly blockId: string;
  readonly blockType: MetadataBlock["type"];
  readonly surface: MetadataActionSurface;
}

interface MetadataPageRendererProps {
  readonly className?: string;
  readonly dataSources?: MetadataDataSources;
  readonly page: MetadataPage | unknown;
}

function MetadataPageRenderer({
  className,
  dataSources = {},
  page,
}: MetadataPageRendererProps) {
  const parsedPage = metadataPageSchema.safeParse(page);

  if (!parsedPage.success) {
    return (
      <InvalidMetadataBlock
        blockId="metadata-page"
        description="Page metadata must match the versioned block schema."
        title="Invalid page metadata"
      />
    );
  }

  return (
    <section
      className={cn(blockRecipe("blockShell", "blockStack"), className)}
      data-page-id={parsedPage.data.pageId}
      data-slot="metadata-page-renderer-block"
      data-version={parsedPage.data.version}
    >
      {parsedPage.data.blocks.map((block) => (
        <MetadataBlockRenderer
          block={block}
          dataSources={dataSources}
          key={block.blockId}
        />
      ))}
    </section>
  );
}

function MetadataBlockRenderer({
  block,
  dataSources,
}: {
  readonly block: MetadataBlock;
  readonly dataSources: MetadataDataSources;
}) {
  switch (block.type) {
    case "bulkActionBar":
      return (
        <BulkActionBar
          {...toBaseProps(block)}
          actions={toBlockActions(
            block.actions,
            actionContext(block, "primary")
          )}
          clearLabel={block.clearLabel}
          label={resolveMetadataText(block.label, dataSources)}
          selectedCount={
            toNumberValue(
              resolveMetadataValue(block.selectedCount, dataSources)
            ) ?? 0
          }
        />
      );
    case "dataTable":
      return <MetadataDataTable block={block} dataSources={dataSources} />;
    case "emptyPanel": {
      return (
        <EmptyPanel
          {...toBaseProps(block)}
          actions={toBlockActions(
            block.actions,
            actionContext(block, "primary")
          )}
          description={resolveMetadataText(block.description, dataSources)}
          title={resolveMetadataText(block.title, dataSources) ?? ""}
        />
      );
    }
    case "filterBar": {
      return (
        <FilterBar
          {...toBaseProps(block)}
          actions={toBlockActions(
            block.actions,
            actionContext(block, "primary")
          )}
          activeFilters={resolveActiveFilters(
            block.activeFilters,
            block.filtersBinding,
            dataSources
          )}
          resultCount={resolveMetadataText(block.resultCount, dataSources)}
          searchLabel={block.searchLabel}
          searchPlaceholder={block.searchPlaceholder}
          searchValue={toStringValue(
            resolveBindingValue(block.searchValueBinding, dataSources)
          )}
        />
      );
    }
    case "pageHeader": {
      return (
        <PageHeader
          {...toBaseProps(block)}
          actions={toBlockActions(
            block.actions,
            actionContext(block, "primary")
          )}
          description={resolveMetadataText(block.description, dataSources)}
          eyebrow={resolveMetadataText(block.eyebrow, dataSources)}
          meta={block.meta?.map((item) => ({
            id: item.id,
            label: resolveMetadataText(item.label, dataSources),
          }))}
          status={block.status}
          title={resolveMetadataText(block.title, dataSources) ?? ""}
        />
      );
    }
    case "runtimeState": {
      return (
        <RuntimeStateBlock
          {...toBaseProps(block)}
          actions={toBlockActions(
            block.actions,
            actionContext(block, "primary")
          )}
          description={resolveMetadataText(block.description, dataSources)}
          state={block.state}
          title={resolveMetadataText(block.title, dataSources) ?? ""}
        />
      );
    }
    case "statsStrip": {
      return (
        <StatsStrip
          {...toBaseProps(block)}
          columns={block.columns}
          metrics={block.metrics.map((metric) => ({
            description: resolveMetadataText(metric.description, dataSources),
            id: metric.id,
            label: resolveMetadataText(metric.label, dataSources),
            tone: metric.tone,
            value: resolveMetadataText(metric.value, dataSources),
          }))}
        />
      );
    }
    default:
      return assertNever(block);
  }
}

function MetadataDataTable({
  block,
  dataSources,
}: {
  readonly block: MetadataBlockByType<"dataTable">;
  readonly dataSources: MetadataDataSources;
}) {
  const rows = resolveTableRows(block.data, dataSources);
  const selectedCount = toNumberValue(
    resolveMetadataValue(block.selectedCount, dataSources)
  );

  if (!rows.ok) {
    return (
      <InvalidMetadataBlock
        blockId={block.blockId}
        description={rows.error}
        title="Invalid table binding"
      />
    );
  }

  return (
    <DataTableShell
      {...toBaseProps(block)}
      actions={toBlockActions(block.actions, actionContext(block, "primary"))}
      bulkActions={
        block.bulkActions ? (
          <BulkActionBar
            actions={toBlockActions(
              block.bulkActions,
              actionContext(block, "bulk")
            )}
            selectedCount={selectedCount ?? 0}
          />
        ) : undefined
      }
      footer={resolveMetadataText(block.footer, dataSources)}
      selectedCount={selectedCount}
      title={resolveMetadataText(block.title, dataSources) ?? ""}
    >
      <Table variant="plain">
        <TableHeader>
          <TableRow>
            {block.columns.map((column) => (
              <TableHead
                className={cn(
                  column.align === "center" && "text-center",
                  column.align === "right" && "text-right"
                )}
                key={column.id}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.value.map((row, index) => (
            <TableRow key={getRowKey(row, index)}>
              {block.columns.map((column) => {
                const cellValue = readRecordValue(
                  row,
                  column.accessorKey ?? column.bindingPath ?? column.id
                );

                return (
                  <TableCell
                    className={cn(
                      "text-text-secondary",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right tabular-nums",
                      column.kind === "id" && "font-mono tabular-nums",
                      (column.kind === "money" || column.kind === "number") &&
                        "tabular-nums"
                    )}
                    key={column.id}
                  >
                    {formatCellValue(cellValue)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DataTableShell>
  );
}

function resolveTableRows(
  binding: MetadataDataBinding,
  dataSources: MetadataDataSources
):
  | { readonly ok: true; readonly value: readonly Record<string, unknown>[] }
  | { readonly error: string; readonly ok: false } {
  const resolved = resolveBindingValue(binding, dataSources);

  if (!Array.isArray(resolved)) {
    return {
      error: `Data binding "${binding.source}:${binding.path}" did not resolve to an array.`,
      ok: false,
    };
  }

  if (resolved.some((row) => !isRecord(row))) {
    return {
      error: `Data binding "${binding.source}:${binding.path}" contains non-object rows.`,
      ok: false,
    };
  }

  return {
    ok: true,
    value: resolved,
  };
}

function resolveBindingValue(
  binding: MetadataDataBinding | undefined,
  dataSources: MetadataDataSources
) {
  if (!binding) {
    return undefined;
  }

  const source = dataSources[binding.source];
  const resolved = readPath(source, binding.path);

  if (resolved === undefined && "fallback" in binding) {
    return binding.fallback;
  }

  return resolved;
}

function resolveMetadataValue(
  value: MetadataValue | undefined,
  dataSources: MetadataDataSources
) {
  if (value === undefined) {
    return undefined;
  }

  if (isMetadataDataBinding(value)) {
    const resolved = resolveBindingValue(value, dataSources);
    return formatCellValue(resolved ?? value.fallback ?? "");
  }

  return value;
}

function resolveMetadataText(
  value: MetadataValue | undefined,
  dataSources: MetadataDataSources
) {
  const resolved = resolveMetadataValue(value, dataSources);

  if (resolved === undefined || resolved === null) {
    return undefined;
  }

  return typeof resolved === "string" ? resolved : String(resolved);
}

function resolveActiveFilters(
  fallbackFilters:
    | readonly {
        readonly id: string;
        readonly label: string;
        readonly tone?: MetadataBlock["tone"];
      }[]
    | undefined,
  binding: MetadataDataBinding | undefined,
  dataSources: MetadataDataSources
) {
  const resolved = resolveBindingValue(binding, dataSources);

  if (!Array.isArray(resolved)) {
    return fallbackFilters;
  }

  return resolved.filter(isActiveFilterMetadata);
}

function toBaseProps(block: MetadataBlock) {
  const orchestrated = block.orchestration
    ? orchestrateBlockState(block.orchestration)
    : undefined;

  return {
    blockId: block.blockId,
    density: block.density,
    intent: block.intent,
    state: block.state ?? orchestrated?.state,
    tone: block.tone ?? orchestrated?.tone,
  };
}

function actionContext(
  block: MetadataBlock,
  surface: MetadataActionSurface
): MetadataActionContext {
  return {
    blockId: block.blockId,
    blockType: block.type,
    surface,
  };
}

function toBlockActions(
  actions: readonly MetadataBlockAction[] | undefined,
  context: MetadataActionContext
): readonly BlockAction[] | undefined {
  return actions?.map((action) => normalizeGovernedAction(action, context));
}

function normalizeGovernedAction(
  action: MetadataBlockAction,
  context: MetadataActionContext
): BlockAction {
  const actionKey = action.actionId ?? action.key;
  const disabledReason = getGovernedActionDisabledReason(action);
  const reason = disabledReason ?? action.reason ?? defaultActionReason(action);

  return {
    "aria-label": action["aria-label"],
    auditEvent:
      action.auditEvent ??
      `${context.blockType}.${context.surface}.${actionKey}`,
    auditScope: action.auditScope ?? context.blockId,
    capability:
      action.capability ??
      `${context.blockType}:${context.surface}:${actionKey}`,
    confirmationLabel: action.confirmationLabel,
    destructive: action.destructive,
    disabled: action.disabled || Boolean(disabledReason),
    href: action.href,
    key: action.key,
    label: action.label,
    permission:
      action.permission ??
      `blocks.${context.blockType}.${context.surface}.${actionKey}`,
    reason,
    roles: action.roles,
    variant: action.variant,
  };
}

function getGovernedActionDisabledReason(action: MetadataBlockAction) {
  if (action.disabled) {
    return action.reason ?? "Action disabled by page metadata.";
  }

  if (action.destructive && !action.confirmationLabel) {
    return "Destructive action requires a confirmation label.";
  }

  if (action.destructive && !action.auditEvent) {
    return "Destructive action requires an explicit audit event.";
  }

  return undefined;
}

function defaultActionReason(action: MetadataBlockAction) {
  return action.destructive
    ? "Requires confirmation and audit logging."
    : "Available for the current metadata scope.";
}

function getRowKey(row: Record<string, unknown>, index: number) {
  const rowId = row.id;

  if (typeof rowId === "string" || typeof rowId === "number") {
    return rowId;
  }

  return index;
}

function readPath(source: unknown, path: string) {
  return path
    .split(".")
    .filter(Boolean)
    .reduce<unknown>((current, segment) => {
      if (current === undefined || current === null) {
        return undefined;
      }

      if (Array.isArray(current)) {
        const index = Number(segment);
        return Number.isInteger(index) ? current[index] : undefined;
      }

      if (isRecord(current)) {
        return current[segment];
      }

      return undefined;
    }, source);
}

function readRecordValue(record: Record<string, unknown>, path: string) {
  return readPath(record, path);
}

function formatCellValue(value: unknown): MetadataScalar {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (value === undefined) {
    return "";
  }

  return String(value);
}

function toStringValue(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  return undefined;
}

function toNumberValue(value: unknown) {
  return typeof value === "number" ? value : undefined;
}

function InvalidMetadataBlock({
  blockId,
  description,
  title,
}: {
  readonly blockId?: string;
  readonly description: string;
  readonly title: string;
}) {
  return (
    <EmptyPanel
      blockId={blockId}
      description={description}
      intent="configuration"
      title={title}
      tone="warning"
    />
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMetadataDataBinding(value: unknown): value is MetadataDataBinding {
  return (
    isRecord(value) &&
    typeof value.source === "string" &&
    typeof value.path === "string"
  );
}

function isActiveFilterMetadata(value: unknown): value is {
  readonly id: string;
  readonly label: string;
  readonly tone?: MetadataBlock["tone"];
} {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.label === "string" &&
    (value.tone === undefined ||
      value.tone === "critical" ||
      value.tone === "info" ||
      value.tone === "neutral" ||
      value.tone === "success" ||
      value.tone === "warning")
  );
}

function assertNever(value: never): never {
  throw new Error(`Unhandled metadata block: ${JSON.stringify(value)}`);
}

export { MetadataPageRenderer };
export type { MetadataDataSources, MetadataPageRendererProps };
