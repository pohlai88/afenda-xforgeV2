export type {
  DashboardDataTableProps,
  DashboardDataTableRow,
  DashboardNavTopbarProps,
  NavMainItem,
  NavMainProps,
} from "./afenda-blocks/shadcn-dashboard-01";
export {
  AppSidebar,
  ChartAreaInteractive,
  DashboardDataTable,
  DashboardNavTopbar,
  DashboardPage,
  DEFAULT_DASHBOARD_NAV_TOPBAR_HEIGHT,
  DEFAULT_NAV_MAIN_ITEMS,
  DEMO_DASHBOARD_DATA_TABLE_ROWS,
  DEMO_DASHBOARD_NAV_TOPBAR_PROPS,
  dashboardDataTableSchema,
  NavDocuments,
  NavMain,
  NavSecondary,
  NavUser,
  SectionCards,
  SiteHeader,
} from "./afenda-blocks/shadcn-dashboard-01";
export type {
  SidebarLinkRenderer,
  SidebarLinkRenderProps,
} from "./afenda-blocks/shadcn-dashboard-01";
export {
  defaultSidebarLink,
  resolveSidebarLinkRenderer,
} from "./afenda-blocks/shadcn-dashboard-01";
export type {
  AfendaBlockRecipeContract,
  AfendaBlockRecipeEntry,
  AfendaBlockRecipeKey,
} from "./block-recipes";
export { afendaBlockRecipe, blockRecipe } from "./block-recipes";
export type {
  BlockAction,
  BlockBaseProps,
  BlockDensity,
  BlockIntent,
  BlockRuntimeState,
  BlockTone,
  ErpRiskLevel,
  ErpSaveState,
} from "./block-governance-types";
export type { BlockType } from "./block-types";
export { supportedBlockTypes } from "./block-types";
export type {
  AfendaBlockFamily,
  AfendaBlockLayoutContract,
} from "./layout-contracts";
export { afendaBlockLayoutContracts } from "./layout-contracts";
export type {
  MetadataBlock,
  MetadataBlockAction,
  MetadataDataBinding,
  MetadataDataSourceEnvelope,
  MetadataDataSourceState,
  MetadataPage,
  MetadataScalar,
  MetadataValue,
} from "./metadata-schema";
export {
  blockActionVariantValues,
  blockDensityValues,
  blockIntentValues,
  blockRuntimeStateValues,
  blockToneValues,
  metadataBlockActionSchema,
  metadataBlockBaseSchema,
  metadataBlockSchema,
  metadataBlockSchemas,
  metadataBlockToneSchema,
  metadataBlockTypeSchema,
  metadataBulkActionBarBlockSchema,
  metadataDataBindingSchema,
  metadataDataSourceEnvelopeSchema,
  metadataDataSourceStateSchema,
  metadataDataSourcesSchema,
  metadataDataTableBlockSchema,
  metadataEmptyPanelBlockSchema,
  metadataFilterBarBlockSchema,
  metadataPageHeaderBlockSchema,
  metadataPageSchema,
  metadataRuntimeStateBlockSchema,
  metadataScalarSchema,
  metadataStatsStripBlockSchema,
  metadataValueSchema,
} from "./metadata-schema";
export type {
  MetadataActionSurface,
  MetadataAuditEvent,
  MetadataAuditEventName,
  MetadataBindingDiagnostic,
  MetadataBindingResolution,
  MetadataBlockBaseProps,
  MetadataBlockRenderContext,
  MetadataDataSources,
  MetadataDiagnosticEvent,
  MetadataDiagnosticsReport,
  MetadataDiagnosticsSink,
  MetadataGovernanceStatus,
  MetadataLayoutItem,
  MetadataPageLayout,
  MetadataPermissionContext,
  MetadataPermissionDecision,
  MetadataPermissionSubject,
  MetadataTelemetryEvent,
} from "./metadata-renderer";
export {
  createMetadataBlockRenderContext,
  createMetadataDiagnosticsCollector,
  createMetadataDiagnosticsDispatcher,
  metadataLayoutBreakpointValues,
  metadataLayoutDependencyModeValues,
  metadataLayoutItemSchema,
  metadataLayoutItemTypeValues,
  metadataLayoutResponsiveRuleSchema,
  metadataLayoutVisibilitySchema,
  metadataPageLayoutSchema,
  resolveDefaultMetadataPermission,
  resolveMetadataBinding,
  resolveMetadataBlockActions,
  resolveMetadataBlockPermission,
  resolveMetadataPermission,
} from "./metadata-renderer";
export type {
  BlockStateInput,
  OrchestratedBlockState,
  StateSignal,
} from "./state-orchestration";
export {
  orchestrateBlockState,
  resolveStateSignal,
} from "./state-orchestration";
