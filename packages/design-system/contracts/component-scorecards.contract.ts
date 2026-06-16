const primitiveComponentIds = [
  "accordion",
  "alert",
  "alert-dialog",
  "aspect-ratio",
  "avatar",
  "badge",
  "box",
  "breadcrumb",
  "button",
  "button-group",
  "calendar",
  "card",
  "carousel",
  "chart",
  "checkbox",
  "collapsible",
  "command",
  "context-menu",
  "dialog",
  "drawer",
  "dropdown-menu",
  "empty",
  "field",
  "focusable",
  "form",
  "grid",
  "hover-card",
  "inline",
  "input",
  "input-group",
  "input-otp",
  "item",
  "kbd",
  "label",
  "menubar",
  "metric-text",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "skeleton",
  "slider",
  "sonner",
  "spinner",
  "stack",
  "switch",
  "table",
  "tabs",
  "text",
  "textarea",
  "toggle",
  "toggle-group",
  "tooltip",
] as const;

const blockComponentIds = [
  "AdvancedDataTable",
  "AppSidebar",
  "ApprovalControlCenter",
  "ApprovalDecisionTrail",
  "ApprovalQueueBlock",
  "AuditEvidenceWorkspace",
  "AuditSafeCriticalAction",
  "AuditTrailPanel",
  "AuthenticatedAppShellBlock",
  "BatchPostingReview",
  "BlockActionButton",
  "BlockActions",
  "BulkActionBar",
  "ChartAreaInteractive",
  "CommandSearchBlock",
  "ContentLayoutBlock",
  "ContentLayoutBottomDrawer",
  "ContentLayoutBreadcrumbsTopbar",
  "ContentLayoutFooter",
  "ContentLayoutSidebar",
  "DashboardDataTable",
  "DashboardNavTopbar",
  "DashboardPage",
  "DashboardPageFooter",
  "DataTableShell",
  "EmptyPanel",
  "EntitySummaryPanel",
  "EvidenceChecklist",
  "FilterBar",
  "FormSection",
  "ImmutableAuditTimeline",
  "MetadataPageRenderer",
  "NavDocuments",
  "NavMain",
  "NavSecondary",
  "NavStarted",
  "NavUser",
  "OperationalDashboardShell",
  "OperatorAppSidebar",
  "OperatorAppTopbar",
  "PageHeader",
  "PermissionActionToolbar",
  "PolicyExceptionSummary",
  "PolicyLockManager",
  "QualityGatesBlock",
  "RecordEditorBlock",
  "ReversibleBulkActionBar",
  "RiskEvidencePanel",
  "RowEvidencePanel",
  "RuntimeStateBlock",
  "SaveStateStrip",
  "SectionCards",
  "SidebarFooterProfile",
  "SidebarFooterTrailingControl",
  "SidebarNavPanel",
  "SidebarQuickActions",
  "SiteHeader",
  "SlaRiskEscalationPanel",
  "StatsStrip",
  "StatusTimeline",
  "TenantOperationsWorkspace",
  "TopbarShortcutsDialog",
] as const;

const componentReadinessStateValues = [
  "default",
  "hover",
  "focus-visible",
  "active",
  "disabled",
  "invalid",
  "selected",
  "loading",
  "empty",
  "error",
  "forbidden",
  "readonly",
  "reduced-motion",
] as const;

type PrimitiveComponentId = (typeof primitiveComponentIds)[number];
type BlockComponentId = (typeof blockComponentIds)[number];
type ComponentScorecardId = PrimitiveComponentId | BlockComponentId;
type ComponentScorecardKind = "block" | "primitive";
type ComponentScorecardOwner =
  | "design-system"
  | "metadata-platform"
  | "workflow-blocks";
type ComponentScorecardStatus = "ready" | "watch" | "needs-work";
type ComponentReadinessState = (typeof componentReadinessStateValues)[number];
type ComponentReadinessLevel = "covered" | "manual" | "not-applicable";
type ComponentDensityFit = "comfortable" | "dense" | "fixed-format";
type ComponentOverflowBehavior =
  | "bounded"
  | "horizontal-scroll"
  | "responsive-wrap"
  | "viewport-managed";

interface ComponentScorecard {
  readonly a11yLabels: ComponentReadinessLevel;
  readonly densityFit: ComponentDensityFit;
  readonly id: ComponentScorecardId;
  readonly keyboardSupport: ComponentReadinessLevel;
  readonly kind: ComponentScorecardKind;
  readonly overflowBehavior: ComponentOverflowBehavior;
  readonly owner: ComponentScorecardOwner;
  readonly reducedMotion: ComponentReadinessLevel;
  readonly statesCovered: readonly ComponentReadinessState[];
  readonly status: ComponentScorecardStatus;
  readonly visualBaselineStory: string;
}

const formPrimitiveIds = [
  "button",
  "button-group",
  "checkbox",
  "field",
  "form",
  "input",
  "input-group",
  "input-otp",
  "label",
  "radio-group",
  "select",
  "slider",
  "switch",
  "textarea",
  "toggle",
  "toggle-group",
] as const satisfies readonly PrimitiveComponentId[];

const overlayPrimitiveIds = [
  "alert-dialog",
  "command",
  "context-menu",
  "dialog",
  "drawer",
  "dropdown-menu",
  "hover-card",
  "menubar",
  "popover",
  "sheet",
  "tooltip",
] as const satisfies readonly PrimitiveComponentId[];

const dataPrimitiveIds = [
  "accordion",
  "breadcrumb",
  "calendar",
  "carousel",
  "chart",
  "collapsible",
  "navigation-menu",
  "pagination",
  "resizable",
  "scroll-area",
  "sidebar",
  "table",
  "tabs",
] as const satisfies readonly PrimitiveComponentId[];

