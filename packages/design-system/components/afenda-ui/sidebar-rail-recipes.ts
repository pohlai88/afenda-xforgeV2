/**
 * Icon rail — single frameless pattern for every trail target.
 * Quick actions, nav, footer profile, and sidebar control share this contract.
 */

const sidebarIconRailWidth = "3rem";

const sidebarIconRailItemGapClass = "group-data-[collapsible=icon]:gap-2";

/** Collapsed-only chrome (labels, badges, kbd, chevrons). */
const sidebarIconRailHiddenClass = "group-data-[collapsible=icon]:hidden";

/**
 * Frameless rail button — matches naked quick-action icons (no squircle, no fill at rest).
 */
const sidebarIconRailMenuButtonClass = [
  "group-data-[collapsible=icon]:relative",
  "group-data-[collapsible=icon]:mx-auto",
  "group-data-[collapsible=icon]:size-8!",
  "group-data-[collapsible=icon]:w-full!",
  "group-data-[collapsible=icon]:max-w-full",
  "group-data-[collapsible=icon]:justify-center",
  "group-data-[collapsible=icon]:gap-0",
  "group-data-[collapsible=icon]:rounded-none",
  "group-data-[collapsible=icon]:border-0",
  "group-data-[collapsible=icon]:bg-transparent!",
  "group-data-[collapsible=icon]:p-0!",
  "group-data-[collapsible=icon]:shadow-none",
  "group-data-[collapsible=icon]:ring-0",
  "group-data-[collapsible=icon]:outline-none",
  "group-data-[collapsible=icon]:text-sidebar-foreground/58",
  "group-data-[collapsible=icon]:hover:bg-transparent!",
  "group-data-[collapsible=icon]:hover:text-sidebar-foreground/88",
  "group-data-[collapsible=icon]:active:bg-transparent!",
  "group-data-[collapsible=icon]:data-[active=true]:bg-transparent!",
  "group-data-[collapsible=icon]:data-[active=true]:font-normal",
  "group-data-[collapsible=icon]:data-[active=true]:text-brand-primary",
  "group-data-[collapsible=icon]:data-[active=true]:shadow-none",
  "group-data-[collapsible=icon]:data-[active=true]:before:content-none",
  "group-data-[collapsible=icon]:data-[active=true]:after:content-none",
  "group-data-[collapsible=icon]:focus-visible:ring-0",
  "group-data-[collapsible=icon]:focus-visible:outline-2",
  "group-data-[collapsible=icon]:focus-visible:outline-offset-2",
  "group-data-[collapsible=icon]:focus-visible:outline-brand-primary/25",
  "group-data-[collapsible=icon]:[&>svg]:size-4",
  "group-data-[collapsible=icon]:[&>svg]:shrink-0",
  "group-data-[collapsible=icon]:[&>svg]:opacity-90",
  "group-data-[collapsible=icon]:hover:[&>svg]:opacity-100",
  "group-data-[collapsible=icon]:data-[active=true]:[&>svg]:opacity-100",
  "group-data-[collapsible=icon]:data-[active=true]:[&>svg]:text-brand-primary",
].join(" ");

/** Strips expanded-mode box chrome when block recipes are merged on the same node. */
const sidebarIconRailBlockItemClass = [
  "group-data-[collapsible=icon]:rounded-none",
  "group-data-[collapsible=icon]:bg-transparent!",
  "group-data-[collapsible=icon]:hover:bg-transparent!",
  "group-data-[collapsible=icon]:active:bg-transparent!",
  "group-data-[collapsible=icon]:px-0",
  "group-data-[collapsible=icon]:shadow-none",
  "group-data-[collapsible=icon]:ring-0",
  "group-data-[collapsible=icon]:before:content-none",
  "group-data-[collapsible=icon]:after:content-none",
].join(" ");

const sidebarIconRailMenuClass = [
  sidebarIconRailItemGapClass,
  "group-data-[collapsible=icon]:max-w-full",
  "group-data-[collapsible=icon]:overflow-x-hidden",
  "group-data-[collapsible=icon]:p-0",
].join(" ");

const sidebarIconRailGroupLabelClass =
  "group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:m-0 group-data-[collapsible=icon]:h-0 group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:p-0";

const sidebarIconRailNavGroupClass =
  "group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:max-w-full group-data-[collapsible=icon]:p-0";

const sidebarIconRailNavClass = [
  sidebarIconRailItemGapClass,
  "group-data-[collapsible=icon]:max-w-full",
  "group-data-[collapsible=icon]:overflow-x-hidden",
  "group-data-[collapsible=icon]:p-0",
  "group-data-[collapsible=icon]:px-0",
  "group-data-[collapsible=icon]:py-0",
].join(" ");

const sidebarIconRailShellClass = [
  sidebarIconRailItemGapClass,
  "group-data-[collapsible=icon]:max-w-full",
  "group-data-[collapsible=icon]:overflow-x-hidden",
].join(" ");

const sidebarIconRailFooterClass = [
  "group-data-[collapsible=icon]:mt-0",
  "group-data-[collapsible=icon]:max-w-full",
  "group-data-[collapsible=icon]:overflow-x-hidden",
  "group-data-[collapsible=icon]:border-0",
  "group-data-[collapsible=icon]:bg-transparent",
  "group-data-[collapsible=icon]:p-2",
  "group-data-[collapsible=icon]:shadow-none",
  "group-data-[collapsible=icon]:backdrop-blur-none",
].join(" ");

const sidebarIconRailFooterMenuClass = [
  sidebarIconRailItemGapClass,
  "group-data-[collapsible=icon]:max-w-full",
  "group-data-[collapsible=icon]:items-center",
  "group-data-[collapsible=icon]:p-0",
].join(" ");

const sidebarIconRailHeaderClass = "";
const sidebarIconRailFooterRowClass = "";
const sidebarIconRailInnerClass =
  "group-data-[collapsible=icon]:max-w-full group-data-[collapsible=icon]:overflow-x-hidden";

const sidebarIconRailControlTriggerClass = [
  sidebarIconRailBlockItemClass,
  "group-data-[collapsible=icon]:mx-auto",
  "group-data-[collapsible=icon]:size-8!",
  "group-data-[collapsible=icon]:p-0!",
  "group-data-[collapsible=icon]:text-sidebar-foreground/58",
  "group-data-[collapsible=icon]:hover:text-sidebar-foreground/88",
].join(" ");

const sidebarIconRailIconClass =
  "size-4 shrink-0 stroke-[1.65] transition-[color,opacity] duration-150 ease-out";

const sidebarIconRailAvatarClass = [
  "size-8 shrink-0",
  "group-data-[collapsible=icon]:size-auto",
  "group-data-[collapsible=icon]:bg-transparent",
  "group-data-[collapsible=icon]:ring-0",
].join(" ");

/** ScrollArea inside icon rail — no horizontal track. */
const sidebarIconRailScrollAreaClass = [
  "max-w-full overflow-x-hidden overscroll-x-none",
  "[&_[data-slot=scroll-area-viewport]]:max-w-full",
  "[&_[data-slot=scroll-area-viewport]]:overflow-x-hidden",
  "[&_[data-slot=scroll-area-scrollbar][data-orientation=horizontal]]:hidden",
].join(" ");

export {
  sidebarIconRailAvatarClass,
  sidebarIconRailBlockItemClass,
  sidebarIconRailControlTriggerClass,
  sidebarIconRailFooterClass,
  sidebarIconRailFooterMenuClass,
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
  sidebarIconRailScrollAreaClass,
  sidebarIconRailShellClass,
  sidebarIconRailWidth,
};
