import { blockRecipe } from "@repo/design-system/components/blocks/block-recipes";

const contentLayoutBlockShellClass = [
  blockRecipe("blockShell"),
  blockRecipe("blockPanel"),
  "absolute flex min-h-0 flex-col overflow-hidden",
].join(" ");

const contentLayoutTopbarClass =
  "flex h-[var(--content-layout-topbar-height)] shrink-0 items-center gap-3 border-border-default border-b bg-surface-raised px-[var(--xforge-space-5)] antialiased";

const contentLayoutBodyClass = "grid min-h-0 flex-1 overflow-hidden";

const contentLayoutMainClass =
  "min-h-0 min-w-0 overflow-x-hidden overflow-y-auto outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/25";

const contentLayoutSidebarClass = [
  blockRecipe("blockRail"),
  "flex shrink-0 flex-col overflow-hidden transition-[width] duration-200 ease-linear motion-reduce:transition-none",
].join(" ");

const contentLayoutFooterClass =
  "flex w-full shrink-0 items-center justify-between gap-4 px-[var(--xforge-space-5)] py-2.5 text-[11px] text-text-secondary";

const contentLayoutStageFooterPlacementClass = [
  "absolute inset-x-[var(--xforge-layout-site-inset)] bottom-0",
  "h-[var(--content-layout-footer-height,3rem)]",
].join(" ");

const contentLayoutDrawerClass =
  "shrink-0 overflow-hidden border-border-default border-t bg-surface-muted/50 transition-[max-height] duration-200 ease-out motion-reduce:transition-none";

const contentLayoutResizeHandleClass =
  "absolute z-[var(--xforge-z-raised)] bg-transparent outline-none hover:bg-border-default/60 focus-visible:bg-ring/30";

export {
  contentLayoutBlockShellClass,
  contentLayoutBodyClass,
  contentLayoutDrawerClass,
  contentLayoutFooterClass,
  contentLayoutMainClass,
  contentLayoutResizeHandleClass,
  contentLayoutSidebarClass,
  contentLayoutStageFooterPlacementClass,
  contentLayoutTopbarClass,
};
