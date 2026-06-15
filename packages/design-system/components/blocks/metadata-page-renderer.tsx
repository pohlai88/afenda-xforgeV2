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
import type {
  MetadataBindingDiagnostic,
  MetadataBindingResolution,
} from "./metadata-binding";
import { isRecord, readPath, resolveMetadataBinding } from "./metadata-binding";
import type {
  MetadataDiagnosticsReport,
  MetadataDiagnosticsSink,
} from "./metadata-diagnostics";
import {
  createMetadataDiagnosticsCollector,
  createMetadataDiagnosticsDispatcher,
} from "./metadata-diagnostics";
import type {
  MetadataBlockRenderContext,
  MetadataPermissionContext,
  MetadataPermissionDecision,
} from "./metadata-renderer-core";
import {
  createMetadataBlockRenderContext,
  resolveMetadataBlockActions,
  resolveMetadataBlockPermission,
} from "./metadata-renderer-core";
import type {
  MetadataBlock,
  MetadataBlockAction,
  MetadataBlockByType,
  MetadataBlockType,
  MetadataDataBinding,
  MetadataDataSources,
  MetadataLayoutItem,
  MetadataPage,
  MetadataPageLayout,
  MetadataScalar,
  MetadataValue,
} from "./metadata-schema";
import { metadataPageSchema } from "./metadata-schema";
import { BulkActionBar, DataTableShell } from "./operator";

interface MetadataDataTableProps {
  readonly block: MetadataBlockByType<"dataTable">;
  readonly dataSources: MetadataDataSources;
  readonly renderContext: MetadataBlockRenderContext;
}

interface MetadataPageRendererProps {
  readonly className?: string;
  readonly dataSources?: MetadataDataSources;
  readonly debug?: boolean;
  readonly diagnostics?: MetadataDiagnosticsSink;
  readonly page: MetadataPage | unknown;
  readonly permissionContext?: MetadataPermissionContext;
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

function MetadataPageRenderer({
  className,
  dataSources = {},
  debug = false,
  diagnostics,
  page,
  permissionContext,
}: MetadataPageRendererProps) {
  const diagnosticsCollector = createMetadataDiagnosticsCollector();
  const diagnosticsSink = diagnostics
    ? createMetadataDiagnosticsDispatcher([diagnosticsCollector, diagnostics])
    : diagnosticsCollector;
  const parsedPage = metadataPageSchema.safeParse(page);

  if (!parsedPage.success) {
    diagnosticsSink.emitDiagnostic?.({
      code: "page.invalid",
      details: {
        issues: parsedPage.error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path.join("."),
        })),
      },
      message: "Page metadata must match the versioned block schema.",
      severity: "error",
    });
    diagnosticsSink.emitTelemetry?.({
      name: "metadata.page.invalid",
      properties: {
        issueCount: parsedPage.error.issues.length,
      },
    });

    return (
      <>
        <InvalidMetadataBlock
          blockId="metadata-page"
          description="Page metadata must match the versioned block schema."
          title="Invalid page metadata"
        />
        {debug ? (
          <MetadataDebugPanel report={diagnosticsCollector.report} />
        ) : null}
      </>
    );
  }

  return (
    <section
      className={cn(blockRecipe("blockShell", "blockStack"), className)}
      data-page-id={parsedPage.data.pageId}
      data-slot="metadata-page-renderer-block"
      data-version={parsedPage.data.version}
    >
      {parsedPage.data.layout ? (
        <MetadataPageLayoutRenderer
          dataSources={dataSources}
          diagnostics={diagnosticsSink}
          layout={parsedPage.data.layout}
          page={parsedPage.data}
          permissionContext={permissionContext}
        />
      ) : (
        parsedPage.data.blocks.map((block) => (
          <MetadataBlockRenderer
            block={block}
            dataSources={dataSources}
            diagnostics={diagnosticsSink}
            key={block.blockId}
            pageId={parsedPage.data.pageId}
            permissionContext={permissionContext}
          />
        ))
      )}
      {debug ? (
        <MetadataDebugPanel report={diagnosticsCollector.report} />
      ) : null}
    </section>
  );
}

