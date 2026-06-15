import { z } from "zod";
import type { BlockType } from "./block-types";
import { supportedBlockTypes } from "./block-types";

const blockDensityValues = ["compact", "default", "comfortable"] as const;
const blockIntentValues = [
  "approval",
  "audit",
  "configuration",
  "operation",
  "overview",
  "risk",
  "setup",
] as const;
const blockRuntimeStateValues = [
  "empty",
  "error",
  "forbidden",
  "loading",
  "readonly",
  "ready",
] as const;
const blockToneValues = [
  "critical",
  "info",
  "neutral",
  "success",
  "warning",
] as const;
const blockActionVariantValues = [
  "destructive",
  "link",
  "primary",
  "quiet",
  "secondary",
] as const;

const metadataBlockTypeSchema = z.enum(supportedBlockTypes);

const metadataErpSaveStateSchema = z.enum([
  "conflict",
  "error",
  "idle",
  "offline",
  "saved",
  "saving",
]);

const metadataErpRiskLevelSchema = z.enum([
  "breach",
  "critical",
  "none",
  "watch",
]);

const metadataScalarSchema = z.union([
  z.boolean(),
  z.null(),
  z.number(),
  z.string(),
]);

const metadataDataSourceStateSchema = z.enum([
  "empty",
  "error",
  "forbidden",
  "idle",
  "loading",
  "ready",
  "stale",
]);

const metadataBindingExpectedTypeSchema = z.enum([
  "array",
  "boolean",
  "number",
  "record",
  "scalar",
  "string",
]);

const metadataSourceErrorSchema = z
  .object({
    code: z.string().min(1).optional(),
    message: z.string().min(1),
  })
  .strict();

const metadataSourceDiagnosticsSchema = z
  .object({
    message: z.string().min(1).optional(),
    reason: z.string().min(1).optional(),
  })
  .catchall(metadataScalarSchema)
  .strict();

const metadataDataSourceEnvelopeSchema = z
  .object({
    data: z.unknown().optional(),
    diagnostics: metadataSourceDiagnosticsSchema.optional(),
    error: metadataSourceErrorSchema.optional(),
    staleAt: z.string().min(1).optional(),
    state: metadataDataSourceStateSchema,
    updatedAt: z.string().min(1).optional(),
    version: z.union([z.number(), z.string().min(1)]).optional(),
  })
  .strict();

const metadataDataSourcesSchema = z.record(
  z.string().min(1),
  z.union([metadataDataSourceEnvelopeSchema, z.unknown()])
);

const metadataDataBindingSchema = z
  .object({
    emptyFallback: z
      .lazy((): z.ZodType<unknown> => metadataValueSchema)
      .optional(),
    expectedType: metadataBindingExpectedTypeSchema.optional(),
    fallback: metadataScalarSchema.optional(),
    params: z.record(z.string().min(1), metadataScalarSchema).optional(),
    path: z.string().min(1),
    refreshKey: z.string().min(1).optional(),
    required: z.boolean().optional(),
    source: z.string().min(1),
  })
  .strict()
  .superRefine((binding, context) => {
    if (binding.required === true && binding.fallback !== undefined) {
      context.addIssue({
        code: "custom",
        message: "Required bindings must not declare a fallback.",
        path: ["fallback"],
      });
    }
  });

const metadataValueSchema = z.union([
  metadataScalarSchema,
  metadataDataBindingSchema,
]);

const metadataBlockToneSchema = z.enum(blockToneValues);

const metadataStatusSchema = z
  .object({
    label: z.string().min(1),
    tone: metadataBlockToneSchema.optional(),
  })
  .strict();

const metadataBlockActionSchema = z
  .object({
    "aria-label": z.string().min(1).optional(),
    actionId: z.string().min(1).optional(),
    auditEvent: z.string().min(1).optional(),
    auditScope: z.string().min(1).optional(),
    capability: z.string().min(1).optional(),
    confirmationLabel: z.string().min(1).optional(),
    destructive: z.boolean().optional(),
    disabled: z.union([z.boolean(), metadataDataBindingSchema]).optional(),
    href: metadataValueSchema.optional(),
    iconKey: z.string().min(1).optional(),
    key: z.string().min(1),
    label: metadataValueSchema,
    permission: z.string().min(1).optional(),
    reason: metadataValueSchema.optional(),
    roles: z.array(z.string().min(1)).min(1).optional(),
    variant: z.enum(blockActionVariantValues).optional(),
  })
  .strict();

const metadataBlockActionListSchema = z
  .array(metadataBlockActionSchema)
  .superRefine((actions, context) => {
    addDuplicateFieldIssues(actions, "key", context);
  });

