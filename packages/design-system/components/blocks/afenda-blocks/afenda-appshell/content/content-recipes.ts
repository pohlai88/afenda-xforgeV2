const APP_SHELL_CONTENT_HEADER_TRIGGER_SIZE = "2rem";

const appContentPanelClass =
  "grid min-h-0 min-w-0 flex-1 overflow-hidden rounded-xl border border-border-default bg-background shadow-none";

const appContentBentoGridClass =
  "[grid-template-areas:'header_header_header'_'left-rail_main_right-rail'] [grid-template-columns:var(--app-shell-content-left-rail-width)_minmax(0,1fr)_var(--app-shell-content-right-rail-width)] [grid-template-rows:auto_minmax(0,1fr)]";

const appContentBentoGridWithDrawerClass =
  "[grid-template-areas:'header_header_header'_'left-rail_main_right-rail'_'drawer_drawer_drawer'] [grid-template-columns:var(--app-shell-content-left-rail-width)_minmax(0,1fr)_var(--app-shell-content-right-rail-width)] [grid-template-rows:auto_minmax(0,1fr)_var(--app-shell-bottom-drawer-height)]";

const appContentHeaderShellClass =
  "flex h-11 min-h-11 shrink-0 items-center gap-2 border-b border-border-default bg-background px-3 [grid-area:header] sm:gap-3 sm:px-4";

const appContentHeaderActionsClass =
  "ml-auto flex shrink-0 items-center gap-0.5";

const appContentHeaderTriggerClass =
  "size-8 shrink-0 text-text-secondary hover:bg-surface-muted hover:text-text-primary data-[pressed=true]:bg-surface-muted data-[pressed=true]:text-text-primary";

const appContentHeaderBreadcrumbsClass = "min-w-0 flex-1 overflow-hidden";

const appContentLeftRailShellClass =
  "flex min-h-0 flex-col overflow-hidden [grid-area:left-rail] border-r border-border-default p-3 data-[open=false]:hidden";

const appContentRightRailShellClass =
  "flex min-h-0 flex-col overflow-hidden [grid-area:right-rail] border-l border-border-default p-3 data-[open=false]:hidden";

const appContentBottomDrawerShellClass =
  "flex min-h-0 flex-col overflow-auto [grid-area:drawer] border-t border-border-default bg-surface-muted/30 p-3";

const appContentMainShellClass =
  "min-h-0 min-w-0 overflow-auto [grid-area:main] p-4";

export {
  APP_SHELL_CONTENT_HEADER_TRIGGER_SIZE,
  appContentBentoGridClass,
  appContentBentoGridWithDrawerClass,
  appContentBottomDrawerShellClass,
  appContentHeaderActionsClass,
  appContentHeaderBreadcrumbsClass,
  appContentHeaderShellClass,
  appContentHeaderTriggerClass,
  appContentLeftRailShellClass,
  appContentMainShellClass,
  appContentPanelClass,
  appContentRightRailShellClass,
};