function MetadataPageLayoutRenderer({
  dataSources,
  diagnostics,
  layout,
  page,
  permissionContext,
}: {
  readonly dataSources: MetadataDataSources;
  readonly diagnostics?: MetadataDiagnosticsSink;
  readonly layout: MetadataPageLayout;
  readonly page: MetadataPage;
  readonly permissionContext?: MetadataPermissionContext;
}) {
  const blockMap = new Map(
    page.blocks.map((block) => [block.blockId, block] as const)
  );
  const visibleBlockIds = new Set<string>();

  return (
    <div
      className="grid gap-4"
      data-layout-density={layout.density}
      data-layout-type={layout.type}
      data-slot="metadata-page-layout-block"
    >
      {layout.regions.map((region) => (
        <section
          className="grid gap-4"
          data-layout-responsive={formatResponsiveRules(region.responsive)}
          data-region-id={region.regionId}
          data-slot="metadata-page-layout-region"
          key={region.regionId}
        >
          {region.label ? <h2 className="sr-only">{region.label}</h2> : null}
          {region.children.map((item) => (
            <MetadataLayoutItemRenderer
              blockMap={blockMap}
              dataSources={dataSources}
              diagnostics={diagnostics}
              item={item}
              key={item.layoutId}
              pageId={page.pageId}
              permissionContext={permissionContext}
              visibleBlockIds={visibleBlockIds}
            />
          ))}
        </section>
      ))}
    </div>
  );
}

function MetadataLayoutItemRenderer({
  blockMap,
  dataSources,
  diagnostics,
  item,
  pageId,
  permissionContext,
  visibleBlockIds,
}: {
  readonly blockMap: ReadonlyMap<string, MetadataBlock>;
  readonly dataSources: MetadataDataSources;
  readonly diagnostics?: MetadataDiagnosticsSink;
  readonly item: MetadataLayoutItem;
  readonly pageId?: string;
  readonly permissionContext?: MetadataPermissionContext;
  readonly visibleBlockIds: Set<string>;
}) {
  if (!isMetadataLayoutItemVisible(item, dataSources, visibleBlockIds)) {
    return null;
  }

  if (item.type === "block") {
    const block = blockMap.get(item.blockId);

    if (!block) {
      return (
        <InvalidMetadataBlock
          blockId={item.blockId}
          description="Layout references a block that is not present in page metadata."
          title="Invalid layout block"
        />
      );
    }

    if (isMetadataLayoutBlockVisible(block, permissionContext)) {
      visibleBlockIds.add(block.blockId);
    }

    return (
      <div
        data-layout-id={item.layoutId}
        data-layout-responsive={formatResponsiveRules(item.responsive)}
        data-layout-type={item.type}
        data-slot="metadata-layout-block-item"
      >
        <MetadataBlockRenderer
          block={block}
          dataSources={dataSources}
          diagnostics={diagnostics}
          pageId={pageId}
          permissionContext={permissionContext}
        />
      </div>
    );
  }

  if (item.type === "group") {
    return (
      <section
        className="grid gap-3"
        data-layout-id={item.layoutId}
        data-layout-responsive={formatResponsiveRules(item.responsive)}
        data-layout-type={item.type}
        data-slot="metadata-layout-group"
      >
        {item.title ? <h2 className="sr-only">{item.title}</h2> : null}
        {item.children.map((child) => (
          <MetadataLayoutItemRenderer
            blockMap={blockMap}
            dataSources={dataSources}
            diagnostics={diagnostics}
            item={child}
            key={child.layoutId}
            pageId={pageId}
            permissionContext={permissionContext}
            visibleBlockIds={visibleBlockIds}
          />
        ))}
      </section>
    );
  }

  if (item.type === "columns") {
    return (
      <section
        className={cn(
          "grid gap-4",
          getMetadataLayoutColumnClass(item.columns.length)
        )}
        data-layout-id={item.layoutId}
        data-layout-responsive={formatResponsiveRules(item.responsive)}
        data-layout-type={item.type}
        data-slot="metadata-layout-columns"
      >
        {item.title ? <h2 className="sr-only">{item.title}</h2> : null}
        {item.columns.map((column) => (
          <div
            className="grid gap-4"
            data-column-id={column.columnId}
            data-column-span={column.span}
            data-slot="metadata-layout-column"
            key={column.columnId}
          >
            {column.children.map((child) => (
              <MetadataLayoutItemRenderer
                blockMap={blockMap}
                dataSources={dataSources}
                diagnostics={diagnostics}
                item={child}
                key={child.layoutId}
                pageId={pageId}
                permissionContext={permissionContext}
                visibleBlockIds={visibleBlockIds}
              />
            ))}
          </div>
        ))}
      </section>
    );
  }

  return (
    <section
      className="grid gap-4"
      data-layout-id={item.layoutId}
      data-layout-responsive={formatResponsiveRules(item.responsive)}
      data-layout-type={item.type}
      data-slot="metadata-layout-tabs"
    >
      {item.title ? <h2 className="sr-only">{item.title}</h2> : null}
      <div
        className="flex flex-wrap gap-2"
        data-slot="metadata-layout-tab-list"
      >
        {item.tabs.map((tab) => (
          <span
            className="rounded-md border border-border-subtle bg-surface-raised px-3 py-1 text-[length:var(--xforge-font-caption-size)] text-text-secondary leading-[var(--xforge-font-caption-line-height)]"
            data-tab-id={tab.tabId}
            key={tab.tabId}
          >
            {tab.label}
          </span>
        ))}
      </div>
      {item.tabs.map((tab) => (
        <section
          aria-label={tab.label}
          className="grid gap-4"
          data-slot="metadata-layout-tab-panel"
          data-tab-id={tab.tabId}
          key={tab.tabId}
        >
          {tab.children.map((child) => (
            <MetadataLayoutItemRenderer
              blockMap={blockMap}
              dataSources={dataSources}
              diagnostics={diagnostics}
              item={child}
              key={child.layoutId}
              pageId={pageId}
              permissionContext={permissionContext}
              visibleBlockIds={visibleBlockIds}
            />
          ))}
        </section>
      ))}
    </section>
  );
}

