import {
  AFENDA_BLOCK_COMPONENT_IDS,
  AFENDA_PRIMITIVE_COMPONENT_IDS,
  type AfendaComponentIdentity,
} from "./registries/component.registry";
import {
  AFENDA_RECIPE_REGISTRY,
  type AfendaRecipeRegistryIdentity,
} from "./registries/recipe.registry";
import {
  AFENDA_SLOT_EXACT_IDENTITY_REGISTRY,
  AFENDA_SLOT_IDENTITY_PATTERN_REGISTRY,
  type AfendaExactSlotIdentity,
} from "./registries/slot.registry";
import {
  AFENDA_VARIANT_PROPS,
  type AfendaVariantProp,
} from "./registries/variant.registry";

export type AfendaComponentManifestKind = "primitive" | "block";

export type AfendaComponentManifestState =
  | "default"
  | "hover"
  | "focus"
  | "active"
  | "selected"
  | "checked"
  | "indeterminate"
  | "open"
  | "closed"
  | "disabled"
  | "loading"
  | "readonly"
  | "invalid"
  | "empty"
  | "error"
  | "success"
  | "warning";

export interface AfendaComponentManifestEntry {
  readonly id: AfendaComponentIdentity;
  readonly kind: AfendaComponentManifestKind;
  readonly slots: readonly string[];
  readonly variants: readonly AfendaVariantProp[];
  readonly recipes: readonly AfendaRecipeRegistryIdentity[];
  readonly states: readonly AfendaComponentManifestState[];
  readonly examples: readonly string[];
}

const componentOverrides: Partial<
  Record<
    AfendaComponentIdentity,
    Omit<AfendaComponentManifestEntry, "id" | "kind">
  >
