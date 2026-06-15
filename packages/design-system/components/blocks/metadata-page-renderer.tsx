import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/components/afenda-ui/table";
import { cn } from "@repo/design-system/lib/utils";
import type { ReactNode } from "react";
import { blockRecipe } from "./block-recipes";
import { type BlockRegistry, getBlockRegistryEntry } from "./block-registry";
import { RuntimeStateBlock } from "./erp-state";
import { EmptyPanel, FilterBar, PageHeader, StatsStrip } from "./foundation";
import type { MetadataBlockRenderContext } from "./metadata-renderer-core";
import {
  createMetadataBlockRenderContext,
  resolveMetadataBlockActions,
} from "./metadata-renderer-core";
import type {
  MetadataBlock,
  MetadataBlockByType,
  MetadataBlockType,
  MetadataDataBinding,
  MetadataPage,
  MetadataScalar,
  MetadataValue,
} from "./metadata-schema";
import { metadataPageSchema } from "./metadata-schema";
import { BulkActionBar, DataTableShell } from "./operator";

type MetadataDataSources = Record<string, unknown>;
interface MetadataDataTableProps {
  readonly block: MetadataBlockByType<"dataTable">;
  readonly dataSources: MetadataDataSources;
  readonly renderContext: MetadataBlockRenderContext;
}

interface MetadataPageRendererProps {
  readonly className?: string;
  readonly dataSources?: MetadataDataSources;
  readonly page: MetadataPage | unknown;
}

interface MetadataBlockRendererProps<TType extends MetadataBlockType> {
  readonly block: MetadataBlockByType<TType>;
  readonly dataSources: MetadataDataSources;
  readonly renderContext: MetadataBlockRenderContext;
}

type MetadataBlockRendererMap = {
  readonly [TType in MetadataBlockType]: {
    readonly registry: BlockRegistry[TType];
    readonly render: (props: MetadataBlockRendererProps<TType>) => ReactNode;
  };
};

type BindingResolution =
  | { readonly ok: true; readonly value: unknown }
  | {
      readonly binding: MetadataDataBinding;
      readonly error: string;
      readonly ok: false;
    };

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
  const bindingDiagnostic = getRequiredBindingDiagnostic(block, dataSources);

  if (bindingDiagnostic) {
    return (
      <InvalidMetadataBlock
        blockId={block.blockId}
        description={bindingDiagnostic}
        title="Missing required binding"
      />
    );
  }

  const renderContext = createMetadataBlockRenderContext(block);

  return renderRegisteredMetadataBlock(block, dataSources, renderContext);
}

const metadataBlockRenderers = {
  bulkActionBar: {
    registry: getBlockRegistryEntry("bulkActionBar"),
    render: renderBulkActionBarBlock,
  },
  dataTable: {
    registry: getBlockRegistryEntry("dataTable"),
    render: renderDataTableBlock,
  },
  emptyPanel: {
    registry: getBlockRegistryEntry("emptyPanel"),
    render: renderEmptyPanelBlock,
  },
  filterBar: {
    registry: getBlockRegistryEntry("filterBar"),
    render: renderFilterBarBlock,
  },
  pageHeader: {
    registry: getBlockRegistryEntry("pageHeader"),
    render: renderPageHeaderBlock,
  },
  runtimeState: {
    registry: getBlockRegistryEntry("runtimeState"),
    render: renderRuntimeStateBlock,
  },
  statsStrip: {
    registry: getBlockRegistryEntry("statsStrip"),
    render: renderStatsStripBlock,
  },
} satisfies MetadataBlockRendererMap;

function renderRegisteredMetadataBlock(
  block: MetadataBlock,
  dataSources: MetadataDataSources,
  renderContext: MetadataBlockRenderContext
) {
  switch (block.type) {
    case "bulkActionBar":
      return metadataBlockRenderers.bulkActionBar.render({
        block,
        dataSources,
        renderContext,
      });
    case "dataTable":
      return metadataBlockRenderers.dataTable.render({
        block,
        dataSources,
        renderContext,
      });
    case "emptyPanel":
      return metadataBlockRenderers.emptyPanel.render({
        block,
        dataSources,
        renderContext,
      });
    case "filterBar":
      return metadataBlockRenderers.filterBar.render({
        block,
        dataSources,
        renderContext,
      });
    case "pageHeader":
      return metadataBlockRenderers.pageHeader.render({
        block,
        dataSources,
        renderContext,
      });
    case "runtimeState":
      return metadataBlockRenderers.runtimeState.render({
        block,
        dataSources,
        renderContext,
      });
    case "statsStrip":
      return metadataBlockRenderers.statsStrip.render({
        block,
        dataSources,
        renderContext,
      });
    default:
      return assertNever(block);
  }
}