const metadataBlockBaseSchema = z.object({
  blockId: z.string().min(1),
  capability: z.string().min(1).optional(),
  density: z.enum(blockDensityValues).optional(),
  intent: z.enum(blockIntentValues).optional(),
  orchestration: z
    .object({
      error: z.union([z.boolean(), z.string().min(1)]).optional(),
      hasConflict: z.boolean().optional(),
      isEmpty: z.boolean().optional(),
      isForbidden: z.boolean().optional(),
      isLoading: z.boolean().optional(),
      isOffline: z.boolean().optional(),
      isReadonly: z.boolean().optional(),
      riskLevel: metadataErpRiskLevelSchema.optional(),
      runtimeState: z.enum(blockRuntimeStateValues).optional(),
      saveState: metadataErpSaveStateSchema.optional(),
    })
    .strict()
    .optional(),
  permission: z.string().min(1).optional(),
  roles: z.array(z.string().min(1)).min(1).optional(),
  state: z.enum(blockRuntimeStateValues).optional(),
  tone: metadataBlockToneSchema.optional(),
});

const metadataMetaItemSchema = z
  .object({
    id: z.string().min(1),
    label: metadataValueSchema,
  })
  .strict();

const metadataStatsMetricSchema = z
  .object({
    description: metadataValueSchema.optional(),
    iconKey: z.string().min(1).optional(),
    id: z.string().min(1),
    label: metadataValueSchema,
    tone: metadataBlockToneSchema.optional(),
    value: metadataValueSchema,
  })
  .strict();

const metadataStatsMetricListSchema = z
  .array(metadataStatsMetricSchema)
  .min(1)
  .superRefine((metrics, context) => {
    addDuplicateFieldIssues(metrics, "id", context);
  });

const metadataFilterSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
    tone: metadataBlockToneSchema.optional(),
  })
  .strict();

const metadataFilterListSchema = z
  .array(metadataFilterSchema)
  .superRefine((filters, context) => {
    addDuplicateFieldIssues(filters, "id", context);
  });

const metadataTableColumnSchema = z
  .object({
    accessorKey: z.string().min(1).optional(),
    align: z.enum(["center", "left", "right"]).optional(),
    bindingPath: z.string().min(1).optional(),
    header: z.string().min(1),
    id: z.string().min(1),
    kind: z
      .enum(["date", "id", "money", "number", "status", "text"])
      .optional(),
    tonePath: z.string().min(1).optional(),
  })
  .strict();

const metadataTableColumnListSchema = z
  .array(metadataTableColumnSchema)
  .min(1)
  .superRefine((columns, context) => {
    addDuplicateFieldIssues(columns, "id", context);
  });

const metadataPageHeaderBlockSchema = metadataBlockBaseSchema
  .extend({
    actions: metadataBlockActionListSchema.optional(),
    description: metadataValueSchema.optional(),
    eyebrow: metadataValueSchema.optional(),
    meta: z.array(metadataMetaItemSchema).optional(),
    status: metadataStatusSchema.optional(),
    title: metadataValueSchema,
    type: z.literal("pageHeader"),
  })
  .strict();

const metadataStatsStripBlockSchema = metadataBlockBaseSchema
  .extend({
    columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
    metrics: metadataStatsMetricListSchema,
    type: z.literal("statsStrip"),
  })
  .strict();

const metadataFilterBarBlockSchema = metadataBlockBaseSchema
  .extend({
    actions: metadataBlockActionListSchema.optional(),
    activeFilters: metadataFilterListSchema.optional(),
    filtersBinding: metadataDataBindingSchema.optional(),
    resultCount: metadataValueSchema.optional(),
    searchLabel: z.string().min(1).optional(),
    searchPlaceholder: z.string().min(1).optional(),
    searchValueBinding: metadataDataBindingSchema.optional(),
    type: z.literal("filterBar"),
  })
  .strict();

const metadataDataTableBlockSchema = metadataBlockBaseSchema
  .extend({
    actions: metadataBlockActionListSchema.optional(),
    bulkActions: metadataBlockActionListSchema.optional(),
    columns: metadataTableColumnListSchema,
    data: metadataDataBindingSchema,
    footer: metadataValueSchema.optional(),
    selectedCount: metadataValueSchema.optional(),
    title: metadataValueSchema,
    type: z.literal("dataTable"),
  })
  .strict();

const metadataBulkActionBarBlockSchema = metadataBlockBaseSchema
  .extend({
    actions: metadataBlockActionListSchema.optional(),
    clearLabel: z.string().min(1).optional(),
    label: metadataValueSchema.optional(),
    selectedCount: metadataValueSchema,
    type: z.literal("bulkActionBar"),
  })
  .strict();

