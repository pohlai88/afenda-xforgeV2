const topbarShellClass =
  "flex h-full items-center justify-between gap-3 px-[var(--xforge-space-5)] text-sidebar-foreground antialiased";

const topbarScopeTriggerClass =
  "h-9 max-w-[9.5rem] gap-1.5 rounded-md bg-transparent px-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-sidebar-ring data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-foreground";

const topbarScopeCaptionClass =
  "truncate text-[9px] font-medium uppercase tracking-[0.08em] text-sidebar-foreground/55 leading-3";

const topbarScopeValueClass =
  "min-w-0 truncate font-medium text-[12px] leading-4";

const topbarIconActionClass =
  "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-sidebar-ring";

const topbarUtilitiesPinnedClass = "flex min-w-0 items-center gap-0.5";

const topbarUtilitiesFixedClusterClass =
  "flex shrink-0 items-center gap-0.5 border-border-subtle border-l pl-0.5 ms-0.5";

const topbarBrandDiskClass =
  "grid size-8 shrink-0 place-items-center rounded-full border border-border-subtle bg-sidebar-accent text-sidebar-foreground";

const topbarCommandSearchClass =
  "h-8 w-full min-w-36 max-w-52 border-border-subtle bg-sidebar-accent/35 pe-14 ps-8 text-[12px] text-sidebar-foreground shadow-none placeholder:text-sidebar-foreground/50 focus-visible:bg-sidebar-accent sm:min-w-44";

export {
  topbarBrandDiskClass,
  topbarCommandSearchClass,
  topbarIconActionClass,
  topbarScopeCaptionClass,
  topbarScopeTriggerClass,
  topbarScopeValueClass,
  topbarShellClass,
  topbarUtilitiesFixedClusterClass,
  topbarUtilitiesPinnedClass,
};
