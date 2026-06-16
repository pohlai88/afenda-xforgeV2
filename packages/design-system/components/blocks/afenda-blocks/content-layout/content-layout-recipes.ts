const contentLayoutShellClass =
  "absolute flex min-h-0 flex-col overflow-hidden rounded-[var(--card-radius)] border border-border-default bg-surface-raised text-text-primary shadow-panel";

const contentLayoutTopbarClass =
  "flex h-[var(--content-layout-topbar-height)] shrink-0 items-center gap-3 border-border-default border-b bg-surface-raised px-[var(--xforge-space-5)] antialiased";

const contentLayoutBodyClass = "grid min-h-0 flex-1 overflow-hidden";

const contentLayoutMainClass =
  "min-h-0 min-w-0 overflow-x-hidden overflow-y-auto outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring";

const contentLayoutSidebarClass =
  "flex min-h-0 shrink-0 flex-col overflow-hidden border-border-subtle bg-surface-muted/40 transition-[width] duration-200 ease-linear motion-reduce:transition-none";

const contentLayoutFooterClass =
  "flex shrink-0 items-center justify-between gap-4 border-border-default border-t bg-surface-raised px-[var(--xforge-space-5)] py-2.5 text-[11px] text-text-secondary";

const contentLayoutDrawerClass =
  "shrink-0 overflow-hidden border-border-default border-t bg-surface-muted/50 transition-[max-height] duration-200 ease-out motion-reduce:transition-none";

const contentLayoutResizeHandleClass =
  "absolute z-[var(--xforge-z-raised)] bg-transparent outline-none hover:bg-border-default/60 focus-visible:bg-ring/30";

export {
  contentLayoutBodyClass,
  contentLayoutDrawerClass,
  contentLayoutFooterClass,
  contentLayoutMainClass,
  contentLayoutResizeHandleClass,
  contentLayoutShellClass,
  contentLayoutSidebarClass,
  contentLayoutTopbarClass,
};