const metadataEmptyPanelBlockSchema = metadataBlockBaseSchema
  .extend({
    actions: metadataBlockActionListSchema.optional(),
    description: metadataValueSchema.optional(),
    iconKey: z.string().min(1).optional(),
    title: metadataValueSchema,
    type: z.literal("emptyPanel"),
  })
  .strict();

const metadataRuntimeStateBlockSchema = metadataBlockBaseSchema
  .extend({
    actions: metadataBlockActionListSchema.optional(),
    description: metadataValueSchema.optional(),
    state: z.enum(blockRuntimeStateValues),
    title: metadataValueSchema,
    type: z.literal("runtimeState"),
  })
  .strict();

const metadataBlockSchemas = {
  bulkActionBar: metadataBulkActionBarBlockSchema,
  dataTable: metadataDataTableBlockSchema,
  emptyPanel: metadataEmptyPanelBlockSchema,
  filterBar: metadataFilterBarBlockSchema,
  pageHeader: metadataPageHeaderBlockSchema,
  runtimeState: metadataRuntimeStateBlockSchema,
  statsStrip: metadataStatsStripBlockSchema,
} satisfies Record<BlockType, z.ZodType>;

const metadataBlockSchema = z.discriminatedUnion("type", [
  metadataBlockSchemas.bulkActionBar,
  metadataBlockSchemas.dataTable,
  metadataBlockSchemas.emptyPanel,
  metadataBlockSchemas.filterBar,
  metadataBlockSchemas.pageHeader,
  metadataBlockSchemas.runtimeState,
  metadataBlockSchemas.statsStrip,
]);

const metadataLayoutBreakpointValues = ["base", "sm", "md", "lg"] as const;
const metadataLayoutItemTypeValues = [
  "block",
  "columns",
  "group",
  "tabs",
] as const;
const metadataLayoutDependencyModeValues = ["present", "visible"] as const;

const metadataLayoutResponsiveRuleSchema = z
  .object({
    breakpoint: z.enum(metadataLayoutBreakpointValues),
    columns: z
      .union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
      .optional(),
    hidden: z.boolean().optional(),
    stack: z.boolean().optional(),
  })
  .strict();

const metadataLayoutVisibilitySchema = z
  .object({
    binding: metadataDataBindingSchema.optional(),
    equals: metadataScalarSchema.optional(),
    hidden: z.boolean().optional(),
    notEquals: metadataScalarSchema.optional(),
  })
  .strict();

const metadataLayoutDependencySchema = z
  .object({
    blockId: z.string().min(1),
    mode: z.enum(metadataLayoutDependencyModeValues).optional(),
  })
  .strict();

const metadataLayoutItemBaseSchema = z.object({
  dependencies: z.array(metadataLayoutDependencySchema).optional(),
  layoutId: z.string().min(1),
  responsive: z.array(metadataLayoutResponsiveRuleSchema).optional(),
  title: z.string().min(1).optional(),
  visibility: metadataLayoutVisibilitySchema.optional(),
});

type MetadataLayoutItemInput = z.input<typeof metadataLayoutItemBaseSchema> &
  (
    | {
        readonly blockId: string;
        readonly type: "block";
      }
    | {
        readonly children: readonly MetadataLayoutItemInput[];
        readonly type: "group";
      }
    | {
        readonly columns: readonly {
          readonly children: readonly MetadataLayoutItemInput[];
          readonly columnId: string;
          readonly span?: 1 | 2 | 3 | 4;
        }[];
        readonly type: "columns";
      }
    | {
        readonly tabs: readonly {
          readonly children: readonly MetadataLayoutItemInput[];
          readonly label: string;
          readonly tabId: string;
        }[];
        readonly type: "tabs";
      }
  );

type MetadataLayoutItemOutput = z.output<typeof metadataLayoutItemBaseSchema> &
  (
    | {
        readonly blockId: string;
        readonly type: "block";
      }
    | {
        readonly children: readonly MetadataLayoutItemOutput[];
        readonly type: "group";
      }
    | {
        readonly columns: readonly {
          readonly children: readonly MetadataLayoutItemOutput[];
          readonly columnId: string;
          readonly span?: 1 | 2 | 3 | 4;
        }[];
        readonly type: "columns";
      }
    | {
        readonly tabs: readonly {
          readonly children: readonly MetadataLayoutItemOutput[];
          readonly label: string;
          readonly tabId: string;
        }[];
        readonly type: "tabs";
      }
  );

const metadataLayoutItemSchema: z.ZodType<
  MetadataLayoutItemOutput,
  MetadataLayoutItemInput