const layoutPrimitiveIds = [
  "aspect-ratio",
  "box",
  "card",
  "focusable",
  "grid",
  "inline",
  "item",
  "separator",
  "stack",
  "text",
  "metric-text",
] as const satisfies readonly PrimitiveComponentId[];

const feedbackPrimitiveIds = [
  "alert",
  "avatar",
  "badge",
  "empty",
  "kbd",
  "progress",
  "skeleton",
  "sonner",
  "spinner",
] as const satisfies readonly PrimitiveComponentId[];

const metadataBlockIds = [
  "MetadataPageRenderer",
  "QualityGatesBlock",
] as const satisfies readonly BlockComponentId[];

const workflowBlockIds = [
  "ApprovalControlCenter",
  "AuthenticatedAppShellBlock",
  "AuditEvidenceWorkspace",
  "BatchPostingReview",
  "OperationalDashboardShell",
  "PolicyLockManager",
  "TenantOperationsWorkspace",
] as const satisfies readonly BlockComponentId[];

const primitiveScorecards = primitiveComponentIds.map((id) =>
  createPrimitiveScorecard(id)
);
const blockScorecards = blockComponentIds.map((id) => createBlockScorecard(id));
const componentScorecards: readonly ComponentScorecard[] = [
  ...primitiveScorecards,
  ...blockScorecards,
];

function createPrimitiveScorecard(
  id: PrimitiveComponentId
): ComponentScorecard {
  const isForm = includes(formPrimitiveIds, id);
  const isOverlay = includes(overlayPrimitiveIds, id);
  const isData = includes(dataPrimitiveIds, id);
  const isLayout = includes(layoutPrimitiveIds, id);

  return {
    a11yLabels: isLayout ? "manual" : "covered",
    densityFit: isLayout ? "fixed-format" : "dense",
    id,
    keyboardSupport: isLayout ? "manual" : "covered",
    kind: "primitive",
    owner: "design-system",
    overflowBehavior: isData ? "horizontal-scroll" : "bounded",
    reducedMotion: isOverlay ? "covered" : "manual",
    statesCovered: getPrimitiveStates({ isData, isForm, isOverlay }),
    status: "ready",
    visualBaselineStory: `Afenda UI/${toStoryTitle(id)}`,
  };
}

function createBlockScorecard(id: BlockComponentId): ComponentScorecard {
  const owner = getBlockOwner(id);

  return {
    a11yLabels: "covered",
    densityFit: "dense",
    id,
    keyboardSupport: "covered",
    kind: "block",
    owner,
    overflowBehavior: getBlockOverflowBehavior(id),
    reducedMotion: "manual",
    statesCovered: [
      "default",
      "loading",
      "empty",
      "error",
      "forbidden",
      "readonly",
    ],
    status: "ready",
    visualBaselineStory: `Blocks/${getBlockStoryGroup(id)}`,
  };
}

function getBlockOverflowBehavior(
  id: BlockComponentId
): ComponentOverflowBehavior {
  if (id.includes("AppShell")) {
    return "viewport-managed";
  }

  if (id.includes("Table")) {
    return "horizontal-scroll";
  }

  return "bounded";
}

function getBlockOwner(id: BlockComponentId): ComponentScorecardOwner {
  if (includes(metadataBlockIds, id)) {
    return "metadata-platform";
  }

  if (includes(workflowBlockIds, id)) {
    return "workflow-blocks";
  }

  return "design-system";
}

function getPrimitiveStates({
  isData,
  isForm,
  isOverlay,
}: {
  readonly isData: boolean;
  readonly isForm: boolean;
  readonly isOverlay: boolean;
}): readonly ComponentReadinessState[] {
  if (isForm) {
    return [
      "default",
      "hover",
      "focus-visible",
      "active",
      "disabled",
      "invalid",
      "reduced-motion",
    ];
  }

  if (isOverlay) {
    return ["default", "focus-visible", "active", "reduced-motion"];
  }

  if (isData) {
    return ["default", "hover", "focus-visible", "selected", "empty"];
  }

  return ["default", "focus-visible"];
}

function getBlockStoryGroup(id: BlockComponentId) {
  if (includes(workflowBlockIds, id)) {
    return "Workflow";
  }

  if (includes(metadataBlockIds, id)) {
    return "Quality Gates";
  }

  if (
    id.includes("Table") ||
    id.includes("Audit") ||
    id.includes("Evidence") ||
    id.includes("Timeline") ||
    id.includes("Toolbar")
  ) {
    return "Operator";
  }

  if (
    id.includes("Queue") ||
    id.includes("Risk") ||
    id.includes("Record") ||
    id.includes("State") ||
    id.includes("Bulk")
  ) {
    return "Advanced";
  }

  return "Foundation";
}

function toStoryTitle(id: PrimitiveComponentId) {
  return id
    .split("-")
    .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`)
    .join("");
}

function includes<TValue extends string>(
  values: readonly TValue[],
  value: string
): value is TValue {
  return values.includes(value as TValue);
}

export {
  blockComponentIds,
  blockScorecards,
  componentReadinessStateValues,
  componentScorecards,
  feedbackPrimitiveIds,
  primitiveComponentIds,
  primitiveScorecards,
};
export type {
  BlockComponentId,
  ComponentDensityFit,
  ComponentOverflowBehavior,
  ComponentReadinessLevel,
  ComponentReadinessState,
  ComponentScorecard,
  ComponentScorecardId,
  ComponentScorecardKind,
  ComponentScorecardOwner,
  ComponentScorecardStatus,
  PrimitiveComponentId,
};