function isMetadataLayoutBlockVisible(
  block: MetadataBlock,
  permissionContext: MetadataPermissionContext | undefined
) {
  return (
    resolveMetadataBlockPermission(block, permissionContext).status !== "hidden"
  );
}

function isMetadataLayoutItemVisible(
  item: MetadataLayoutItem,
  dataSources: MetadataDataSources,
  visibleBlockIds: ReadonlySet<string>
) {
  if (item.visibility?.hidden === true) {
    return false;
  }

  if (
    item.dependencies?.some(
      (dependency) =>
        dependency.mode === "visible" &&
        !visibleBlockIds.has(dependency.blockId)
    )
  ) {
    return false;
  }

  if (!item.visibility?.binding) {
    return true;
  }

  const resolution = resolveMetadataBinding(
    item.visibility.binding,
    dataSources
  );

  if (resolution.status !== "ready") {
    return false;
  }

  if (
    item.visibility.equals !== undefined &&
    !isMetadataScalarEqual(resolution.value, item.visibility.equals)
  ) {
    return false;
  }

  if (
    item.visibility.notEquals !== undefined &&
    isMetadataScalarEqual(resolution.value, item.visibility.notEquals)
  ) {
    return false;
  }

  if (
    item.visibility.equals === undefined &&
    item.visibility.notEquals === undefined
  ) {
    return Boolean(resolution.value);
  }

  return true;
}

function isMetadataScalarEqual(value: unknown, expected: MetadataScalar) {
  return value === expected;
}

function formatResponsiveRules(
  rules:
    | MetadataLayoutItem["responsive"]
    | MetadataPageLayout["regions"][number]["responsive"]
) {
  if (!rules?.length) {
    return undefined;
  }

  return rules
    .map((rule) =>
      [
        rule.breakpoint,
        rule.columns ? `columns:${rule.columns}` : undefined,
        rule.stack ? "stack" : undefined,
        rule.hidden ? "hidden" : undefined,
      ]
        .filter(Boolean)
        .join(":")
    )
    .join(" ");
}

function getMetadataLayoutColumnClass(columnCount: number) {
  if (columnCount <= 1) {
    return undefined;
  }

  if (columnCount === 2) {
    return "lg:grid-cols-2";
  }

  if (columnCount === 3) {
    return "lg:grid-cols-3";
  }

  return "lg:grid-cols-4";
}