> = z.lazy(() =>
  z.discriminatedUnion("type", [
    metadataLayoutItemBaseSchema
      .extend({
        blockId: z.string().min(1),
        type: z.literal("block"),
      })
      .strict(),
    metadataLayoutItemBaseSchema
      .extend({
        children: z.array(metadataLayoutItemSchema).min(1),
        type: z.literal("group"),
      })
      .strict(),
    metadataLayoutItemBaseSchema
      .extend({
        columns: z
          .array(
            z
              .object({
                children: z.array(metadataLayoutItemSchema).min(1),
                columnId: z.string().min(1),
                span: z
                  .union([
                    z.literal(1),
                    z.literal(2),
                    z.literal(3),
                    z.literal(4),
                  ])
                  .optional(),
              })
              .strict()
          )
          .min(1)
          .superRefine((columns, context) => {
            addDuplicateFieldIssues(columns, "columnId", context);
          }),
        type: z.literal("columns"),
      })
      .strict(),
    metadataLayoutItemBaseSchema
      .extend({
        tabs: z
          .array(
            z
              .object({
                children: z.array(metadataLayoutItemSchema).min(1),
                label: z.string().min(1),
                tabId: z.string().min(1),
              })
              .strict()
          )
          .min(1)
          .superRefine((tabs, context) => {
            addDuplicateFieldIssues(tabs, "tabId", context);
          }),
        type: z.literal("tabs"),
      })
      .strict(),
  ])
);

const metadataPageLayoutSchema = z
  .object({
    density: z.enum(blockDensityValues).optional(),
    regions: z
      .array(
        z
          .object({
            children: z.array(metadataLayoutItemSchema).min(1),
            label: z.string().min(1).optional(),
            regionId: z.string().min(1),
            responsive: z.array(metadataLayoutResponsiveRuleSchema).optional(),
          })
          .strict()
      )
      .min(1)
      .superRefine((regions, context) => {
        addDuplicateFieldIssues(regions, "regionId", context);
      }),
    type: z.literal("regions"),
  })
  .strict();

