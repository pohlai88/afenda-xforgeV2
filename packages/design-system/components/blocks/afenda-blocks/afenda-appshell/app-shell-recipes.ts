const APP_SHELL_TOPBAR_HEIGHT = "var(--xforge-layout-app-topbar,calc(var(--spacing)*12))";

const APP_SHELL_SIDEBAR_WIDTH = "var(--xforge-layout-sidebar,calc(var(--spacing)*16))";

const APP_SHELL_RAIL_WIDTH = "var(--xforge-layout-rail,calc(var(--spacing)*14))";

const APP_SHELL_FOOTER_HEIGHT = "var(--xforge-layout-app-footer,calc(var(--spacing)*6))";

const appShellChromeSurfaceClass = "bg-background text-foreground";

const appShellBentoGridClass =
  "grid h-svh max-h-svh w-full min-w-0 overflow-hidden bg-surface-muted/30 [grid-template-areas:'topbar_topbar'_'sidebar_content'_'footer_footer'] [grid-template-columns:var(--app-shell-sidebar-width)_minmax(0,1fr)] [grid-template-rows:var(--app-shell-topbar-height)_minmax(0,1fr)_var(--app-shell-footer-height)]";

const appShellContentInsetClass =
  "box-border flex min-h-0 min-w-0 flex-col overflow-hidden p-2 [grid-area:content]";

const appShellRegionLabelClass =
  "text-[length:var(--xforge-font-caption-size)] font-medium uppercase tracking-wide text-text-secondary";

export {
  APP_SHELL_FOOTER_HEIGHT,
  APP_SHELL_RAIL_WIDTH,
  APP_SHELL_SIDEBAR_WIDTH,
  APP_SHELL_TOPBAR_HEIGHT,
  appShellBentoGridClass,
  appShellChromeSurfaceClass,
  appShellContentInsetClass,
  appShellRegionLabelClass,
};
