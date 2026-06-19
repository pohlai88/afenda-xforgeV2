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
    className:
      "text-[length:var(--title-text-size)] font-semibold leading-5 text-text-primary",
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
      "text-[length:var(--xforge-font-label-size)] font-medium uppercase tracking-[var(--xforge-font-metadata-tracking)] text-text-secondary",
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
  visuallyHidden: {
    owner: "primitive",
    kind: "composition",
    scope: "global",
    description: "Screen-reader-only text for accessible icon affordances.",
    className: "sr-only",
  },
  accordionTriggerLabel: {
    owner: "typography",
    kind: "composition",
    scope: "component-family",
    description: "Balanced wrapping for accordion trigger label text.",
    className: "text-balance",
  },
  focusRing: {
    owner: "state",
    kind: "interaction",
    scope: "global",
    description: "Shared focus ring for controls with a visible border.",
    className:
      "focus-visible:outline-none focus-visible:border-border-active focus-visible:ring-2 focus-visible:ring-ring/30",
  },
  focusRingOnly: {
    owner: "state",
    kind: "interaction",
    scope: "global",
    description: "Shared focus ring for borderless icon controls.",
    className:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
  },
  invalidState: {
    owner: "state",
    kind: "interaction",
    scope: "global",
    description: "Shared invalid state for field primitives.",
    className:
      "aria-invalid:border-critical aria-invalid:ring-critical/20 dark:aria-invalid:ring-critical/40",
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
    className: "rounded-md border border-border-default bg-surface-raised",
  },
  flatControlSurface: {
    owner: "surface",
    kind: "composition",
    scope: "global",
    description: "Flat bordered control surface for ERP form controls.",
    className:
      "rounded-md border border-border-default bg-surface-raised shadow-none",
  },
  overlaySurface: {
    owner: "surface",
    kind: "composition",
    scope: "component-family",
    description: "Floating overlay surface used by popover, select, and menus.",
    className:
      "rounded-lg border border-border-default bg-surface-overlay text-text-primary shadow-popover",
  },
  panelSurface: {
    owner: "surface",
    kind: "composition",
    scope: "component-family",
    description: "Panel surface for cards and table containers.",
    className:
      "rounded-lg border border-border-default bg-surface-raised text-text-primary shadow-panel",
  },
  modalSurface: {
    owner: "surface",
    kind: "composition",
    scope: "component-family",
    description: "Modal surface used by dialog and alert dialog content.",
    className:
      "rounded-2xl border border-border-default bg-surface-overlay text-text-primary shadow-overlay",
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
      "group relative flex min-h-8 cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-[length:var(--xforge-font-body-size)] font-normal leading-none text-text-primary outline-none transition-colors",
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
  rowCritical: {
    owner: "row",
    kind: "interaction",
    scope: "global",
    description: "Critical row tone for mutating or removing data.",
    className:
      "data-[variant=critical]:text-critical data-[variant=critical]:focus:bg-critical-muted/25 data-[variant=critical]:data-[highlighted]:bg-critical-muted/25 data-[variant=critical]:focus:text-critical data-[variant=critical]:data-[highlighted]:text-critical",
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
  rowCriticalIcon: {
    owner: "icon",
    kind: "interaction",
    scope: "global",
    description: "Icon tone inheritance for critical rows.",
    className:
      "data-[variant=critical]:[&_svg:not([class*='text-'])]:text-critical",
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
  accordionTriggerIcon: {
    owner: "icon",
    kind: "motion",
    scope: "component-family",
    description:
      "Accordion disclosure icon sizing, muted tone, and rotation motion.",
    className:
      "pointer-events-none size-4 shrink-0 text-text-secondary transition-transform duration-200 motion-reduce:transition-none",
  },
  breadcrumbEllipsisIcon: {
    owner: "icon",
    kind: "layout",
    scope: "component-family",
    description: "Compact icon sizing for breadcrumb overflow affordance.",
    className: "size-3.5",
  },
  calendarWeekNumberCell: {
    owner: "primitive",
    kind: "layout",
    scope: "component-family",
    description: "Calendar week-number cell sizing and centered alignment.",
    className:
      "flex size-[var(--calendar-cell-size)] items-center justify-center text-center",
  },
  chartTooltipItems: {
    owner: "spacing",
    kind: "layout",
    scope: "component-family",
    description: "Compact stacked spacing for chart tooltip rows.",
    className: "grid gap-1.5",
  },
  chartTooltipIndicator: {
    owner: "icon",
    kind: "composition",
    scope: "component-family",
    description: "Base chart tooltip indicator geometry and color binding.",
    className: "shrink-0 rounded-sm border-(--color-border) bg-(--color-bg)",
  },
  chartTooltipIndicatorDot: {
    owner: "icon",
    kind: "layout",
    scope: "component-family",
    description: "Dot indicator size for chart tooltips.",
    className: "size-2.5",
  },
  chartTooltipIndicatorLine: {
    owner: "icon",
    kind: "layout",
    scope: "component-family",
    description: "Line indicator width for chart tooltips.",
    className: "w-1",
  },
  chartTooltipIndicatorDashed: {
    owner: "icon",
    kind: "composition",
    scope: "component-family",
    description: "Dashed indicator treatment for chart tooltips.",
    className:
      "w-0 border-[var(--chart-indicator-border-width)] border-dashed bg-transparent",
  },
  chartTooltipIndicatorNested: {
    owner: "spacing",
    kind: "layout",
    scope: "component-family",
    description: "Nested chart tooltip indicator vertical offset.",
    className: "my-0.5",
  },
  chartTooltipName: {
    owner: "typography",
    kind: "composition",
    scope: "component-family",
    description: "Secondary label text inside chart tooltip rows.",
    className: "text-text-secondary",
  },
  chartTooltipValue: {
    owner: "typography",
    kind: "composition",
    scope: "component-family",
    description: "Tabular value text inside chart tooltip rows.",
    className: "font-medium font-mono text-text-primary tabular-nums",
  },
  chartLegendItem: {
    owner: "icon",
    kind: "composition",
    scope: "component-family",
    description: "Legend item alignment, spacing, and icon treatment.",
    className:
      "flex items-center gap-1.5 [&>svg]:size-3 [&>svg]:text-text-secondary",
  },
  chartLegendSwatch: {
    owner: "icon",
    kind: "composition",
    scope: "component-family",
    description: "Chart legend color swatch geometry.",
    className: "size-2 shrink-0 rounded-sm",
  },
  checkboxIndicator: {
    owner: "icon",
    kind: "composition",
    scope: "component-family",
    description: "Checkbox indicator alignment and inherited icon color.",
    className: "grid place-content-center text-current transition-none",
  },
  checkboxCheckIcon: {
    owner: "icon",
    kind: "composition",
    scope: "component-family",
    description: "Checkbox checked-state icon visibility.",
    className: "size-3.5 [[data-state=indeterminate]_&]:hidden",
  },
  checkboxIndeterminateIcon: {
    owner: "icon",
    kind: "composition",
    scope: "component-family",
    description: "Checkbox indeterminate-state icon visibility.",
    className: "hidden size-3.5 [[data-state=indeterminate]_&]:block",
  },
  commandInputWrapper: {
    owner: "spacing",
    kind: "composition",
    scope: "component-family",
    description: "Command input row layout, padding, and divider.",
    className:
      "flex h-12 items-center gap-2 border-border-default border-b px-[var(--button-padding-x)]",
  },
  commandInputIcon: {
    owner: "icon",
    kind: "composition",
    scope: "component-family",
    description: "Command input search icon sizing and muted tone.",
    className: "size-4 shrink-0 text-text-secondary",
  },
  commandGroup: {
    owner: "typography",
    kind: "composition",
    scope: "component-family",
    description: "Command group container and heading typography.",
    className:
      "overflow-hidden py-1 text-text-primary [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[length:var(--xforge-font-label-size)] [&_[cmdk-group-heading]]:text-text-secondary [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[var(--xforge-font-metadata-tracking)]",
  },
  fieldSeparatorContent: {
    owner: "spacing",
    kind: "composition",
    scope: "component-family",
    description: "Field separator label chip surface and spacing.",
    className:
      "relative mx-auto block w-fit bg-surface px-2 text-text-secondary",
  },
  fieldErrorList: {
    owner: "spacing",
    kind: "composition",
    scope: "component-family",
    description: "Field error list indentation, marker, and rhythm.",
    className: "ml-4 flex list-disc flex-col gap-1",
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
      "absolute top-4 right-4 inline-flex size-7 items-center justify-center rounded-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary disabled:pointer-events-none",
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
  itemIndicatorCheckIcon: {
    owner: "icon",
    kind: "layout",
    scope: "component-family",
    description: "Checkbox item indicator icon sizing.",
    className: "size-4",
  },
  itemIndicatorRadioIcon: {
    owner: "icon",
    kind: "composition",
    scope: "component-family",
    description: "Radio item indicator icon sizing and fill inheritance.",
    className: "size-2 fill-current",
  },
  submenuChevronIcon: {
    owner: "icon",
    kind: "composition",
    scope: "component-family",
    description: "Trailing submenu chevron sizing and muted tone.",
    className: "size-4 text-text-secondary",
  },
  navigationMenuTriggerIcon: {
    owner: "icon",
    kind: "motion",
    scope: "component-family",
    description: "Navigation menu trigger chevron sizing and open rotation.",
    className:
      "size-3 transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none",
  },
  navigationMenuViewportWrapper: {
    owner: "overlay",
    kind: "layout",
    scope: "component-family",
    description: "Navigation menu viewport wrapper stacking isolation.",
    className:
      "absolute top-full left-0 isolate z-[var(--xforge-z-dropdown)] flex justify-center",
  },
  navigationMenuIndicatorArrow: {
    owner: "overlay",
    kind: "composition",
    scope: "component-family",
    description: "Navigation menu indicator arrow surface.",
    className:
      "relative top-1/2 size-2 rotate-45 rounded-tl-sm border-border-default border-t border-l bg-surface-overlay shadow-popover",
  },
  paginationIcon: {
    owner: "icon",
    kind: "layout",
    scope: "component-family",
    description: "Pagination navigation and overflow icon sizing.",
    className: "size-4",
  },
  radioGroupIndicator: {
    owner: "icon",
    kind: "layout",
    scope: "component-family",
    description: "Radio item indicator alignment and sizing.",
    className: "relative flex size-full items-center justify-center",
  },
  radioGroupIndicatorIcon: {
    owner: "icon",
    kind: "composition",
    scope: "component-family",
    description: "Radio item selected dot sizing and inherited fill.",
    className: "size-2 fill-current text-current",
  },
  resizableHandleIcon: {
    owner: "icon",
    kind: "layout",
    scope: "component-family",
    description: "Resizable handle grip icon sizing.",
    className: "size-3",
  },
  scrollAreaCorner: {
    owner: "surface",
    kind: "composition",
    scope: "component-family",
    description: "Transparent scroll area corner surface.",
    className: "bg-transparent",
  },
  scrollAreaThumb: {
    owner: "surface",
    kind: "interaction",
    scope: "component-family",
    description: "Scroll area thumb radius and hover surface.",
    className:
      "relative flex-1 rounded-full bg-border-default hover:bg-border-hover",
  },
  selectIcon: {
    owner: "icon",
    kind: "layout",
    scope: "component-family",
    description: "Select trigger and scroll button icon sizing.",
    className: "size-4",
  },
  selectItemIndicator: {
    owner: "icon",
    kind: "layout",
    scope: "component-family",
    description: "Select item checked indicator slot.",
    className: "absolute right-2 flex size-3.5 items-center justify-center",
  },
  sliderTrack: {
    owner: "surface",
    kind: "composition",
    scope: "component-family",
    description: "Slider track fill surface and flexible layout behavior.",
    className: "grow rounded-full bg-surface-muted",
  },
  sliderRange: {
    owner: "surface",
    kind: "composition",
    scope: "component-family",
    description: "Slider selected range surface.",
    className: "bg-brand-primary",
  },
  sliderThumb: {
    owner: "icon",
    kind: "composition",
    scope: "component-family",
    description: "Slider thumb geometry and surface treatment.",
    className:
      "size-4 shrink-0 rounded-full border border-brand-primary bg-surface-raised",
  },
  tooltipArrow: {
    owner: "overlay",
    kind: "composition",
    scope: "component-family",
    description: "Tooltip arrow geometry and inverse fill.",
    className: "size-2.5 fill-surface-inverse",
  },
  toasterRoot: {
    owner: "overlay",
    kind: "composition",
    scope: "component-family",
    description: "Sonner toaster root selectors used by toast class mappings.",
    className: "toaster group",
  },
  toastSuccessIcon: {
    owner: "icon",
    kind: "composition",
    scope: "component-family",
    description: "Success toast status icon.",
    className: "size-4 text-success",
  },
  toastInfoIcon: {
    owner: "icon",
    kind: "composition",
    scope: "component-family",
    description: "Info toast status icon.",
    className: "size-4 text-info",
  },
  toastWarningIcon: {
    owner: "icon",
    kind: "composition",
    scope: "component-family",
    description: "Warning toast status icon.",
    className: "size-4 text-warning",
  },
  toastCriticalIcon: {
    owner: "icon",
    kind: "composition",
    scope: "component-family",
    description: "Critical toast status icon.",
    className: "size-4 text-critical",
  },
  toastLoadingIcon: {
    owner: "icon",
    kind: "motion",
    scope: "component-family",
    description: "Loading toast spinner icon.",
    className:
      "size-4 animate-spin text-text-secondary motion-reduce:transition-none",
  },
  sidebarTooltipLabel: {
    owner: "typography",
    kind: "composition",
    scope: "component-family",
    description: "Collapsed sidebar tooltip label text.",
    className:
      "font-medium text-[length:var(--xforge-font-label-size)] leading-4",
  },
  sidebarTooltipDescription: {
    owner: "typography",
    kind: "composition",
    scope: "component-family",
    description: "Collapsed sidebar tooltip description text.",
    className:
      "text-[length:var(--sidebar-tooltip-description-size)] leading-snug text-text-inverse/75",
  },
  sidebarTooltipShortcut: {
    owner: "typography",
    kind: "composition",
    scope: "component-family",
    description: "Collapsed sidebar tooltip shortcut chip.",
    className:
      "border-border-subtle/40 bg-surface-inverse/20 font-mono text-[length:var(--sidebar-tooltip-shortcut-size)] text-text-inverse/90 tabular-nums",
  },
  sidebarMobileSheetContent: {
    owner: "spacing",
    kind: "layout",
    scope: "component-family",
    description: "Mobile sidebar sheet content reset.",
    className: "p-0 [&>button]:hidden",
  },
  sidebarRootPeer: {
    owner: "primitive",
    kind: "composition",
    scope: "component-family",
    description: "Sidebar root peer hooks and text color.",
    className: "group peer text-text-primary",
  },
  sidebarControlIcon: {
    owner: "icon",
    kind: "layout",
    scope: "component-family",
    description: "Sidebar control trigger icon geometry.",
    className: "size-4 shrink-0",
  },
  sidebarControlMenuLabel: {
    owner: "typography",
    kind: "composition",
    scope: "component-family",
    description: "Sidebar behavior menu label text.",
    className:
      "px-2 py-1.5 font-normal text-[length:var(--xforge-font-label-size)] text-text-tertiary",
  },
  sidebarControlMenuItem: {
    owner: "typography",
    kind: "composition",
    scope: "component-family",
    description: "Sidebar behavior menu item row text.",
    className: "gap-2 text-[length:var(--xforge-font-caption-size)]",
  },
  sidebarMenuButtonSmallText: {
    owner: "typography",
    kind: "composition",
    scope: "component-family",
    description: "Small sidebar menu button text.",
    className: "text-[length:var(--xforge-font-caption-size)]",
  },
  sidebarTooltipContent: {
    owner: "spacing",
    kind: "layout",
    scope: "component-family",
    description: "Collapsed sidebar tooltip content rhythm.",
    className: "gap-1 px-2 py-1.5",
  },
  sidebarMenuSkeletonIcon: {
    owner: "icon",
    kind: "layout",
    scope: "component-family",
    description: "Sidebar loading skeleton icon geometry.",
    className: "size-4 rounded-sm",
  },
  sidebarMenuSubButtonSmallText: {
    owner: "typography",
    kind: "composition",
    scope: "component-family",
    description: "Small sidebar submenu button text.",
    className: "text-[length:var(--xforge-font-caption-size)]",
  },
  sidebarMenuSubButtonDefaultText: {
    owner: "typography",
    kind: "composition",
    scope: "component-family",
    description: "Default sidebar submenu button text.",
    className: "text-[length:var(--xforge-font-body-size)]",
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
    className: "p-4",
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

const recipe = (...keys: AfendaRecipeKey[]) => {
  return keys.map((key) => afendaRecipe[key].className).join(" ");
};

export { afendaRecipe, recipe };
export type { AfendaRecipeContract, AfendaRecipeEntry, AfendaRecipeKey };
