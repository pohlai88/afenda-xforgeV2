import { sidebarIconRailBlockItemClass } from "@repo/design-system/components/afenda-ui/sidebar-rail-recipes";
import { blockRecipe } from "@repo/design-system/components/blocks/block-recipes";

const navMainGroupContentClass = [
  blockRecipe("blockStack"),
  "flex flex-col gap-2",
].join(" ");

const navMainQuickCreateClass = [
  "min-w-8 bg-brand-primary text-primary-foreground duration-200 ease-linear",
  "hover:bg-brand-dark hover:text-primary-foreground focus-visible:bg-brand-dark focus-visible:text-primary-foreground",
  "active:bg-brand-dark/90 active:text-primary-foreground",
  sidebarIconRailBlockItemClass,
].join(" ");

const navMainActionRowClass = "flex items-center gap-2";

const navMainInboxButtonClass =
  "size-8 group-data-[collapsible=icon]:opacity-0";

const navMainItemButtonClass = [
  "h-8 min-w-0 gap-2 rounded-md px-2 text-[12px] text-sidebar-foreground/88 leading-4",
  "hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:bg-sidebar-accent focus-visible:text-sidebar-foreground",
  sidebarIconRailBlockItemClass,
].join(" ");

const navStartedGroupClass = "group-data-[collapsible=icon]:hidden";

const navStartedChevronClass =
  "ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90";

const navStartedSubButtonClass =
  "text-sidebar-foreground/80 hover:text-sidebar-foreground focus-visible:text-sidebar-foreground";

const navDocumentsGroupClass = "group-data-[collapsible=icon]:hidden";

const navDocumentsMenuActionClass =
  "rounded-sm data-[state=open]:bg-sidebar-accent";

const navDocumentsDropdownContentClass = "min-w-24 rounded-lg";

const navDocumentsDropdownMenuItemClass = "gap-2 text-[12px]";

const navDocumentsMoreButtonClass = "text-sidebar-foreground/70";

export {
  navStartedChevronClass,
  navStartedGroupClass,
  navStartedSubButtonClass,
  navDocumentsDropdownContentClass,
  navDocumentsDropdownMenuItemClass,
  navDocumentsGroupClass,
  navDocumentsMenuActionClass,
  navDocumentsMoreButtonClass,
  navMainActionRowClass,
  navMainGroupContentClass,
  navMainInboxButtonClass,
  navMainItemButtonClass,
  navMainQuickCreateClass,
};
