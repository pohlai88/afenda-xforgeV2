import {
  sidebarIconRailAvatarClass,
  sidebarIconRailBlockItemClass,
  sidebarIconRailFooterClass,
  sidebarIconRailFooterMenuClass,
  sidebarIconRailHiddenClass,
  sidebarIconRailIconClass,
  sidebarIconRailNavClass,
  sidebarIconRailScrollAreaClass,
  sidebarIconRailShellClass,
} from "@repo/design-system/components/afenda-ui/sidebar-rail-recipes";
import { blockRecipe } from "@repo/design-system/components/blocks/block-recipes";

const operatorAppSidebarShellClass = [
  blockRecipe("blockShell"),
  "flex h-full min-h-0 flex-col overscroll-y-contain",
  sidebarIconRailShellClass,
].join(" ");

const sidebarNavPanelEmptyClass = [
  "grid min-h-24 place-items-center rounded-md border border-dashed border-border-default/80 bg-transparent px-3 text-center",
  blockRecipe("blockMetricLabel"),
].join(" ");

const sidebarQuickActionsHeaderClass = "border-0";

const sidebarNavPanelNavClass = [
  blockRecipe("blockStack"),
  "min-w-0 max-w-full px-2.5 py-3",
  sidebarIconRailNavClass,
].join(" ");

const sidebarNavGroupShellClass = "min-w-0 gap-1 p-0";

const sidebarCardSectionShellClass = "min-w-0 gap-1 p-0";

const sidebarCardSectionExpandedClass = [
  sidebarIconRailHiddenClass,
  "rounded-[var(--xforge-radius-lg)] border border-border-default/70 bg-surface-raised/85 p-1.5 shadow-xs",
].join(" ");

const sidebarCardSectionHeaderClass =
  "flex min-h-8 min-w-0 items-center gap-2 rounded-[var(--xforge-radius-md)] px-2 py-1.5";

const sidebarCardSectionTitleClass =
  "min-w-0 flex-1 truncate font-medium text-[12px] text-sidebar-foreground leading-4";

const sidebarCardSectionActionClass =
  "inline-flex size-6 shrink-0 items-center justify-center rounded-[var(--xforge-radius-sm)] text-text-secondary transition-colors duration-100 hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30";

const sidebarCardSectionItemClass =
  "block min-w-0 rounded-[var(--xforge-radius-md)] border border-border-default/65 bg-background/70 px-2.5 py-2 text-left transition-colors duration-100 hover:border-border-default hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30";

const sidebarCardSectionItemIdleClass = "text-sidebar-foreground/88";

const sidebarCardSectionItemSelectedClass =
  "border-brand-primary/25 bg-brand-primary/10 text-brand-primary";

const sidebarCardSectionRailMenuClass =
  "hidden group-data-[collapsible=icon]:flex";

const sidebarQuickActionClass = [
  "flex h-8 min-w-0 items-center gap-2 rounded-md px-2 text-[length:var(--xforge-font-caption-size)] text-sidebar-foreground/88 leading-[var(--xforge-font-caption-line-height)] hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
  sidebarIconRailBlockItemClass,
].join(" ");

const sidebarQuickActionKbdClass =
  "h-4 shrink-0 border-border-default bg-sidebar-border/35 px-1 font-mono text-[9px] text-text-secondary tabular-nums leading-none shadow-none";

const sidebarGroupLabelClass = "px-2 tracking-[0.04em]";

const sidebarNavItemBaseClass =
  "group flex h-8 min-w-0 items-center gap-2 rounded-md px-2 text-[12px] leading-4 transition-colors duration-80";

const sidebarNavItemIdleClass = [
  "text-sidebar-foreground/88 hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
  sidebarIconRailBlockItemClass,
].join(" ");

const sidebarNavItemSelectedClass = [
  "relative bg-brand-primary/10 font-medium text-brand-primary before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:bg-brand-primary",
  "group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:font-normal group-data-[collapsible=icon]:text-brand-primary group-data-[collapsible=icon]:before:content-none",
  sidebarIconRailBlockItemClass,
].join(" ");

const sidebarLabelRowClass =
  "flex h-8 min-w-0 items-center gap-2 rounded-md px-2 text-[12px] text-sidebar-foreground/88 leading-4";

const sidebarFooterClass = [
  "mt-auto shrink-0 border-border-default/60 border-t bg-surface-raised/95 p-0 backdrop-blur-[2px]",
  sidebarIconRailFooterClass,
].join(" ");

const sidebarFooterMenuClass = [
  "min-w-0 max-w-full",
  sidebarIconRailFooterMenuClass,
].join(" ");

const sidebarFooterButtonClass = [
  "h-auto gap-2.5 rounded-md px-2 py-2 hover:bg-sidebar-accent/80 data-[active=true]:bg-sidebar-accent data-[state=open]:bg-sidebar-accent",
  "group-data-[collapsible=icon]:gap-0",
  sidebarIconRailBlockItemClass,
].join(" ");

const sidebarAvatarFallbackClass =
  "rounded-lg bg-sidebar-accent font-medium text-[10px] text-sidebar-foreground group-data-[collapsible=icon]:rounded-none group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:text-[11px] group-data-[collapsible=icon]:text-sidebar-foreground/88";

function sidebarProfileInitials(label: string): string {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export {
  operatorAppSidebarShellClass,
  sidebarAvatarFallbackClass,
  sidebarCardSectionActionClass,
  sidebarCardSectionExpandedClass,
  sidebarCardSectionHeaderClass,
  sidebarCardSectionItemClass,
  sidebarCardSectionItemIdleClass,
  sidebarCardSectionItemSelectedClass,
  sidebarCardSectionRailMenuClass,
  sidebarCardSectionShellClass,
  sidebarCardSectionTitleClass,
  sidebarFooterButtonClass,
  sidebarFooterClass,
  sidebarFooterMenuClass,
  sidebarGroupLabelClass,
  sidebarIconRailAvatarClass,
  sidebarIconRailHiddenClass,
  sidebarIconRailIconClass,
  sidebarIconRailScrollAreaClass,
  sidebarIconRailShellClass,
  sidebarLabelRowClass,
  sidebarNavGroupShellClass,
  sidebarNavPanelEmptyClass,
  sidebarNavItemBaseClass,
  sidebarNavItemIdleClass,
  sidebarNavItemSelectedClass,
  sidebarNavPanelNavClass,
  sidebarProfileInitials,
  sidebarQuickActionClass,
  sidebarQuickActionKbdClass,
  sidebarQuickActionsHeaderClass,
};
