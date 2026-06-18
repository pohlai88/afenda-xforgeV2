const appContentShellClass = "h-full min-h-0 min-w-0 overflow-hidden";

const appContentBentoGridClass =
  "grid h-full min-h-0 min-w-0 [grid-template-areas:'header_header_header'_'left-rail_main_right-rail'] [grid-template-columns:var(--app-shell-rail-width)_minmax(0,1fr)_var(--app-shell-rail-width)] [grid-template-rows:auto_minmax(0,1fr)]";

const appContentHeaderShellClass =
  "flex min-h-0 items-center [grid-area:header] px-4 py-3";

const appContentLeftRailShellClass =
  "flex min-h-0 flex-col [grid-area:left-rail] bg-surface-muted/40 p-3";

const appContentRightRailShellClass =
  "flex min-h-0 flex-col [grid-area:right-rail] bg-surface-muted/40 p-3";

const appContentMainShellClass =
  "min-h-0 min-w-0 overflow-auto [grid-area:main] p-4";

export {
  appContentBentoGridClass,
  appContentHeaderShellClass,
  appContentLeftRailShellClass,
  appContentMainShellClass,
  appContentRightRailShellClass,
  appContentShellClass,
};