const metadataPageSchema = z
  .object({
    blocks: z.array(metadataBlockSchema).min(1),
    layout: metadataPageLayoutSchema.optional(),
    pageId: z.string().min(1),
    version: z.literal(1),
  })
  .strict()
  .superRefine((page, context) => {
    const seenBlockIds = new Set<string>();

    for (const [index, block] of page.blocks.entries()) {
      if (seenBlockIds.has(block.blockId)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate blockId "${block.blockId}"`,
          path: ["blocks", index, "blockId"],
        });
      }

      seenBlockIds.add(block.blockId);
    }

    if (page.layout) {
      validateMetadataPageLayout(page.layout, seenBlockIds, context);
    }
  });

function validateMetadataPageLayout(
  layout: z.output<typeof metadataPageLayoutSchema>,
  blockIds: ReadonlySet<string>,
  context: z.RefinementCtx
) {
  const placedBlockIds = new Set<string>();
  const layoutIds = new Set<string>();

  for (const [regionIndex, region] of layout.regions.entries()) {
    for (const [itemIndex, item] of region.children.entries()) {
      validateMetadataLayoutItem(
        item,
        blockIds,
        placedBlockIds,
        layoutIds,
        ["layout", "regions", regionIndex, "children", itemIndex],
        context
      );
    }
  }
}

function validateMetadataLayoutItem(
  item: MetadataLayoutItemOutput,
  blockIds: ReadonlySet<string>,
  placedBlockIds: Set<string>,
  layoutIds: Set<string>,
  path: (number | string)[],
  context: z.RefinementCtx
) {
  if (layoutIds.has(item.layoutId)) {
    context.addIssue({
      code: "custom",
      message: `Duplicate layoutId "${item.layoutId}"`,
      path: [...path, "layoutId"],
    });
  }

  layoutIds.add(item.layoutId);

  for (const [dependencyIndex, dependency] of (
    item.dependencies ?? []
  ).entries()) {
    if (!blockIds.has(dependency.blockId)) {
      context.addIssue({
        code: "custom",
        message: `Layout dependency references unknown blockId "${dependency.blockId}"`,
        path: [...path, "dependencies", dependencyIndex, "blockId"],
      });
    }
  }

  if (item.type === "block") {
    validateMetadataLayoutBlockItem(
      item,
      blockIds,
      placedBlockIds,
      path,
      context
    );
    return;
  }

  if (item.type === "group") {
    for (const [childIndex, child] of item.children.entries()) {
      validateMetadataLayoutItem(
        child,
        blockIds,
        placedBlockIds,
        layoutIds,
        [...path, "children", childIndex],
        context
      );
    }
    return;
  }

  if (item.type === "columns") {
    for (const [columnIndex, column] of item.columns.entries()) {
      for (const [childIndex, child] of column.children.entries()) {
        validateMetadataLayoutItem(
          child,
          blockIds,
          placedBlockIds,
          layoutIds,
          [...path, "columns", columnIndex, "children", childIndex],
          context
        );
      }
    }
    return;
  }

  for (const [tabIndex, tab] of item.tabs.entries()) {
    for (const [childIndex, child] of tab.children.entries()) {
      validateMetadataLayoutItem(
        child,
        blockIds,
        placedBlockIds,
        layoutIds,
        [...path, "tabs", tabIndex, "children", childIndex],
        context
      );
    }
  }
}

function validateMetadataLayoutBlockItem(
  item: Extract<MetadataLayoutItemOutput, { readonly type: "block" }>,
  blockIds: ReadonlySet<string>,
  placedBlockIds: Set<string>,
  path: (number | string)[],
  context: z.RefinementCtx
) {
  if (!blockIds.has(item.blockId)) {
    context.addIssue({
      code: "custom",
      message: `Layout references unknown blockId "${item.blockId}"`,
      path: [...path, "blockId"],
    });
    return;
  }

  if (placedBlockIds.has(item.blockId)) {
    context.addIssue({
      code: "custom",
      message: `Layout places blockId "${item.blockId}" more than once`,
      path: [...path, "blockId"],
    });
  }

  placedBlockIds.add(item.blockId);
}

function addDuplicateFieldIssues<
  TItem extends Record<TKey, string>,
  TKey extends string,
>(items: readonly TItem[], key: TKey, context: z.RefinementCtx) {
  const seenValues = new Set<string>();

  for (const [index, item] of items.entries()) {
    const value = item[key];

    if (seenValues.has(value)) {
      context.addIssue({
        code: "custom",
        message: `Duplicate ${key} "${value}"`,
        path: [index, key],
      });
    }

    seenValues.add(value);
  }
}

export {
  blockActionVariantValues,
  blockDensityValues,
  blockIntentValues,
  blockRuntimeStateValues,
  blockToneValues,
  metadataBindingExpectedTypeSchema,
  metadataBlockActionSchema,
  metadataBlockActionListSchema,
  metadataBlockBaseSchema,
  metadataBlockSchema,
  metadataBlockSchemas,
  metadataBlockToneSchema,
  metadataBlockTypeSchema,
  metadataBulkActionBarBlockSchema,
  metadataDataBindingSchema,
  metadataDataSourceEnvelopeSchema,
  metadataDataSourcesSchema,
  metadataDataSourceStateSchema,
  metadataDataTableBlockSchema,
  metadataEmptyPanelBlockSchema,
  metadataErpRiskLevelSchema,
  metadataErpSaveStateSchema,
  metadataFilterBarBlockSchema,
  metadataLayoutBreakpointValues,
  metadataLayoutDependencyModeValues,
  metadataLayoutItemSchema,
  metadataLayoutItemTypeValues,
  metadataLayoutResponsiveRuleSchema,
  metadataLayoutVisibilitySchema,
  metadataPageHeaderBlockSchema,
  metadataPageLayoutSchema,
  metadataPageSchema,
  metadataRuntimeStateBlockSchema,
  metadataScalarSchema,
  metadataStatsStripBlockSchema,
  metadataValueSchema,
};
export type MetadataBlock = z.infer<typeof metadataBlockSchema>;
export type MetadataBlockAction = z.infer<typeof metadataBlockActionSchema>;
export type MetadataBlockByType<TType extends MetadataBlock["type"]> = Extract<
  MetadataBlock,
  { readonly type: TType }
>;
export type MetadataBlockType = MetadataBlock["type"];
export type MetadataDataBinding = z.infer<typeof metadataDataBindingSchema>;
export type MetadataDataSourceEnvelope = z.infer<
  typeof metadataDataSourceEnvelopeSchema
>;
export type MetadataDataSources = z.infer<typeof metadataDataSourcesSchema>;
export type MetadataDataSourceState = z.infer<
  typeof metadataDataSourceStateSchema
>;
export type MetadataLayoutItem = z.infer<typeof metadataLayoutItemSchema>;
export type MetadataPageLayout = z.infer<typeof metadataPageLayoutSchema>;
export type MetadataPage = z.infer<typeof metadataPageSchema>;
export type MetadataScalar = z.infer<typeof metadataScalarSchema>;
export type MetadataValue = z.infer<typeof metadataValueSchema>;