> = {
  accordion: {
    slots: [
      "accordion",
      "accordion-item",
      "accordion-trigger",
      "accordion-content",
    ],
    variants: [],
    recipes: [
      "bodyText",
      "bodyMediumText",
      "captionText",
      "colorTransition",
      "focusRingOnly",
      "motionReduce",
      "accordionTriggerLabel",
      "accordionTriggerIcon",
    ],
    states: ["default", "open", "closed", "disabled"],
    examples: [],
  },
  "alert-dialog": {
    slots: [
      "alert-dialog",
      "alert-dialog-trigger",
      "alert-dialog-portal",
      "alert-dialog-overlay",
      "alert-dialog-content",
      "alert-dialog-header",
      "alert-dialog-footer",
      "alert-dialog-title",
      "alert-dialog-description",
      "alert-dialog-action",
      "alert-dialog-cancel",
    ],
    variants: [],
    recipes: [
      "modalBackdrop",
      "sectionGap",
      "modalPadding",
      "modalSurface",
      "focusRingOnly",
      "modalHeader",
      "modalFooter",
      "titleText",
      "captionText",
    ],
    states: ["default", "open", "closed"],
    examples: [],
  },
  alert: {
    slots: ["alert", "alert-title", "alert-description"],
    variants: ["tone"],
    recipes: ["bodyText", "bodyMediumText", "captionText"],
    states: ["default"],
    examples: [],
  },
  avatar: {
    slots: ["avatar", "avatar-image", "avatar-fallback"],
    variants: ["size"],
    recipes: ["captionText"],
    states: ["default"],
    examples: [],
  },
  breadcrumb: {
    slots: [
      "breadcrumb",
      "breadcrumb-list",
      "breadcrumb-item",
      "breadcrumb-link",
      "breadcrumb-page",
      "breadcrumb-separator",
      "breadcrumb-ellipsis",
    ],
    variants: [],
    recipes: [
      "captionText",
      "motionReduce",
      "colorTransition",
      "focusRingOnly",
      "breadcrumbEllipsisIcon",
      "visuallyHidden",
    ],
    states: ["default", "hover", "focus"],
    examples: [],
  },
  button: {
    slots: ["button"],
    variants: ["variant", "size"],
    recipes: [
      "buttonText",
      "interactiveTransition",
      "disabledAction",
      "invalidState",
      "focusRing",
      "motionReduce",
      "controlIcon",
    ],
    states: ["default", "hover", "active", "disabled", "invalid"],
    examples: [],
  },
  calendar: {
    slots: ["calendar"],
    variants: [],
    recipes: [
      "bodyText",
      "bodyMediumText",
      "captionText",
      "calendarWeekNumberCell",
    ],
    states: ["default", "selected", "disabled", "focus"],
    examples: [],
  },
  carousel: {
    slots: [
      "carousel",
      "carousel-content",
      "carousel-item",
      "carousel-previous",
      "carousel-next",
    ],
    variants: [],
    recipes: ["bodyText", "motionReduce", "visuallyHidden"],
    states: ["default", "disabled"],
    examples: [],
  },
  chart: {
    slots: ["chart"],
    variants: [],
    recipes: [
      "captionText",
      "chartTooltipItems",
      "chartTooltipIndicator",
      "chartTooltipIndicatorDot",
      "chartTooltipIndicatorLine",
      "chartTooltipIndicatorDashed",
      "chartTooltipIndicatorNested",
      "chartTooltipName",
      "chartTooltipValue",
      "chartLegendItem",
      "chartLegendSwatch",
    ],
    states: ["default"],
    examples: [],
  },
  checkbox: {
    slots: ["checkbox", "checkbox-indicator"],
    variants: ["tone"],
    recipes: [
      "interactiveTransition",
      "invalidState",
      "focusRing",
      "motionReduce",
      "checkboxIndicator",
      "checkboxCheckIcon",
      "checkboxIndeterminateIcon",
    ],
    states: ["default", "checked", "indeterminate", "disabled", "invalid"],
    examples: [],
  },
  command: {
    slots: [
      "command",
      "command-input-wrapper",
      "command-input",
      "command-list",
      "command-empty",
      "command-group",
      "command-separator",
      "command-item",
      "command-shortcut",
    ],
    variants: [],
    recipes: [
      "bodyText",
      "visuallyHidden",
      "commandInputWrapper",
      "commandInputIcon",
      "captionText",
      "commandGroup",
      "rowItem",
      "rowHighlight",
      "rowIcon",
      "shortcutText",
    ],
    states: ["default", "selected", "disabled", "empty"],
    examples: [],
  },
  "context-menu": {
    slots: [
      "context-menu",
      "context-menu-trigger",
      "context-menu-group",
      "context-menu-portal",
      "context-menu-sub",
      "context-menu-radio-group",
      "context-menu-sub-trigger",
      "context-menu-sub-content",
      "context-menu-content",
      "context-menu-item",
      "context-menu-checkbox-item",
      "context-menu-radio-item",
      "context-menu-label",
      "context-menu-separator",
      "context-menu-shortcut",
    ],
    variants: [],
    recipes: [
      "rowItem",
      "rowInset",
      "rowHighlight",
      "rowDisabled",
      "rowCritical",
      "rowIcon",
      "rowCriticalIcon",
      "overlaySurface",
      "menuPadding",
      "overlayMotion",
      "rowCheckboxPadding",
      "itemIndicator",
      "itemIndicatorCheckIcon",
      "itemIndicatorRadioIcon",
      "menuLabelInset",
      "metadataText",
      "menuSeparatorInset",
      "motionReduce",
      "shortcutText",
    ],
    states: ["default", "open", "checked", "disabled"],
    examples: [],
  },
  dialog: {
    slots: [
      "dialog",
      "dialog-trigger",
      "dialog-portal",
      "dialog-close",
      "dialog-overlay",
      "dialog-content",
      "dialog-header",
      "dialog-footer",
      "dialog-title",
      "dialog-description",
    ],
    variants: [],
    recipes: [
      "modalBackdrop",
      "sectionGap",
      "modalPadding",
      "modalSurface",
      "dismissButton",
      "colorTransition",
      "focusRingOnly",
      "motionReduce",
      "visuallyHidden",
      "modalHeader",
      "modalFooter",
      "titleText",
      "captionText",
    ],
    states: ["default", "open", "closed"],
    examples: [],
  },
  drawer: {
    slots: [
      "drawer",
      "drawer-trigger",
      "drawer-portal",
      "drawer-close",
      "drawer-overlay",
      "drawer-content",
      "drawer-header",
      "drawer-footer",
      "drawer-title",
      "drawer-description",
    ],
    variants: [],
    recipes: [
      "modalBackdrop",
      "bodyText",
      "focusRingOnly",
      "motionReduce",
      "titleText",
      "captionText",
    ],
    states: ["default", "open", "closed"],
    examples: [],
  },
  "dropdown-menu": {
    slots: [
      "dropdown-menu",
      "dropdown-menu-portal",
      "dropdown-menu-trigger",
      "dropdown-menu-content",
      "dropdown-menu-group",
      "dropdown-menu-label",
      "dropdown-menu-item",
      "dropdown-menu-checkbox-item",
      "dropdown-menu-radio-group",
      "dropdown-menu-radio-item",
      "dropdown-menu-separator",
      "dropdown-menu-shortcut",
      "dropdown-menu-sub",
      "dropdown-menu-sub-trigger",
      "dropdown-menu-sub-content",
    ],
    variants: [],
    recipes: [
      "overlaySurface",
      "menuPadding",
      "bodyText",
      "dropdownOrigin",
      "overlayMotion",
      "menuLabelInset",
      "metadataText",
      "rowItem",
      "rowHighlight",
      "rowDisabled",
      "rowCritical",
      "rowInset",
      "rowIcon",
      "rowCriticalIcon",
      "rowCheckboxPadding",
      "itemIndicator",
      "itemIndicatorMuted",
      "itemIndicatorCheckIcon",
      "itemIndicatorRadioIcon",
      "shortcutText",
      "submenuChevronIcon",
      "menuSeparator",
    ],
    states: ["default", "open", "checked", "disabled"],
    examples: [],
  },
  empty: {
    slots: [
      "empty",
      "empty-header",
      "empty-media",
      "empty-title",
      "empty-description",
      "empty-content",
    ],
    variants: ["variant"],
    recipes: [
      "sectionGap",
      "bodyText",
      "motionReduce",
      "titleText",
      "captionText",
      "focusRingOnly",
    ],
    states: ["default", "empty"],
    examples: [],
  },
  field: {
    slots: [
      "field-set",
      "field-legend",
      "field-group",
      "field",
      "field-content",
      "field-label",
      "field-title",
      "field-description",
      "field-hint",
      "field-separator",
      "field-separator-content",
      "field-error",
      "field-required",
    ],
    variants: ["variant"],
    recipes: [
      "sectionGap",
      "bodyMediumText",
      "labelText",
      "fieldGap",
      "captionText",
      "focusRingOnly",
      "fieldSeparatorContent",
      "fieldErrorList",
    ],
    states: ["default", "disabled", "invalid"],
    examples: [],
  },
  grid: {
    slots: ["grid"],
    variants: [],
    recipes: ["motionReduce"],
    states: ["default"],
    examples: [],
  },
  "input-group": {
    slots: [
      "input-group",
      "input-group-addon",
      "input-group-control",
      "input-group-text",
    ],
    variants: ["size"],
    recipes: [
      "flatControlSurface",
      "colorTransition",
      "motionReduce",
      "bodyMediumText",
      "captionText",
      "mutedControlIcon",
    ],
    states: ["default", "focus", "disabled", "invalid"],
    examples: [],
  },
  "input-otp": {
    slots: [
      "input-otp",
      "input-otp-group",
      "input-otp-slot",
      "input-otp-separator",
    ],
    variants: [],
    recipes: ["motionReduce", "colorTransition"],
    states: ["default", "focus", "disabled", "invalid"],
    examples: [],
  },
  item: {
    slots: [
      "item",
      "item-group",
      "item-separator",
      "item-media",
      "item-content",
      "item-title",
      "item-description",
      "item-actions",
      "item-header",
      "item-footer",
    ],
    variants: ["variant", "size"],
    recipes: ["colorTransition", "focusRing", "motionReduce", "bodyText", "captionText"],
    states: ["default", "hover", "focus"],
    examples: [],
  },
  kbd: {
    slots: ["kbd", "kbd-sequence"],
    variants: ["size"],
    recipes: ["shortcutText", "motionReduce"],
    states: ["default"],
    examples: [],
  },
  menubar: {
    slots: [
      "menubar",
      "menubar-menu",
      "menubar-group",
      "menubar-portal",
      "menubar-radio-group",
      "menubar-trigger",
      "menubar-content",
      "menubar-item",
      "menubar-checkbox-item",
      "menubar-radio-item",
      "menubar-label",
      "menubar-separator",
      "menubar-shortcut",
      "menubar-sub",
      "menubar-sub-trigger",
      "menubar-sub-content",
    ],
    variants: [],
    recipes: [
      "bodyText",
      "motionReduce",
      "buttonText",
      "colorTransition",
      "focusRingOnly",
      "overlaySurface",
      "menuPadding",
      "overlayMotion",
      "rowItem",
      "rowInset",
      "rowHighlight",
      "rowDisabled",
      "rowCritical",
      "rowIcon",
      "rowCriticalIcon",
      "rowCheckboxPadding",
      "itemIndicator",
      "itemIndicatorCheckIcon",
      "itemIndicatorRadioIcon",
      "menuLabelInset",
      "metadataText",
      "menuSeparatorInset",
      "shortcutText",
    ],
    states: ["default", "open", "checked", "disabled"],
    examples: [],
  },
  "metric-text": {
    slots: ["metric-text"],
    variants: ["size", "color"],
    recipes: ["motionReduce"],
    states: ["default"],
    examples: [],
  },
  "navigation-menu": {
    slots: [
      "navigation-menu",
      "navigation-menu-list",
      "navigation-menu-item",
      "navigation-menu-trigger",
      "navigation-menu-content",
      "navigation-menu-viewport",
      "navigation-menu-link",
      "navigation-menu-indicator",
    ],
    variants: [],
    recipes: [
      "bodyText",
      "motionReduce",
      "buttonText",
      "colorTransition",
      "focusRingOnly",
      "disabledAction",
      "navigationMenuTriggerIcon",
      "overlaySurface",
      "overlayMotion",
      "mutedControlIcon",
      "navigationMenuViewportWrapper",
      "navigationMenuIndicatorArrow",
    ],
    states: ["default", "open", "closed", "focus"],
    examples: [],
  },
  pagination: {
    slots: [
      "pagination",
      "pagination-content",
      "pagination-item",
      "pagination-link",
      "pagination-ellipsis",
    ],
    variants: [],
    recipes: ["motionReduce", "captionText", "paginationIcon", "visuallyHidden"],
    states: ["default", "active", "disabled"],
    examples: [],
  },
  progress: {
    slots: ["progress", "progress-indicator"],
    variants: ["tone"],
    recipes: ["motionReduce"],
    states: ["default"],
    examples: [],
  },
  "radio-group": {
    slots: [
      "radio-group",
      "radio-group-item",
      "radio-group-indicator",
      "radio-group-option",
      "radio-group-label",
      "radio-group-description",
    ],
    variants: [],
    recipes: [
      "colorTransition",
      "focusRing",
      "invalidState",
      "motionReduce",
      "radioGroupIndicator",
      "radioGroupIndicatorIcon",
      "bodyMediumText",
      "captionText",
    ],
    states: ["default", "checked", "disabled", "invalid"],
    examples: [],
  },
  resizable: {
    slots: ["resizable-panel-group", "resizable-panel", "resizable-handle"],
    variants: [],
    recipes: [
      "motionReduce",
      "focusRingOnly",
      "colorTransition",
      "resizableHandleIcon",
    ],
    states: ["default", "active", "focus"],
    examples: [],
  },
  "scroll-area": {
    slots: [
      "scroll-area",
      "scroll-area-viewport",
      "scroll-area-scrollbar",
      "scroll-area-thumb",
    ],
    variants: [],
    recipes: [
      "motionReduce",
      "focusRingOnly",
      "colorTransition",
      "scrollAreaCorner",
      "scrollAreaThumb",
    ],
    states: ["default", "hover", "focus"],
    examples: [],
  },
  select: {
    slots: [
      "select",
      "select-group",
      "select-value",
      "select-portal",
      "select-trigger",
      "select-content",
      "select-label",
      "select-item",
      "select-separator",
      "select-scroll-up-button",
      "select-scroll-down-button",
    ],
    variants: ["size"],
    recipes: [
      "flatControlSurface",
      "controlText",
      "colorTransition",
      "disabledControl",
      "invalidState",
      "focusRing",
      "motionReduce",
      "mutedControlIcon",
      "selectIcon",
      "overlaySurface",
      "bodyText",
      "selectOrigin",
      "overlayMotion",
      "menuPadding",
      "metadataText",
      "rowItem",
      "rowHighlight",
      "rowDisabled",
      "rowIcon",
      "selectItemIndicator",
      "overlayScrollButton",
    ],
    states: ["default", "open", "disabled", "invalid"],
    examples: [],
  },
  sheet: {
    slots: [
      "sheet",
      "sheet-trigger",
      "sheet-close",
      "sheet-portal",
      "sheet-overlay",
      "sheet-content",
      "sheet-header",
      "sheet-footer",
      "sheet-title",
      "sheet-description",
      "sheet-body",
    ],
    variants: [],
    recipes: [
      "modalBackdrop",
      "sectionGap",
      "modalPadding",
      "dismissButton",
      "colorTransition",
      "focusRingOnly",
      "motionReduce",
      "visuallyHidden",
      "modalHeader",
      "modalFooter",
      "titleText",
      "captionText",
    ],
    states: ["default", "open", "closed"],
    examples: [],
  },
  slider: {
    slots: ["slider", "slider-track", "slider-range", "slider-thumb"],
    variants: [],
    recipes: [
      "motionReduce",
      "sliderTrack",
      "sliderRange",
      "sliderThumb",
      "colorTransition",
      "focusRingOnly",
    ],
    states: ["default", "disabled", "focus"],
    examples: [],
  },
  spinner: {
    slots: ["spinner"],
    variants: ["size"],
    recipes: ["motionReduce"],
    states: ["default", "loading"],
    examples: [],
  },
  table: {
    slots: [
      "table-container",
      "table",
      "table-header",
      "table-body",
      "table-footer",
      "table-row",
      "table-head",
      "table-cell",
      "table-caption",
    ],
    variants: ["variant"],
    recipes: ["panelSurface", "bodyText", "captionText"],
    states: ["default", "selected"],
    examples: [],
  },
  toaster: {
    slots: ["toaster"],
    variants: [],
    recipes: [
      "toasterRoot",
      "toastSuccessIcon",
      "toastInfoIcon",
      "toastWarningIcon",
      "toastCriticalIcon",
      "toastLoadingIcon",
      "bodyMediumText",
      "captionText",
    ],
    states: ["default", "success", "warning", "error", "loading"],
    examples: [],
  },
  textarea: {
    slots: ["textarea"],
    variants: ["density"],
    recipes: [
      "flatControlSurface",
      "controlText",
      "colorTransition",
      "disabledControl",
      "readOnlyControl",
      "motionReduce",
      "focusRing",
      "invalidState",
    ],
    states: ["default", "focus", "disabled", "readonly", "invalid"],
    examples: [],
  },
  tooltip: {
    slots: [
      "tooltip-provider",
      "tooltip",
      "tooltip-trigger",
      "tooltip-portal",
      "tooltip-content",
    ],
    variants: [],
    recipes: ["captionText", "overlayMotion", "tooltipArrow"],
    states: ["default", "open", "closed"],
    examples: [],
  },
};

