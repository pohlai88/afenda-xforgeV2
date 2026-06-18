/**
 * Afenda Component Contract
 *
 * Component owns behavior.
 *
 * Purpose:
 * - Define component authority.
 * - Govern component identity, categories, props, and behavior.
 * - Prevent components from owning tokens, variants, recipes, slots, or examples.
 * - Keep styling, meaning, structure, and access delegated to owner contracts.
 *
 * This file must not contain business logic.
 */

export const AFENDA_COMPONENT_CONTRACT_ID = "afenda.component" as const;

export const AFENDA_COMPONENT_CONTRACT_VERSION = "0.1.0" as const;

export const AFENDA_COMPONENT_CATEGORIES = [
  "primitive",
  "form",
  "feedback",
  "navigation",
  "overlay",
  "data-display",
  "layout",
  "surface",
  "disclosure",
  "composition",
] as const;

export type AfendaComponentCategory =
  (typeof AFENDA_COMPONENT_CATEGORIES)[number];

export const AFENDA_PRIMITIVE_COMPONENT_IDS = [
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
  "spinner",
  "stack",
  "switch",
  "table",
  "tabs",
  "text",
  "textarea",
  "toaster",
  "toggle",
  "toggle-group",
  "tooltip",
] as const;

export type AfendaPrimitiveComponentId =
  (typeof AFENDA_PRIMITIVE_COMPONENT_IDS)[number];

export const AFENDA_BLOCK_COMPONENT_IDS = [
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
  "DashboardDataTable",
  "DashboardNavTopbar",
  "DashboardPage",
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
  "NavUser",
  "OperationalDashboardShell",
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
  "SiteHeader",
  "SlaRiskEscalationPanel",
  "StatsStrip",
  "StatusTimeline",
  "TenantOperationsWorkspace",
  "TopbarShortcutsDialog",
] as const;

export type AfendaBlockComponentId =
  (typeof AFENDA_BLOCK_COMPONENT_IDS)[number];

export const AFENDA_INTERNAL_COMPONENT_IDS = [
  "TopbarUtilitiesBar",
] as const;

export const AFENDA_COMPONENT_IDENTITY_REGISTRY = [
  ...AFENDA_PRIMITIVE_COMPONENT_IDS,
  ...AFENDA_BLOCK_COMPONENT_IDS,
] as const;

export type AfendaComponentIdentity =
  (typeof AFENDA_COMPONENT_IDENTITY_REGISTRY)[number];

export const AFENDA_COMPONENT_AUTHORITY_RULES = {
  componentOwnsBehavior: true,
  componentOwnsInteractionWiring: true,
  componentOwnsAccessibilityWiring: true,
  componentOwnsPublicProps: true,
  componentOwnsCompositionBoundary: true,
} as const;

export const AFENDA_COMPONENT_FORBIDDEN_OWNERSHIP = {
  componentsMustNotOwnRawValues: true,
  componentsMustNotDeclareTokens: true,
  componentsMustNotDeclareVariants: true,
  componentsMustNotDeclareRecipes: true,
  componentsMustNotDeclareSlots: true,
  componentsMustNotDeclareExamples: true,
  componentsMustNotOwnSemanticStyling: true,
  componentsMustNotOwnBusinessLogic: true,
} as const;

export const AFENDA_COMPONENT_RECIPE_RULES = {
  componentsMustUseRecipesForStyling: true,
  componentsMustNotInlineSemanticClassNames: true,
  componentWithoutRecipeIsHardFail: true,
  recipeOwnsClassComposition: true,
} as const;

export const AFENDA_COMPONENT_VARIANT_RULES = {
  componentsMayAcceptGovernedVariants: true,
  componentsMustNotInventVariants: true,
  variantsMustComeFromVariantContract: true,
  ungovernedVariantPropIsHardFail: true,
} as const;

export const AFENDA_COMPONENT_SLOT_RULES = {
  componentsMustExposeDataSlot: true,
  componentsMustUseContractSlots: true,
  componentsMustNotInventSlotNames: true,
  unknownSlotIsHardFail: true,
} as const;

