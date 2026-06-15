type AfendaRecipeOwner =
  | "typography"
  | "primitive"
  | "surface"
  | "overlay"
  | "row"
  | "state"
  | "motion"
  | "icon"
  | "spacing";

type AfendaRecipeKind = "composition" | "interaction" | "layout" | "motion";

type AfendaRecipeScope = "global" | "component-family";

interface AfendaRecipeEntry {
  readonly className: string;
  readonly description: string;
  readonly kind: AfendaRecipeKind;
  readonly owner: AfendaRecipeOwner;
  readonly scope: AfendaRecipeScope;
}

type AfendaRecipeContract = Record<string, AfendaRecipeEntry>;

const afendaRecipe = {
  bodyText: {
    owner: "typography",
    kind: "composition",
    scope: "global",
    description: "Default Afenda body text, mapped to globals.css body tokens.",
    className:
      "text-[length:var(--xforge-font-body-size)] font-normal leading-[var(--xforge-font-body-line-height)] text-text-primary",
  },
  bodyMediumText: {
    owner: "typography",
    kind: "composition",
    scope: "global",
    description: "Medium body text for compact titles and emphasized labels.",
    className:
      "text-[length:var(--xforge-font-body-size)] font-medium leading-[var(--xforge-font-body-line-height)] text-text-primary",
  },
  controlText: {
    owner: "typography",
    kind: "composition",
    scope: "global",
    description: "Typography for form controls and value-bearing inputs.",
    className:
      "text-[length:var(--xforge-font-body-size)] font-normal tabular-nums text-text-primary",
  },
  buttonText: {
    owner: "typography",
    kind: "composition",
    scope: "global",
    description: "Typography for Afenda action buttons.",
    className:
      "text-[length:var(--xforge-font-body-size)] font-medium tabular-nums",
  },
  labelText: {
    owner: "typography",
    kind: "composition",
    scope: "global",
    description: "Primary field identity text.",
    className:
      "text-[length:var(--xforge-font-body-size)] font-medium leading-none text-text-primary",
  },
  titleText: {
    owner: "typography",
    kind: "composition",
    scope: "global",
    description: "Compact modal, sheet, and panel title text.",
    className: "text-[14px] font-semibold leading-5 text-text-primary",
  },
  captionText: {
    owner: "typography",
    kind: "composition",
    scope: "global",
    description: "Supporting copy, descriptions, hints, and captions.",
    className:
      "text-[length:var(--xforge-font-caption-size)] leading-[var(--xforge-font-caption-line-height)] text-text-secondary",
  },
  metadataText: {
    owner: "typography",
    kind: "composition",
    scope: "global",
    description:
      "Small uppercase metadata labels for grouped menus and panels.",
    className:
      "text-[length:var(--xforge-font-label-size)] font-medium uppercase tracking-[0.08em] text-text-secondary",
  },
  badgeText: {
    owner: "typography",
    kind: "composition",
    scope: "component-family",
    description: "Badge status typography without forced uppercase.",
    className:
      "text-[length:var(--xforge-font-label-size)] font-medium tabular-nums",
  },
  shortcutText: {
    owner: "typography",
    kind: "composition",
    scope: "component-family",
    description: "Keyboard shortcut and right-side affordance text.",
    className:
      "text-[length:var(--xforge-font-label-size)] tracking-wide text-text-tertiary",
  },
  focusRing: {
    owner: "state",
    kind: "interaction",
    scope: "global",
    description: "Shared focus ring for controls with a visible border.",
    className:
      "focus-visible:border-border-active focus-visible:ring-[3px] focus-visible:ring-ring/50",
  },
  focusRingOnly: {
    owner: "state",
    kind: "interaction",
    scope: "global",
    description: "Shared focus ring for borderless icon controls.",
    className:
      "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
  },
  invalidState: {
    owner: "state",
    kind: "interaction",
    scope: "global",
    description: "Shared invalid state for field primitives.",
    className:
      "aria-invalid:border-danger aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40",
  },
  disabledAction: {
    owner: "state",
    kind: "interaction",
    scope: "global",
    description: "Disabled state for actions.",
    className:
      "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  },
  disabledControl: {
    owner: "state",
    kind: "interaction",
    scope: "global",
    description: "Disabled state for editable field controls.",
    className:
      "disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-border-subtle disabled:bg-surface-muted disabled:text-text-secondary disabled:opacity-80",
  },
  readOnlyControl: {
    owner: "state",
    kind: "interaction",
    scope: "global",
    description: "Read-only field state for system-controlled values.",
    className:
      "read-only:cursor-default read-only:border-border-subtle read-only:bg-surface-muted read-only:text-text-primary",
  },
  motionReduce: {
    owner: "motion",
    kind: "motion",
    scope: "global",
    description: "Reduced motion opt-out for component transitions.",
    className: "motion-reduce:transition-none",
  },
  colorTransition: {
    owner: "motion",
    kind: "motion",
    scope: "global",
    description: "Transition for color and surface-only state changes.",
    className:
      "transition-[background-color,border-color,color,box-shadow,opacity]",
  },
  interactiveTransition: {
    owner: "motion",
    kind: "motion",
    scope: "global",
    description: "Transition for interactive controls that may transform.",
    className:
      "transition-[background-color,border-color,color,box-shadow,opacity,transform]",
  },
  controlSurface: {
    owner: "surface",
    kind: "composition",
    scope: "global",
    description: "Default bordered control surface.",
    className:
      "rounded-[var(--button-radius)] border border-border-default bg-surface-raised",
  },
  flatControlSurface: {
    owner: "surface",
    kind: "composition",
    scope: "global",
    description: "Flat bordered control surface for ERP form controls.",
    className:
      "rounded-[var(--button-radius)] border border-border-default bg-surface-raised shadow-none",
  },
  overlaySurface: {
    owner: "surface",
    kind: "composition",
    scope: "component-family",
    description: "Floating overlay surface used by popover, select, and menus.",
    className:
      "rounded-[var(--card-radius)] border border-border-default bg-surface-overlay text-text-primary shadow-popover",
  },
  panelSurface: {
    owner: "surface",
    kind: "composition",
    scope: "component-family",
    description: "Panel surface for cards and table containers.",
    className:
      "rounded-[var(--card-radius)] border border-border-default bg-surface-raised text-text-primary shadow-panel",
  },
  modalSurface: {
    owner: "surface",
    kind: "composition",
    scope: "component-family",
    description: "Modal surface used by dialog and alert dialog content.",
    className:
      "rounded-[var(--modal-radius)] border border-border-default bg-surface-overlay text-text-primary shadow-overlay",
  },
  controlDefaultSize: {
    owner: "primitive",
    kind: "layout",
    scope: "global",
    description:
      "Default Afenda control size from globals.css component tokens.",
    className: "h-[var(--button-height)] px-[var(--button-padding-x)]",
  },
  controlCompactSize: {
    owner: "primitive",
    kind: "layout",
    scope: "global",
    description: "Compact Afenda control size.",
    className: "h-8 px-3",
  },
  controlLargeSize: {
    owner: "primitive",
    kind: "layout",
    scope: "global",
    description: "Large Afenda control size.",
    className: "h-10 px-5",
  },
  rowItem: {
    owner: "row",
    kind: "composition",
    scope: "global",
    description:
      "Base interactive row used by dropdown, command, select, menu, and listbox items.",
    className:
      "group relative flex min-h-8 cursor-default select-none items-center gap-2 rounded-[var(--xforge-radius-sm)] px-2 py-1.5 text-[length:var(--xforge-font-body-size)] font-normal leading-none text-text-primary outline-none transition-colors",
  },
  rowInset: {
    owner: "row",
    kind: "layout",
    scope: "global",
    description: "Inset modifier for rows with reserved leading structure.",
    className: "data-[inset]:pl-8",
  },
  rowHighlight: {
    owner: "row",
    kind: "interaction",
    scope: "global",
    description: "Shared highlighted, open, and selected row state.",
    className:
      "focus:bg-surface-hover focus:text-text-primary data-[highlighted]:bg-surface-hover data-[highlighted]:text-text-primary data-[selected=true]:bg-surface-active data-[selected=true]:text-text-primary data-[state=open]:bg-surface-active data-[state=open]:text-text-primary",
  },
  rowDisabled: {
    owner: "row",
    kind: "interaction",
    scope: "global",
    description: "Disabled row behavior.",
    className: "data-[disabled]:pointer-events-none data-[disabled]:opacity-45",
  },
  rowDestructive: {
    owner: "row",
    kind: "interaction",
    scope: "global",
    description: "Destructive row tone for mutating or removing data.",
    className:
      "data-[variant=destructive]:text-danger data-[variant=destructive]:focus:bg-danger-muted/25 data-[variant=destructive]:data-[highlighted]:bg-danger-muted/25 data-[variant=destructive]:focus:text-danger data-[variant=destructive]:data-[highlighted]:text-danger",
  },
  rowCheckboxPadding: {
    owner: "row",
    kind: "layout",
    scope: "global",
    description: "Row padding for checkbox and radio item indicators.",
    className: "pr-2 pl-8",
  },
  rowIcon: {
    owner: "icon",
    kind: "composition",
    scope: "global",
    description: "Default icon sizing and muted tone inside interactive rows.",
    className:
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-text-secondary",
  },
  rowDestructiveIcon: {
    owner: "icon",
    kind: "interaction",
    scope: "global",
    description: "Icon tone inheritance for destructive rows.",
    className:
      "data-[variant=destructive]:[&_svg:not([class*='text-'])]:text-danger",
  },
  controlIcon: {
    owner: "icon",
    kind: "composition",
    scope: "global",
    description: "Default icon sizing inside controls.",
    className:
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  },
  mutedControlIcon: {
    owner: "icon",
    kind: "composition",
    scope: "global",
    description: "Default muted icon sizing inside controls.",
    className:
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-text-secondary",
  },
  overlayMotion: {
    owner: "overlay",
    kind: "motion",
    scope: "global",
    description:
      "Shared overlay enter and exit motion for dropdown, popover, and select surfaces.",
    className:
      "outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 motion-reduce:animate-none",
  },
  popoverOrigin: {
    owner: "overlay",
    kind: "composition",
    scope: "component-family",
    description: "Radix popover transform origin and z-index.",
    className:
      "z-[var(--xforge-z-dropdown)] origin-(--radix-popover-content-transform-origin)",
  },
  dropdownOrigin: {
    owner: "overlay",
    kind: "composition",
    scope: "component-family",
    description: "Radix dropdown transform origin and z-index.",
    className:
      "z-[var(--xforge-z-dropdown)] origin-(--radix-dropdown-menu-content-transform-origin)",
  },
  selectOrigin: {
    owner: "overlay",
    kind: "composition",
    scope: "component-family",
    description: "Radix select transform origin and z-index.",
    className:
      "relative z-[var(--xforge-z-dropdown)] origin-(--radix-select-content-transform-origin)",
  },
  modalBackdrop: {
    owner: "overlay",
    kind: "composition",
    scope: "component-family",
    description:
      "Shared modal and drawer backdrop positioning and entry motion.",
    className:
      "fixed inset-0 z-[var(--xforge-z-modal-backdrop)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none",
  },
  modalHeader: {
    owner: "spacing",
    kind: "layout",
    scope: "component-family",
    description:
      "Shared stacked header layout for dialogs, sheets, and alerts.",
    className: "flex flex-col gap-1.5 text-left",
  },
  modalFooter: {
    owner: "spacing",
    kind: "layout",
    scope: "component-family",
    description: "Shared footer action layout for modal surfaces.",
    className: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
  },
  dismissButton: {
    owner: "primitive",
    kind: "composition",
    scope: "component-family",
    description: "Shared close button chrome for dismissible overlays.",
    className:
      "absolute top-4 right-4 inline-flex size-7 items-center justify-center rounded-[var(--xforge-radius-sm)] text-text-secondary hover:bg-surface-hover hover:text-text-primary disabled:pointer-events-none",
  },
  menuLabelInset: {
    owner: "spacing",
    kind: "layout",
    scope: "component-family",
    description: "Shared metadata label padding for menus and select groups.",
    className: "px-2 py-1.5 data-[inset]:pl-8",
  },
  menuSeparator: {
    owner: "spacing",
    kind: "composition",
    scope: "component-family",
    description: "Shared menu separator rhythm.",
    className: "my-1 h-px bg-border-default",
  },
  menuSeparatorInset: {
    owner: "spacing",
    kind: "composition",
    scope: "component-family",
    description:
      "Shared edge-to-edge menu separator for contextual menus and menubar.",
    className: "-mx-1 my-1 h-px bg-border-default",
  },
  itemIndicator: {
    owner: "icon",
    kind: "layout",
    scope: "component-family",
    description:
      "Shared absolute leading indicator slot for menu checkbox and radio items.",
    className:
      "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center",
  },
  itemIndicatorMuted: {
    owner: "icon",
    kind: "composition",
    scope: "component-family",
    description: "Muted indicator slot tone for dropdown items.",
    className: "text-text-secondary",
  },
  overlayScrollButton: {
    owner: "primitive",
    kind: "composition",
    scope: "component-family",
    description: "Shared scroll affordance for select overlay edge buttons.",
    className:
      "flex cursor-default items-center justify-center py-1 text-text-secondary",
  },
  overlayPadding: {
    owner: "spacing",
    kind: "layout",
    scope: "component-family",
    description: "Default inner padding for rich popover overlays.",
    className: "p-3",
  },
  menuPadding: {
    owner: "spacing",
    kind: "layout",
    scope: "component-family",
    description: "Default inner padding for menu and select overlays.",
    className: "p-1.5",
  },
  panelPadding: {
    owner: "spacing",
    kind: "layout",
    scope: "component-family",
    description: "Panel padding from globals.css card token.",
    className: "p-[var(--card-padding)]",
  },
  modalPadding: {
    owner: "spacing",
    kind: "layout",
    scope: "component-family",
    description: "Default modal padding.",
    className: "p-5",
  },
  fieldGap: {
    owner: "spacing",
    kind: "layout",
    scope: "global",
    description: "Default vertical field spacing.",
    className: "gap-1.5",
  },
  sectionGap: {
    owner: "spacing",
    kind: "layout",
    scope: "component-family",
    description: "Default panel, modal, and card internal section gap.",
    className: "gap-4",
  },
} as const satisfies AfendaRecipeContract;

type AfendaRecipeKey = keyof typeof afendaRecipe;

function recipe(...keys: AfendaRecipeKey[]) {
  return keys.map((key) => afendaRecipe[key].className).join(" ");
}

export { afendaRecipe, recipe };
export type { AfendaRecipeContract, AfendaRecipeEntry, AfendaRecipeKey };
