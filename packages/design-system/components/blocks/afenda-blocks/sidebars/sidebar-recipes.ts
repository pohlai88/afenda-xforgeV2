import {
  sidebarIconRailAvatarClass,
  sidebarIconRailFooterClass,
  sidebarIconRailFooterRowClass,
  sidebarIconRailHeaderClass,
  sidebarIconRailHiddenClass,
  sidebarIconRailIconClass,
  sidebarIconRailNavClass,
  sidebarIconRailShellClass,
} from "../../../afenda-ui/sidebar-rail-recipes";

/** Expanded-mode shell; icon rail overrides come from `sidebar-rail-recipes`. */
const sidebarQuickActionsHeaderClass = [
  "border-0 p-2",
  sidebarIconRailHeaderClass,
].join(" ");

const sidebarNavPanelNavClass = [
  "grid min-w-0 gap-4 px-2.5 py-3",
  sidebarIconRailNavClass,
].join(" ");

const sidebarNavGroupShellClass = "min-w-0 gap-1 p-0";

const sidebarQuickActionClass =
  "flex h-8 min-w-0 items-center gap-2 rounded-md px-2 text-[length:var(--xforge-font-caption-size)] text-sidebar-foreground/88 leading-[var(--xforge-font-caption-line-height)] hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const sidebarQuickActionKbdClass =
  "h-4 shrink-0 border-border-default bg-sidebar-border/35 px-1 font-mono text-[9px] text-text-secondary tabular-nums leading-none shadow-none";

const sidebarGroupLabelClass = "px-2 tracking-[0.04em]";

const sidebarNavItemBaseClass =
  "group flex h-8 min-w-0 items-center gap-2 rounded-md px-2 text-[12px] leading-4 transition-colors duration-80";

const sidebarNavItemIdleClass =
  "text-sidebar-foreground/88 hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const sidebarNavItemSelectedClass =
  "relative bg-brand-primary/10 font-medium text-brand-primary before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:bg-brand-primary";

const sidebarLabelRowClass =
  "flex h-8 min-w-0 items-center gap-2 rounded-md px-2 text-[12px] text-sidebar-foreground/88 leading-4";

const sidebarFooterClass = [
  "mt-auto shrink-0 border-border-default/60 border-t bg-surface-raised/95 p-0 backdrop-blur-[2px]",
  sidebarIconRailFooterClass,
].join(" ");

const sidebarFooterRowClass = [
  "flex items-center gap-1 px-1",
  sidebarIconRailFooterRowClass,
].join(" ");

const sidebarFooterButtonClass =
  "h-auto gap-2.5 rounded-md px-2 py-2 hover:bg-sidebar-accent/80 data-[active=true]:bg-sidebar-accent";

function sidebarProfileInitials(label: string): string {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export {
  sidebarFooterButtonClass,
  sidebarFooterClass,
  sidebarFooterRowClass,
  sidebarGroupLabelClass,
  sidebarIconRailAvatarClass,
  sidebarIconRailHiddenClass,
  sidebarIconRailIconClass,
  sidebarIconRailShellClass,
  sidebarLabelRowClass,
  sidebarNavGroupShellClass,
  sidebarNavItemBaseClass,
  sidebarNavItemIdleClass,
  sidebarNavItemSelectedClass,
  sidebarNavPanelNavClass,
  sidebarProfileInitials,
  sidebarQuickActionClass,
  sidebarQuickActionKbdClass,
  sidebarQuickActionsHeaderClass,
};
