import {
  sidebarIconRailAvatarClass,
  sidebarIconRailBlockItemClass,
  sidebarIconRailFooterClass,
  sidebarIconRailGroupLabelClass,
  sidebarIconRailHiddenClass,
  sidebarIconRailMenuButtonClass,
  sidebarIconRailNavGroupClass,
  sidebarIconRailScrollAreaClass,
  sidebarIconRailShellClass,
} from "../../../../afenda-ui/sidebar-rail-recipes";

/** 32px hit target — every rail control shares this frame. */
const appSidebarIconRailHitTargetClass = [
  "group-data-[collapsible=icon]:mx-auto",
  "group-data-[collapsible=icon]:size-8!",
  "group-data-[collapsible=icon]:h-8!",
  "group-data-[collapsible=icon]:min-h-8",
  "group-data-[collapsible=icon]:w-full!",
  "group-data-[collapsible=icon]:max-w-full",
  "group-data-[collapsible=icon]:justify-center",
  "group-data-[collapsible=icon]:gap-0",
  "group-data-[collapsible=icon]:p-0!",
].join(" ");

/** 16px glyph — SVG, PNG, and avatar visual weight inside the hit target. */
const appSidebarIconRailGlyphClass = [
  "group-data-[collapsible=icon]:[&_svg]:size-4!",
  "group-data-[collapsible=icon]:[&_svg]:max-h-4",
  "group-data-[collapsible=icon]:[&_svg]:max-w-4",
  "group-data-[collapsible=icon]:[&_svg]:shrink-0",
  "group-data-[collapsible=icon]:[&_img]:size-4!",
  "group-data-[collapsible=icon]:[&_img]:max-h-4",
  "group-data-[collapsible=icon]:[&_img]:max-w-4",
  "group-data-[collapsible=icon]:[&_img]:shrink-0",
  "group-data-[collapsible=icon]:[&_img]:rounded-sm",
  "group-data-[collapsible=icon]:[&_img]:object-cover",
].join(" ");

const appSidebarIconRailShellClass = [
  "group",
  sidebarIconRailShellClass,
  "data-[collapsible=icon]:items-stretch",
  "data-[collapsible=icon]:gap-1",
].join(" ");

const appSidebarIconRailNavGroupClass = [
  sidebarIconRailNavGroupClass,
  "group-data-[collapsible=icon]:gap-0",
].join(" ");

const appSidebarIconRailGroupLabelClass = sidebarIconRailGroupLabelClass;

const appSidebarIconRailItemLabelClass = sidebarIconRailHiddenClass;

const appSidebarIconRailNavItemClass = [
  sidebarIconRailBlockItemClass,
  sidebarIconRailMenuButtonClass,
  appSidebarIconRailHitTargetClass,
  appSidebarIconRailGlyphClass,
].join(" ");

const appSidebarIconRailScrollAreaClass = sidebarIconRailScrollAreaClass;

const appSidebarIconRailFooterClass = [
  sidebarIconRailFooterClass,
  "group-data-[collapsible=icon]:px-0",
  "group-data-[collapsible=icon]:pb-1",
].join(" ");

const appSidebarIconRailHiddenClass = sidebarIconRailHiddenClass;

const appSidebarIconRailUserTriggerClass = [
  sidebarIconRailMenuButtonClass,
  appSidebarIconRailHitTargetClass,
  "group-data-[collapsible=icon]:hover:bg-transparent!",
].join(" ");

const appSidebarIconRailUserAvatarClass = [
  sidebarIconRailAvatarClass,
  "group-data-[collapsible=icon]:size-7!",
  "group-data-[collapsible=icon]:rounded-md",
].join(" ");

const appSidebarIconRailNavIconClass = [
  "size-4 shrink-0",
  "group-data-[collapsible=icon]:size-4!",
  "group-data-[collapsible=icon]:max-h-4",
  "group-data-[collapsible=icon]:max-w-4",
].join(" ");

export {
  appSidebarIconRailFooterClass,
  appSidebarIconRailGlyphClass,
  appSidebarIconRailGroupLabelClass,
  appSidebarIconRailHiddenClass,
  appSidebarIconRailHitTargetClass,
  appSidebarIconRailItemLabelClass,
  appSidebarIconRailNavGroupClass,
  appSidebarIconRailNavIconClass,
  appSidebarIconRailNavItemClass,
  appSidebarIconRailScrollAreaClass,
  appSidebarIconRailShellClass,
  appSidebarIconRailUserAvatarClass,
  appSidebarIconRailUserTriggerClass,
};
