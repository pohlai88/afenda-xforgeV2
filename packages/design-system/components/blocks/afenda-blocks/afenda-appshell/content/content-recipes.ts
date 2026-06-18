const appContentPanelClass =
  "grid min-h-0 min-w-0 flex-1 overflow-hidden rounded-xl border border-border-default bg-background shadow-none";

const appContentBentoGridClass =
  "[grid-template-areas:'header_header_header'_'left-rail_main_right-rail'] [grid-template-columns:var(--app-shell-rail-width)_minmax(0,1fr)_var(--app-shell-rail-width)] [grid-template-rows:auto_minmax(0,1fr)]";

const appContentHeaderShellClass =
  "flex min-h-0 items-center [grid-area:header] border-b border-border-default px-4 py-3";

const appContentLeftRailShellClass =
  "flex min-h-0 flex-col [grid-area:left-rail] border-r border-border-default p-3";

const appContentRightRailShellClass =
  "flex min-h-0 flex-col [grid-area:right-rail] border-l border-border-default p-3";

const appContentMainShellClass =
  "min-h-0 min-w-0 overflow-auto [grid-area:main] p-4";

export {
  appContentBentoGridClass,
  appContentHeaderShellClass,
  appContentLeftRailShellClass,
  appContentMainShellClass,
  appContentPanelClass,
  appContentRightRailShellClass,
};
