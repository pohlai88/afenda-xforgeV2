/**
 * Collapsed sidebar (collapsible=icon) recipes.
 * Single rhythm: 8px item/section gaps · 12px horizontal inset · 12px top/bottom edge.
 */

const sidebarIconRailItemGapClass = "group-data-[collapsible=icon]:gap-2";
const sidebarIconRailSectionGapClass = "group-data-[collapsible=icon]:gap-2";

/** Hide expanded-only chrome (labels, badges, kbd) in icon rail. */
const sidebarIconRailHiddenClass = "group-data-[collapsible=icon]:hidden";
const sidebarIconRailInsetXClass = "group-data-[collapsible=icon]:px-3";

const sidebarIconRailMenuButtonClass = [
  "group-data-[collapsible=icon]:relative group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-auto! group-data-[collapsible=icon]:h-11 group-data-[collapsible=icon]:w-full! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:rounded-none group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:shadow-none group-data-[collapsible=icon]:ring-0 group-data-[collapsible=icon]:outline-none",
  "group-data-[collapsible=icon]:text-sidebar-foreground/58 group-data-[collapsible=icon]:hover:bg-transparent group-data-[collapsible=icon]:hover:text-sidebar-foreground/88 group-data-[collapsible=icon]:active:bg-transparent",
  "group-data-[collapsible=icon]:data-[active=true]:bg-transparent group-data-[collapsible=icon]:data-[active=true]:text-brand-primary group-data-[collapsible=icon]:data-[active=true]:shadow-none group-data-[collapsible=icon]:data-[active=true]:after:content-none group-data-[collapsible=icon]:data-[active=true]:before:content-none",
  "group-data-[collapsible=icon]:focus-visible:ring-0 group-data-[collapsible=icon]:focus-visible:outline-2 group-data-[collapsible=icon]:focus-visible:outline-offset-4 group-data-[collapsible=icon]:focus-visible:outline-brand-primary/35",
  "group-data-[collapsible=icon]:[&_svg]:opacity-90 group-data-[collapsible=icon]:hover:[&_svg]:opacity-100 group-data-[collapsible=icon]:data-[active=true]:[&_svg]:opacity-100 group-data-[collapsible=icon]:data-[active=true]:[&_svg]:text-brand-primary",
].join(" ");

const sidebarIconRailMenuClass = [
  sidebarIconRailItemGapClass,
  "group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:px-0",
].join(" ");

const sidebarIconRailShellClass = sidebarIconRailSectionGapClass;

const sidebarIconRailHeaderClass = [
  "group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:pb-0",
  sidebarIconRailInsetXClass,
  "group-data-[collapsible=icon]:pt-3",
].join(" ");

const sidebarIconRailNavClass = [
  sidebarIconRailInsetXClass,
  sidebarIconRailItemGapClass,
  "group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:py-0",
].join(" ");

const sidebarIconRailNavGroupClass =
  "group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:p-0";

const sidebarIconRailFooterClass = [
  "group-data-[collapsible=icon]:border-border-default/40 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:pt-0",
  sidebarIconRailInsetXClass,
  "group-data-[collapsible=icon]:pb-3",
].join(" ");

const sidebarIconRailFooterRowClass = [
  "group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-0",
  sidebarIconRailItemGapClass,
].join(" ");

const sidebarIconRailControlTriggerClass = [
  "size-9 shrink-0 rounded-none border-0 bg-transparent text-sidebar-foreground/58 shadow-none ring-0 outline-none",
  "hover:bg-transparent hover:text-sidebar-foreground/88",
  "focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary/35",
  "group-data-[collapsible=icon]:mx-auto",
].join(" ");

const sidebarIconRailIconClass =
  "size-[18px] shrink-0 stroke-[1.65] transition-[color,opacity] duration-150 ease-out";

const sidebarIconRailAvatarClass =
  "size-7 shrink-0 ring-0 group-data-[collapsible=icon]:size-7";

const sidebarIconRailInnerClass = "group-data-[collapsible=icon]:bg-sidebar";

const sidebarIconRailGroupLabelClass =
  "group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:m-0 group-data-[collapsible=icon]:h-0 group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:p-0";

/** Matches `--sidebar-width-icon` in `sidebar.tsx`. */
const sidebarIconRailWidth = "3.5rem";

export {
  sidebarIconRailAvatarClass,
  sidebarIconRailControlTriggerClass,
  sidebarIconRailFooterClass,
  sidebarIconRailFooterRowClass,
  sidebarIconRailGroupLabelClass,
  sidebarIconRailHeaderClass,
  sidebarIconRailHiddenClass,
  sidebarIconRailIconClass,
  sidebarIconRailInnerClass,
  sidebarIconRailMenuButtonClass,
  sidebarIconRailMenuClass,
  sidebarIconRailNavClass,
  sidebarIconRailNavGroupClass,
  sidebarIconRailShellClass,
  sidebarIconRailWidth,
};