function MetadataBlockRenderer({
  block,
  dataSources,
  diagnostics,
  pageId,
  permissionContext,
}: {
  readonly block: MetadataBlock;
  readonly dataSources: MetadataDataSources;
  readonly diagnostics?: MetadataDiagnosticsSink;
  readonly pageId?: string;
  readonly permissionContext?: MetadataPermissionContext;
}) {
  const blockPermissionDecision = resolveMetadataBlockPermission(
    block,
    permissionContext
  );

  if (blockPermissionDecision.status === "hidden") {
    diagnostics?.emitDiagnostic?.({
      blockId: block.blockId,
      blockType: block.type,
      code: "block.hidden",
      message: `Metadata block "${block.blockId}" is hidden by governance.`,
      pageId,
      severity: "info",
    });
    diagnostics?.emitTelemetry?.({
      blockId: block.blockId,
      blockType: block.type,
      name: "metadata.block.hidden",
      pageId,
    });

    return null;
  }

  if (blockPermissionDecision.status === "denied") {
    diagnostics?.emitDiagnostic?.({
      blockId: block.blockId,
      blockType: block.type,
      code: "block.denied",
      details: {
        code: blockPermissionDecision.code,
      },
      message: blockPermissionDecision.reason,
      pageId,
      severity: "warning",
    });
    diagnostics?.emitTelemetry?.({
      blockId: block.blockId,
      blockType: block.type,
      name: "metadata.block.denied",
      pageId,
      properties: {
        code: blockPermissionDecision.code,
      },
    });
    diagnostics?.emitAudit?.({
      blockId: block.blockId,
      blockType: block.type,
      capability: block.capability,
      event: "metadata.block.denied",
      pageId,
      permission: block.permission,
      reason: blockPermissionDecision.reason,
      roles: block.roles,
    });

    return (
      <ForbiddenMetadataBlock
        block={block}
        decision={blockPermissionDecision}
      />
    );
  }

  const bindingDiagnostic = getBlockingBindingDiagnostic(block, dataSources);

  if (bindingDiagnostic) {
    emitBindingDiagnostic(diagnostics, pageId, block, bindingDiagnostic);

    return (
      <BindingDiagnosticBlock
        blockId={block.blockId}
        diagnostic={bindingDiagnostic}
      />
    );
  }

  const renderContext = createMetadataBlockRenderContext(
    block,
    permissionContext,
    {
      diagnostics,
      pageId,
    }
  );
  const staleDiagnostic = getStaleBindingDiagnostic(block, dataSources);
  const renderedBlock = renderRegisteredMetadataBlock(
    block,
    dataSources,
    renderContext
  );

  if (!staleDiagnostic) {
    return renderedBlock;
  }

  emitBindingDiagnostic(diagnostics, pageId, block, staleDiagnostic);

  return (
    <section
      data-binding-diagnostic={staleDiagnostic.message}
      data-binding-source={staleDiagnostic.binding.source}
      data-binding-source-state={staleDiagnostic.sourceState}
      data-binding-status="stale"
      data-slot="metadata-binding-diagnostic-block"
    >
      {renderedBlock}
      <p className="sr-only">{staleDiagnostic.message}</p>
    </section>
  );
}