export const AFENDA_COMPONENT_PROP_RULES = {
  publicPropsMustBeExplicit: true,
  publicPropsMustBeBoundarySafe: true,
  publicPropsMustAvoidAny: true,
  publicPropsMustAvoidUnknownEscapeHatches: true,
  serializableConfigPropsMustNotUseReactNode: true,
  behaviorCallbacksMustStayComponentLocal: true,
} as const;

export const AFENDA_COMPONENT_IMPORT_RULES = {
  componentsMustImportFromPublicSurfaces: true,
  privateImportsAreHardFail: true,
  barrelImportsMustNotCreateCycles: true,
} as const;

export const AFENDA_COMPONENT_NAMING_RULES = {
  componentNamesMustUsePascalCase: true,
  componentFilesMustUseKebabCase: true,
  propTypesMustUseComponentNamePrefix: true,
  dataSlotsMustUseKebabCase: true,
} as const;

export const AFENDA_COMPONENT_BOUNDARY_RULES = {
  componentsMustNotCallServerActions: true,
  componentsMustNotOwnDataFetching: true,
  componentsMustNotOwnAuthorization: true,
  componentsMustNotOwnTenantLogic: true,
  componentsMustNotOwnAuditLogic: true,
  componentsMustNotReadEnvironmentVariables: true,
} as const;

export const AFENDA_COMPONENT_FORBIDDEN_PATTERNS = [
  "as any",
  "Record<string, any>",
  "bg-[#",
  "text-[#",
  "border-[#",
  "oklch(",
  "rgb(",
  "rgba(",
  "hsl(",
  "hsla(",
  "use server",
  "process.env",
] as const;

export const AFENDA_COMPONENT_SOURCE_OF_TRUTH = [
  "afenda-component.contract.ts",
  "afenda-recipe.contract.ts",
  "afenda-slot.contract.ts",
  "afenda-variant.contract.ts",
  "afenda-token.contract.ts",
] as const;

export const AFENDA_COMPONENT_PRINCIPLES = [
  "component-owns-behavior",
  "component-does-not-own-value",
  "component-does-not-own-meaning",
  "component-does-not-own-styling",
  "component-does-not-own-structure-vocabulary",
  "component-uses-recipes-for-styling",
  "component-uses-slots-for-structure",
  "component-accepts-governed-variants-only",
  "component-must-not-contain-business-logic",
] as const;

export const afendaComponentContract = {
  id: AFENDA_COMPONENT_CONTRACT_ID,
  version: AFENDA_COMPONENT_CONTRACT_VERSION,
  categories: AFENDA_COMPONENT_CATEGORIES,
  primitiveComponentIds: AFENDA_PRIMITIVE_COMPONENT_IDS,
  blockComponentIds: AFENDA_BLOCK_COMPONENT_IDS,
  internalComponentIds: AFENDA_INTERNAL_COMPONENT_IDS,
  componentIdentityRegistry: AFENDA_COMPONENT_IDENTITY_REGISTRY,
  authorityRules: AFENDA_COMPONENT_AUTHORITY_RULES,
  forbiddenOwnership: AFENDA_COMPONENT_FORBIDDEN_OWNERSHIP,
  recipeRules: AFENDA_COMPONENT_RECIPE_RULES,
  variantRules: AFENDA_COMPONENT_VARIANT_RULES,
  slotRules: AFENDA_COMPONENT_SLOT_RULES,
  propRules: AFENDA_COMPONENT_PROP_RULES,
  importRules: AFENDA_COMPONENT_IMPORT_RULES,
  namingRules: AFENDA_COMPONENT_NAMING_RULES,
  boundaryRules: AFENDA_COMPONENT_BOUNDARY_RULES,
  forbiddenPatterns: AFENDA_COMPONENT_FORBIDDEN_PATTERNS,
  sourceOfTruth: AFENDA_COMPONENT_SOURCE_OF_TRUTH,
  principles: AFENDA_COMPONENT_PRINCIPLES,
} as const;

export type AfendaComponentContract = typeof afendaComponentContract;
