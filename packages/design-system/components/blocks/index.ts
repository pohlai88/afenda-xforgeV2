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
} from "./advanced";
export {
  AdvancedDataTable,
  ApprovalQueueBlock,
  CommandSearchBlock,
  OperationalDashboardShell,
  RecordEditorBlock,
  RiskEvidencePanel,
} from "./advanced";
export type {
  AppShellAuditDockPlacement,
  AppShellSidebarConfig,
  AppShellSiteContainerConfig,
  AppShellSiteContainerGeometry,
  AppShellSiteContainerMode,
  AuthenticatedAppShellBlockProps,
} from "./app-shell";
export { AuthenticatedAppShellBlock } from "./app-shell";
export type {
  OperatorAppTopbarProps,
  TopbarActionMenuItem,
  TopbarActionsMenuProps,
  TopbarScopeOption,
  TopbarScopeSwitcherConfig,
  TopbarSidebarControlProps,
  TopbarUserMenuProps,
  TopbarUtilitiesMarketItem,
  TopbarUtilitiesRailProps,
  TopbarUtilityAction,
  TopbarUtilityRequest,
} from "./afenda-blocks/topbars";
export {
  buildCatalogMaps,
  buildPinnedActions,
  buildPinnedOrder,
  DEFAULT_ERP_ACTIONS_MENU_ITEMS,
  DEFAULT_ERP_UTILITIES_MARKET_ITEMS,
  OperatorAppTopbar,
  resolveDefaultEnabledIds,
  TOPBAR_FIXED_UTILITY_SLOTS,
  TOPBAR_MAX_PINNED_UTILITY_SLOTS,
  TOPBAR_MAX_TOTAL_UTILITY_SLOTS,
} from "./afenda-blocks/topbars";
export type {
  OperatorAppSidebarProps,
  SidebarFooterProfileProps,
  SidebarIconComponent,
  SidebarItemActiveFn,
  SidebarLabelGroup,
  SidebarLabelItem,
  SidebarLabelTone,
  SidebarLinkRenderer,
  SidebarLinkRenderProps,
  SidebarMatchStrategy,
  SidebarNavGroup,
  SidebarNavItem,
  SidebarNavPanelProps,
  SidebarQuickAction,
  SidebarQuickActionsProps,
} from "./afenda-blocks/sidebars";
export {
  defaultSidebarLink,
  DEMO_ERP_SIDEBAR_LABEL_GROUPS,
  DEMO_ERP_SIDEBAR_NAV_GROUPS,
  DEMO_ERP_SIDEBAR_QUICK_ACTIONS,
  flattenSidebarNavGroups,
  isSidebarNavItemActive,
  resolveSidebarActiveItemIds,
  stripSidebarNavItemSelection,
  OperatorAppSidebar,
  SidebarFooterProfile,
  SidebarNavPanel,
  SidebarQuickActions,
} from "./afenda-blocks/sidebars";
export type {
  ContentLayoutBlockProps,
  ContentLayoutBottomDrawerConfig,
  ContentLayoutBottomDrawerProps,
  ContentLayoutBreadcrumbItem,
  ContentLayoutBreadcrumbsTopbarProps,
  ContentLayoutFooterLink,
  ContentLayoutFooterProps,
  ContentLayoutInsetDefaults,
  ContentLayoutInsetOverrides,
  ContentLayoutResizeConfig,
  ContentLayoutResizeStartHandler,
  ContentLayoutSide,
  ContentLayoutSidebarConfig,
  ContentLayoutSidebarProps,
} from "./afenda-blocks/content-layout";
export {
  ContentLayoutBlock,
  ContentLayoutBottomDrawer,
  ContentLayoutBreadcrumbsTopbar,
  ContentLayoutFooter,
  ContentLayoutSidebar,
  DEFAULT_CONTENT_LAYOUT_FOOTER_LINKS,
  DEFAULT_CONTENT_LAYOUT_FOOTER_COPYRIGHT,
  DEFAULT_CONTENT_LAYOUT_INSETS,
  DEFAULT_CONTENT_LAYOUT_MIN_HEIGHT,
  DEFAULT_CONTENT_LAYOUT_MIN_WIDTH,
  DEFAULT_CONTENT_LAYOUT_RIGHT_SIDEBAR_WIDTH,
  DEFAULT_CONTENT_LAYOUT_TOPBAR_HEIGHT,
  DEMO_CONTENT_LAYOUT_BREADCRUMBS,
  DEMO_CONTENT_LAYOUT_BOTTOM_DRAWER_LABEL,
  DEMO_CONTENT_LAYOUT_DEFAULT_NAV_HREF,
} from "./afenda-blocks/content-layout";
export type {
  AfendaBlockRecipeContract,
  AfendaBlockRecipeEntry,
  AfendaBlockRecipeKey,
} from "./block-recipes";
export { afendaBlockRecipe, blockRecipe } from "./block-recipes";
export type {
  BlockRegistry,
  BlockRegistryEntry,
  BlockRegistryFamily,
} from "./block-registry";
export {
  blockRegistry,
  blockRegistryEntries,
  getBlockRegistryEntry,
  isSupportedBlockType,
} from "./block-registry";
export type { BlockType } from "./block-types";
export { supportedBlockTypes } from "./block-types";
export type {
  ErpRiskLevel,
  ErpSaveState,
  ReversibleBulkActionBarProps,
  ReversibleBulkMode,
  RuntimeStateBlockProps,
  SaveStateStripProps,
  SlaRiskEscalationPanelProps,
} from "./erp-state";
export {
  ReversibleBulkActionBar,
  RuntimeStateBlock,
  SaveStateStrip,
  SlaRiskEscalationPanel,
} from "./erp-state";
export type {
  ApprovalDecision,
  ApprovalDecisionTrailProps,
  EvidenceChecklistItem,
  EvidenceChecklistProps,
  EvidenceMetaItem,
  EvidenceStatus,
  ImmutableAuditEvent,
  ImmutableAuditTimelineProps,
  PolicyException,
  PolicyExceptionSummaryProps,
  RowEvidenceArtifact,
  RowEvidencePanelProps,
} from "./evidence-audit";
export {
  ApprovalDecisionTrail,
  EvidenceChecklist,
  ImmutableAuditTimeline,
  PolicyExceptionSummary,
  RowEvidencePanel,
} from "./evidence-audit";
export {
  approvalControlCenterDataSources,
  approvalControlCenterMetadata,
  auditEvidenceReviewDataSources,
  auditEvidenceReviewMetadata,
  tenantConfigurationDataSources,
  tenantConfigurationMetadata,
} from "./fixtures";
export type {
  ActiveFilter,
  BlockAction,
  BlockBaseProps,
  BlockDensity,
  BlockIntent,
  BlockRuntimeState,
  BlockTone,
  EmptyPanelProps,
  FilterBarProps,
  FormSectionProps,
  PageHeaderMeta,
  PageHeaderProps,
  StatsMetric,
  StatsStripProps,
} from "./foundation";
export {
  BlockActionButton,
  BlockActions,
  EmptyPanel,
  FilterBar,
  FormSection,
  PageHeader,
  StatsStrip,
} from "./foundation";
export type {
  AfendaBlockFamily,
  AfendaBlockLayoutContract,
} from "./layout-contracts";
export { afendaBlockLayoutContracts } from "./layout-contracts";
export type {
  MetadataActionConfigField,
  MetadataAuditEvent,
  MetadataAuditEventName,
  MetadataBindingDiagnostic,
  MetadataBindingResolution,
  MetadataDataSources,
  MetadataDiagnosticEvent,
  MetadataDiagnosticsReport,
  MetadataDiagnosticsSink,
  MetadataPageRendererProps,
  MetadataTelemetryEvent,
} from "./metadata-page-renderer";
export {
  createMetadataDiagnosticsCollector,
  createMetadataDiagnosticsDispatcher,
  MetadataPageRenderer,
  resolveMetadataBinding,
} from "./metadata-page-renderer";
export type {
  MetadataActionSurface,
  MetadataBlockBaseProps,
  MetadataBlockRenderContext,
  MetadataGovernanceStatus,
  MetadataPermissionContext,
  MetadataPermissionDecision,
  MetadataPermissionSubject,
} from "./metadata-renderer-core";
export {
  createMetadataBlockRenderContext,
  resolveDefaultMetadataPermission,
  resolveMetadataBlockActions,
  resolveMetadataBlockPermission,
  resolveMetadataPermission,
} from "./metadata-renderer-core";
export type {
  MetadataBlock,
  MetadataBlockAction,
  MetadataDataBinding,
  MetadataDataSourceEnvelope,
  MetadataDataSourceState,
  MetadataLayoutItem,
  MetadataPage,
  MetadataPageLayout,
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
} from "./metadata-schema";
export type {
  AuditTrailEvent,
  AuditTrailPanelProps,
  BulkActionBarProps,
  DataTableShellProps,
  EntitySummaryField,
  EntitySummaryPanelProps,
  OperatorStatus,
  OperatorTone,
  StatusTimelineItem,
  StatusTimelineProps,
} from "./operator";
export {
  AuditTrailPanel,
  BulkActionBar,
  DataTableShell,
  EntitySummaryPanel,
  StatusTimeline,
} from "./operator";
export type {
  AuditSafeDestructiveActionProps,
  PermissionActionAuditItem,
  PermissionActionToolbarProps,
  PermissionAwareAction,
} from "./permission";
export {
  AuditSafeDestructiveAction,
  PermissionActionToolbar,
} from "./permission";
export type {
  QualityGateItem,
  QualityGateState,
  QualityGatesBlockProps,
  QualityGateViewport,
} from "./quality-gates";
export { QualityGatesBlock } from "./quality-gates";
export type {
  BlockStateInput,
  OrchestratedBlockState,
  StateSignal,
} from "./state-orchestration";
export {
  orchestrateBlockState,
  resolveStateSignal,
} from "./state-orchestration";
export type {
  ApprovalControlCenterProps,
  AuditEvidenceWorkspaceProps,
  BatchPostingReviewProps,
  BatchPostingRow,
  EvidenceRecord,
  PolicyLockManagerProps,
  PolicyLockRow,
  TenantOperationsWorkspaceProps,
  WorkflowFilter,
  WorkflowScope,
  WorkflowStatus,
} from "./workflow";
export {
  ApprovalControlCenter,
  AuditEvidenceWorkspace,
  BatchPostingReview,
  PolicyLockManager,
  TenantOperationsWorkspace,
} from "./workflow";