export const AFENDA_COMPONENT_MANIFEST = [
  ...AFENDA_PRIMITIVE_COMPONENT_IDS.map((id) =>
    createManifestEntry(id, "primitive")
  ),
  ...AFENDA_BLOCK_COMPONENT_IDS.map((id) => createManifestEntry(id, "block")),
] as const satisfies readonly AfendaComponentManifestEntry[];

export const afendaComponentManifest = {
  components: AFENDA_COMPONENT_MANIFEST,
} as const;

export type AfendaComponentManifest = typeof afendaComponentManifest;

function createManifestEntry(
  id: AfendaComponentIdentity,
  kind: AfendaComponentManifestKind
): AfendaComponentManifestEntry {
  const override = componentOverrides[id];
  const defaultSlot = toDefaultSlot(id);

  return {
    id,
    kind,
    slots: override?.slots ?? (defaultSlot ? [defaultSlot] : []),
    variants: override?.variants ?? [],
    recipes: override?.recipes ?? [],
    states: override?.states ?? ["default"],
    examples: override?.examples ?? [],
  };
}

function toDefaultSlot(
  id: AfendaComponentIdentity
): AfendaExactSlotIdentity | undefined {
  const candidate = kindlessComponentId(id);

  if (isKnownExactSlot(candidate)) {
    return candidate;
  }

  const blockCandidate = `${candidate}-block`;

  if (isKnownExactSlot(blockCandidate)) {
    return blockCandidate;
  }

  return undefined;
}

function kindlessComponentId(id: AfendaComponentIdentity): string {
  return id.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function isKnownExactSlot(value: string): value is AfendaExactSlotIdentity {
  return AFENDA_SLOT_EXACT_IDENTITY_REGISTRY.includes(
    value as AfendaExactSlotIdentity
  );
}

export const AFENDA_COMPONENT_MANIFEST_VOCABULARY = {
  recipeRegistry: AFENDA_RECIPE_REGISTRY,
  slotExactIdentityRegistry: AFENDA_SLOT_EXACT_IDENTITY_REGISTRY,
  slotIdentityPatternRegistry: AFENDA_SLOT_IDENTITY_PATTERN_REGISTRY,
  variantProps: AFENDA_VARIANT_PROPS,
} as const;
