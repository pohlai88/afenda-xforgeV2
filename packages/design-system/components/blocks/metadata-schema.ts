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

const metadataDataBindingSchema = z
  .object({
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
    disabled: z.boolean().optional(),
    href: z.string().min(1).optional(),
    iconKey: z.string().min(1).optional(),
    key: z.string().min(1),
    label: z.string().min(1),
    permission: z.string().min(1).optional(),
    reason: z.string().min(1).optional(),
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

const metadataPageSchema = z
  .object({
    blocks: z.array(metadataBlockSchema).min(1),
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
  });

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
  metadataBlockActionSchema,
  metadataBlockActionListSchema,
  metadataBlockBaseSchema,
  metadataBlockSchema,
  metadataBlockSchemas,
  metadataBlockToneSchema,
  metadataBlockTypeSchema,
  metadataBulkActionBarBlockSchema,
  metadataDataBindingSchema,
  metadataDataTableBlockSchema,
  metadataEmptyPanelBlockSchema,
  metadataErpRiskLevelSchema,
  metadataErpSaveStateSchema,
  metadataFilterBarBlockSchema,
  metadataPageHeaderBlockSchema,
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
export type MetadataPage = z.infer<typeof metadataPageSchema>;
export type MetadataScalar = z.infer<typeof metadataScalarSchema>;
export type MetadataValue = z.infer<typeof metadataValueSchema>;
