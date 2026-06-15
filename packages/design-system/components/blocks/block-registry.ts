import type { ComponentType } from "react";
import type { BlockType as SupportedBlockType } from "./block-types";
import { supportedBlockTypes as supportedRegistryBlockTypes } from "./block-types";
import type { RuntimeStateBlockProps } from "./erp-state";
import { RuntimeStateBlock } from "./erp-state";
import type {
  EmptyPanelProps,
  FilterBarProps,
  PageHeaderProps,
  StatsStripProps,
} from "./foundation";
import { EmptyPanel, FilterBar, PageHeader, StatsStrip } from "./foundation";
import type { BulkActionBarProps, DataTableShellProps } from "./operator";
import { BulkActionBar, DataTableShell } from "./operator";

type BlockRegistryFamily = "foundation" | "operator" | "state";
type BlockType = SupportedBlockType;

interface BlockRegistryEntry<TType extends BlockType, TProps extends object> {
  readonly component: ComponentType<TProps>;
  readonly dataSlot: string;
  readonly description: string;
  readonly family: BlockRegistryFamily;
  readonly importName: string;
  readonly type: TType;
}

interface BlockRegistry {
  readonly bulkActionBar: BlockRegistryEntry<
    "bulkActionBar",
    BulkActionBarProps
  >;
  readonly dataTable: BlockRegistryEntry<"dataTable", DataTableShellProps>;
  readonly emptyPanel: BlockRegistryEntry<"emptyPanel", EmptyPanelProps>;
  readonly filterBar: BlockRegistryEntry<"filterBar", FilterBarProps>;
  readonly pageHeader: BlockRegistryEntry<"pageHeader", PageHeaderProps>;
  readonly runtimeState: BlockRegistryEntry<
    "runtimeState",
    RuntimeStateBlockProps
  >;
  readonly statsStrip: BlockRegistryEntry<"statsStrip", StatsStripProps>;
}

const blockRegistry = {
  bulkActionBar: {
    component: BulkActionBar,
    dataSlot: "bulk-action-bar-block",
    description:
      "Selection-aware operator action bar for bulk operations and clear-selection controls.",
    family: "operator",
    importName: "BulkActionBar",
    type: "bulkActionBar",
  },
  dataTable: {
    component: DataTableShell,
    dataSlot: "data-table-shell-block",
    description:
      "Governed data-table shell with header actions, toolbar, bulk actions, footer, and pagination slots.",
    family: "operator",
    importName: "DataTableShell",
    type: "dataTable",
  },
  emptyPanel: {
    component: EmptyPanel,
    dataSlot: "empty-panel-block",
    description:
      "Designed empty-state panel using the shared Empty primitive and block action contract.",
    family: "foundation",
    importName: "EmptyPanel",
    type: "emptyPanel",
  },
  filterBar: {
    component: FilterBar,
    dataSlot: "filter-bar-block",
    description:
      "Search, filter, active-chip, reset, result-count, and action row for operator list views.",
    family: "foundation",
    importName: "FilterBar",
    type: "filterBar",
  },
  pageHeader: {
    component: PageHeader,
    dataSlot: "page-header-block",
    description:
      "Dense page header with title, status, scoped metadata, description, and action toolbar.",
    family: "foundation",
    importName: "PageHeader",
    type: "pageHeader",
  },
  runtimeState: {
    component: RuntimeStateBlock,
    dataSlot: "runtime-state-block",
    description:
      "Runtime state panel for loading, empty, error, forbidden, readonly, and ready states.",
    family: "state",
    importName: "RuntimeStateBlock",
    type: "runtimeState",
  },
  statsStrip: {
    component: StatsStrip,
    dataSlot: "stats-strip-block",
    description:
      "Compact KPI strip with primary metric emphasis and typed metric metadata.",
    family: "foundation",
    importName: "StatsStrip",
    type: "statsStrip",
  },
} as const satisfies BlockRegistry;

const blockRegistryEntries = supportedRegistryBlockTypes.map(
  (type) => blockRegistry[type]
);

function isSupportedBlockType(value: string): value is BlockType {
  return supportedRegistryBlockTypes.includes(value as BlockType);
}

function getBlockRegistryEntry<TType extends BlockType>(
  type: TType
): BlockRegistry[TType] {
  return blockRegistry[type];
}

export {
  blockRegistry,
  blockRegistryEntries,
  getBlockRegistryEntry,
  isSupportedBlockType,
};
export type { BlockRegistry, BlockRegistryEntry, BlockRegistryFamily };
