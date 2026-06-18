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
  "AfendaAppContent",
  "AfendaAppFooter",
  "AfendaAppShell",
  "AfendaAppSidebar",
  "AfendaAppTopbar",
  "AppSidebar",
  "ChartAreaInteractive",
  "DashboardDataTable",
  "DashboardNavTopbar",
  "DashboardPage",
  "NavDocuments",
  "NavMain",
  "NavSecondary",
  "NavUser",
  "SectionCards",
  "SiteHeader",
] as const;

export type AfendaBlockComponentId =
  (typeof AFENDA_BLOCK_COMPONENT_IDS)[number];

export const AFENDA_INTERNAL_COMPONENT_IDS = [] as const;

export type AfendaInternalComponentId =
  (typeof AFENDA_INTERNAL_COMPONENT_IDS)[number];

export const AFENDA_COMPONENT_IDENTITY_REGISTRY = [
  ...AFENDA_PRIMITIVE_COMPONENT_IDS,
  ...AFENDA_BLOCK_COMPONENT_IDS,
] as const;

export type AfendaComponentIdentity =
  (typeof AFENDA_COMPONENT_IDENTITY_REGISTRY)[number];

export const afendaComponentRegistry = {
  primitiveComponentIds: AFENDA_PRIMITIVE_COMPONENT_IDS,
  blockComponentIds: AFENDA_BLOCK_COMPONENT_IDS,
  internalComponentIds: AFENDA_INTERNAL_COMPONENT_IDS,
  componentIdentityRegistry: AFENDA_COMPONENT_IDENTITY_REGISTRY,
} as const;

export type AfendaComponentRegistry = typeof afendaComponentRegistry;