function ForbiddenMetadataBlock({
  block,
  decision,
}: {
  readonly block: MetadataBlock;
  readonly decision: Extract<
    MetadataPermissionDecision,
    { readonly status: "denied" | "hidden" }
  >;
}) {
  return (
    <RuntimeStateBlock
      blockId={block.blockId}
      data-capability={block.capability}
      data-governance-code={decision.code}
      data-governance-status={decision.status}
      data-permission={block.permission}
      data-reason={decision.reason}
      data-required-roles={block.roles?.join(" ")}
      description={decision.reason}
      intent={block.intent}
      state="forbidden"
      title="Access restricted"
      tone="critical"
    />
  );
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
        resolveMetadataActions(block.actions, dataSources),
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
        resolveMetadataActions(block.actions, dataSources),
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
        resolveMetadataActions(block.actions, dataSources),
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
        resolveMetadataActions(block.actions, dataSources),
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
        resolveMetadataActions(block.actions, dataSources),
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
    renderContext.diagnostics?.emitDiagnostic?.({
      blockId: block.blockId,
      blockType: block.type,
      code: "binding.invalid",
      details: {
        path: block.data.path,
        source: block.data.source,
      },
      message: rows.error,
      pageId: renderContext.pageId,
      severity: "error",
    });
    renderContext.diagnostics?.emitTelemetry?.({
      blockId: block.blockId,
      blockType: block.type,
      name: "metadata.binding.invalid",
      pageId: renderContext.pageId,
      properties: {
        path: block.data.path,
        source: block.data.source,
      },
    });

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
        resolveMetadataActions(block.actions, dataSources),
        renderContext,
        "primary"
      )}
      bulkActions={
        block.bulkActions ? (
          <BulkActionBar
            actions={resolveMetadataBlockActions(
              resolveMetadataActions(block.bulkActions, dataSources),
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
  const resolution = resolveMetadataBinding(binding, dataSources);
  const resolved = getResolvedValue(resolution);

  if (resolution.status !== "ready" && resolution.status !== "stale") {
    return {
      error: resolution.diagnostic.message,
      ok: false,
    };
  }

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

  const resolution = resolveMetadataBinding(binding, dataSources);

  return getResolvedValue(resolution);
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

function resolveMetadataActions(
  actions: readonly MetadataBlockAction[] | undefined,
  dataSources: MetadataDataSources
): readonly MetadataBlockAction[] | undefined {
  return actions?.map((action) => {
    const disabled =
      typeof action.disabled === "boolean"
        ? action.disabled
        : toBooleanValue(resolveBindingValue(action.disabled, dataSources));

    return {
      ...action,
      disabled,
      href: resolveMetadataText(action.href, dataSources),
      label: resolveMetadataText(action.label, dataSources) ?? action.key,
      reason: resolveMetadataText(action.reason, dataSources),
    };
  });
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

function toBooleanValue(value: unknown) {
  return typeof value === "boolean" ? value : undefined;
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

function BindingDiagnosticBlock({
  blockId,
  diagnostic,
}: {
  readonly blockId: string;
  readonly diagnostic: MetadataBindingDiagnostic;
}) {
  if (diagnostic.status === "loading") {
    return (
      <RuntimeStateBlock
        blockId={blockId}
        description={diagnostic.message}
        state="loading"
        title="Loading source data"
      />
    );
  }

  if (diagnostic.status === "empty") {
    return (
      <RuntimeStateBlock
        blockId={blockId}
        description={diagnostic.message}
        state="empty"
        title="Empty source data"
      />
    );
  }

  if (diagnostic.status === "forbidden") {
    return (
      <RuntimeStateBlock
        blockId={blockId}
        description={diagnostic.message}
        state="forbidden"
        title="Source access restricted"
      />
    );
  }

  if (diagnostic.status === "error") {
    return (
      <RuntimeStateBlock
        blockId={blockId}
        description={diagnostic.message}
        state="error"
        title="Source data unavailable"
      />
    );
  }

  return (
    <InvalidMetadataBlock
      blockId={blockId}
      description={diagnostic.message}
      title={
        diagnostic.binding.required &&
        (diagnostic.status === "missing-path" ||
          diagnostic.status === "missing-source")
          ? "Missing required binding"
          : "Invalid data binding"
      }
    />
  );
}

function emitBindingDiagnostic(
  diagnostics: MetadataDiagnosticsSink | undefined,
  pageId: string | undefined,
  block: MetadataBlock,
  diagnostic: MetadataBindingDiagnostic
) {
  diagnostics?.emitDiagnostic?.({
    blockId: block.blockId,
    blockType: block.type,
    code:
      diagnostic.status === "missing-path" ||
      diagnostic.status === "missing-source"
        ? "binding.missing"
        : "binding.invalid",
    details: {
      path: diagnostic.binding.path,
      source: diagnostic.binding.source,
      status: diagnostic.status,
    },
    message: diagnostic.message,
    pageId,
    severity: diagnostic.status === "stale" ? "warning" : "error",
  });
  diagnostics?.emitTelemetry?.({
    blockId: block.blockId,
    blockType: block.type,
    name: "metadata.binding.invalid",
    pageId,
    properties: {
      sourceState: diagnostic.sourceState,
      status: diagnostic.status,
    },
  });
}

function MetadataDebugPanel({
  report,
}: {
  readonly report: MetadataDiagnosticsReport;
}) {
  const events = [
    ...report.diagnostics.map((event) => ({
      id: `diagnostic:${event.code}:${event.blockId ?? "page"}:${event.message}`,
      label: event.code,
      message: event.message,
      severity: event.severity,
      type: "diagnostic",
    })),
    ...report.audit.map((event) => ({
      id: `audit:${event.event}:${event.blockId ?? "page"}:${event.actionKey ?? "state"}`,
      label: event.event,
      message: event.reason ?? event.auditEvent ?? "Audit payload emitted.",
      severity: event.disabled ? "warning" : "info",
      type: "audit",
    })),
    ...report.telemetry.map((event) => ({
      id: `telemetry:${event.name}:${event.blockId ?? "page"}`,
      label: event.name,
      message: event.blockId
        ? `Telemetry emitted for ${event.blockId}.`
        : "Telemetry emitted for metadata page.",
      severity: "info",
      type: "telemetry",
    })),
  ];

  return (
    <section
      className={cn(
        blockRecipe("blockPanel", "blockPanelPadding", "blockSection"),
        "text-left"
      )}
      data-audit-count={report.audit.length}
      data-diagnostic-count={report.diagnostics.length}
      data-slot="metadata-debug-panel-block"
      data-telemetry-count={report.telemetry.length}
    >
      <div className={blockRecipe("blockHeader")}>
        <div className={blockRecipe("blockHeaderContent")}>
          <h2 className={blockRecipe("blockTitle")}>Metadata debug</h2>
          <p className={blockRecipe("blockDescription")}>
            Diagnostics, telemetry, and audit payloads emitted during render.
          </p>
        </div>
        <dl className="flex flex-wrap gap-3 text-[length:var(--xforge-font-caption-size)] text-text-secondary leading-[var(--xforge-font-caption-line-height)]">
          <div>
            <dt className="sr-only">Diagnostics</dt>
            <dd>{report.diagnostics.length} diagnostics</dd>
          </div>
          <div>
            <dt className="sr-only">Audit events</dt>
            <dd>{report.audit.length} audit</dd>
          </div>
          <div>
            <dt className="sr-only">Telemetry events</dt>
            <dd>{report.telemetry.length} telemetry</dd>
          </div>
        </dl>
      </div>
      <ul className="grid max-h-72 gap-2 overflow-auto">
        {events.length ? (
          events.map((event) => (
            <li
              className="grid gap-1 rounded-[var(--card-radius)] border border-border-subtle bg-surface px-3 py-2"
              data-event-severity={event.severity}
              data-event-type={event.type}
              key={event.id}
            >
              <span className="font-mono text-[11px] text-text-primary leading-4">
                {event.label}
              </span>
              <span className="text-[length:var(--xforge-font-caption-size)] text-text-secondary leading-[var(--xforge-font-caption-line-height)]">
                {event.message}
              </span>
            </li>
          ))
        ) : (
          <li className="text-[length:var(--xforge-font-caption-size)] text-text-secondary leading-[var(--xforge-font-caption-line-height)]">
            No diagnostics emitted.
          </li>
        )}
      </ul>
    </section>
  );
}

function getBlockingBindingDiagnostic(
  block: MetadataBlock,
  dataSources: MetadataDataSources
) {
  return findBindingDiagnostic(block, dataSources, shouldBlockOnResolution);
}

function getStaleBindingDiagnostic(
  block: MetadataBlock,
  dataSources: MetadataDataSources
) {
  return findBindingDiagnostic(
    block,
    dataSources,
    (resolution) => resolution.status === "stale"
  );
}

function findBindingDiagnostic(
  value: unknown,
  dataSources: MetadataDataSources,
  predicate: (resolution: MetadataBindingResolution) => boolean
): MetadataBindingDiagnostic | undefined {
  if (isMetadataDataBinding(value)) {
    const resolution = resolveMetadataBinding(value, dataSources);

    return predicate(resolution) && resolution.diagnostic
      ? resolution.diagnostic
      : undefined;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const issue = findBindingDiagnostic(item, dataSources, predicate);

      if (issue) {
        return issue;
      }
    }

    return undefined;
  }

  if (isRecord(value)) {
    for (const item of Object.values(value)) {
      const issue = findBindingDiagnostic(item, dataSources, predicate);

      if (issue) {
        return issue;
      }
    }
  }

  return undefined;
}

function shouldBlockOnResolution(resolution: MetadataBindingResolution) {
  if (resolution.status === "ready" || resolution.status === "stale") {
    return false;
  }

  if (
    resolution.status === "missing-path" ||
    resolution.status === "missing-source"
  ) {
    return resolution.binding.required === true;
  }

  return true;
}

function getResolvedValue(resolution: MetadataBindingResolution) {
  return resolution.status === "ready" || resolution.status === "stale"
    ? resolution.value
    : undefined;
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
export type {
  MetadataBindingDiagnostic,
  MetadataBindingResolution,
} from "./metadata-binding";
export { resolveMetadataBinding } from "./metadata-binding";
export type {
  MetadataActionConfigField,
  MetadataActionSurface,
  MetadataAuditEvent,
  MetadataAuditEventName,
  MetadataDiagnosticEvent,
  MetadataDiagnosticsReport,
  MetadataDiagnosticsSink,
  MetadataTelemetryEvent,
} from "./metadata-diagnostics";
export {
  createMetadataDiagnosticsCollector,
  createMetadataDiagnosticsDispatcher,
} from "./metadata-diagnostics";
export type { MetadataDataSources } from "./metadata-schema";
export type { MetadataPageRendererProps };