function renderBulkActionBarBlock({
  block,
  dataSources,
  renderContext,
}: MetadataBlockRendererProps<"bulkActionBar">) {
  return (
    <BulkActionBar
      {...renderContext.baseProps}
      actions={resolveMetadataBlockActions(
        block.actions,
        renderContext,
        "primary"
      )}
      clearLabel={block.clearLabel}
      label={resolveMetadataText(block.label, dataSources)}
      selectedCount={
        toNumberValue(resolveMetadataValue(block.selectedCount, dataSources)) ??
        0
      }
    />
  );
}

function renderDataTableBlock({
  block,
  dataSources,
  renderContext,
}: MetadataBlockRendererProps<"dataTable">) {
  return (
    <MetadataDataTable
      block={block}
      dataSources={dataSources}
      renderContext={renderContext}
    />
  );
}

function renderEmptyPanelBlock({
  block,
  dataSources,
  renderContext,
}: MetadataBlockRendererProps<"emptyPanel">) {
  return (
    <EmptyPanel
      {...renderContext.baseProps}
      actions={resolveMetadataBlockActions(
        block.actions,
        renderContext,
        "primary"
      )}
      description={resolveMetadataText(block.description, dataSources)}
      title={resolveMetadataText(block.title, dataSources) ?? ""}
    />
  );
}

function renderFilterBarBlock({
  block,
  dataSources,
  renderContext,
}: MetadataBlockRendererProps<"filterBar">) {
  return (
    <FilterBar
      {...renderContext.baseProps}
      actions={resolveMetadataBlockActions(
        block.actions,
        renderContext,
        "primary"
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

function renderPageHeaderBlock({
  block,
  dataSources,
  renderContext,
}: MetadataBlockRendererProps<"pageHeader">) {
  return (
    <PageHeader
      {...renderContext.baseProps}
      actions={resolveMetadataBlockActions(
        block.actions,
        renderContext,
        "primary"
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

function renderRuntimeStateBlock({
  block,
  dataSources,
  renderContext,
}: MetadataBlockRendererProps<"runtimeState">) {
  return (
    <RuntimeStateBlock
      {...renderContext.baseProps}
      actions={resolveMetadataBlockActions(
        block.actions,
        renderContext,
        "primary"
      )}
      description={resolveMetadataText(block.description, dataSources)}
      state={block.state}
      title={resolveMetadataText(block.title, dataSources) ?? ""}
    />
  );
}

function renderStatsStripBlock({
  block,
  dataSources,
  renderContext,
}: MetadataBlockRendererProps<"statsStrip">) {
  return (
    <StatsStrip
      {...renderContext.baseProps}
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

function MetadataDataTable(props: MetadataDataTableProps) {
  const { block, dataSources, renderContext } = props;
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
      {...renderContext.baseProps}
      actions={resolveMetadataBlockActions(
        block.actions,
        renderContext,
        "primary"
      )}
      bulkActions={
        block.bulkActions ? (
          <BulkActionBar
            actions={resolveMetadataBlockActions(
              block.bulkActions,
              renderContext,
              "bulk"
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
  const resolution = resolveBinding(binding, dataSources);

  return resolution.ok ? resolution.value : undefined;
}

function resolveBinding(
  binding: MetadataDataBinding | undefined,
  dataSources: MetadataDataSources
): BindingResolution {
  if (!binding) {
    return { ok: true, value: undefined };
  }

  const source = dataSources[binding.source];
  const resolved = readPath(source, binding.path);

  if (resolved === undefined && "fallback" in binding) {
    return { ok: true, value: binding.fallback };
  }

  if (resolved === undefined && binding.required) {
    return {
      binding,
      error: `Required binding "${binding.source}:${binding.path}" did not resolve.`,
      ok: false,
    };
  }

  return { ok: true, value: resolved };
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

function getRequiredBindingDiagnostic(
  block: MetadataBlock,
  dataSources: MetadataDataSources
) {
  const missingBinding = findMissingRequiredBinding(block, dataSources);

  return missingBinding?.error;
}

function findMissingRequiredBinding(
  value: unknown,
  dataSources: MetadataDataSources
): (BindingResolution & { readonly ok: false }) | undefined {
  if (isMetadataDataBinding(value)) {
    const resolution = resolveBinding(value, dataSources);

    return resolution.ok ? undefined : resolution;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const issue = findMissingRequiredBinding(item, dataSources);

      if (issue) {
        return issue;
      }
    }

    return undefined;
  }

  if (isRecord(value)) {
    for (const item of Object.values(value)) {
      const issue = findMissingRequiredBinding(item, dataSources);

      if (issue) {
        return issue;
      }
    }
  }

  return undefined;
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
