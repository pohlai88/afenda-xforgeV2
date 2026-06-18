import { appShellChromeSurfaceClass } from "../app-shell-recipes";

const appTopbarShellClass = `flex h-full min-h-0 shrink-0 items-center gap-1 [grid-area:topbar] px-4 ${appShellChromeSurfaceClass}`;

const topbarLeftClusterClass = "flex min-w-0 shrink-0 items-center gap-1";

const topbarScopeNavClass =
  "flex min-w-0 flex-1 items-center gap-1 overflow-x-auto";

const topbarRightClusterClass =
  "ms-auto flex shrink-0 flex-nowrap items-center gap-1.5";

const topbarSidebarTriggerClass = "shrink-0 text-text-secondary";

const topbarBrandDiskShellClass =
  "flex size-[1.875rem] max-h-[1.875rem] max-w-[1.875rem] min-h-[1.875rem] min-w-[1.875rem] shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-default bg-surface-muted leading-none";

const topbarBrandDiskImageClass =
  "block size-full min-h-0 min-w-0 max-h-full max-w-full object-cover object-center";

const topbarSwitcherButtonGroupClass = "group";

const topbarSwitcherButtonClass =
  "h-8 min-h-8 w-auto max-w-[calc(20ch+1.75rem)] gap-0.5 rounded-md px-1.5 py-0 font-normal has-[>svg]:px-1";

const topbarSwitcherScopeLabelClass =
  "text-[8px] font-medium uppercase leading-[9px] tracking-[0.04em] text-text-secondary/65";

const topbarSwitcherValueClass =
  "max-w-[20ch] truncate text-[length:var(--xforge-font-caption-size)] leading-[13px] tracking-[-0.01em] text-text-primary";

const topbarSwitcherChevronClass =
  "size-3.5 shrink-0 text-text-secondary/70 transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none";

const topbarSwitcherMenuClass = "min-w-56";

const topbarSwitcherStackClass =
  "flex min-w-0 flex-1 flex-col items-start justify-center";

const topbarScopeSwitcherItemClass = "min-w-0 shrink-0";

const topbarActionIconClass = "size-4 shrink-0";

const topbarUtilityIconClass = "size-4 shrink-0";

const topbarIconButtonClass = "size-8 shrink-0";

const topbarUtilitiesFixedClusterClass = "flex shrink-0 items-center gap-0.5";

const topbarUtilitiesBarClass = "flex min-w-0 items-center gap-0.5";

const topbarUtilitiesBarFieldsetClass = "m-0 border-0 p-0";

const topbarUtilitiesRailSeparatorClass =
  "mx-1 h-8 w-px shrink-0 self-center bg-border-default";

const topbarActionsMenuContentClass = "min-w-56";

const topbarActionsMenuHeaderClass = "border-b border-border-default px-3 py-2";

const topbarActionsMenuHeaderNameClass =
  "truncate text-[length:var(--xforge-font-caption-size)] font-medium text-text-primary";

const topbarActionsMenuHeaderEmailClass =
  "truncate text-[length:var(--xforge-font-label-size)] text-text-secondary";

const topbarActionsMenuGroupLabelClass =
  "px-2 py-1.5 text-[length:var(--xforge-font-label-size)] text-text-secondary";

const topbarActionsMenuItemClass =
  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[length:var(--xforge-font-caption-size)] text-text-primary hover:bg-surface-hover";

const topbarActionsMenuItemDestructiveClass = "text-status-critical";

const topbarThemeSunIconClass =
  "size-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0";

const topbarThemeMoonIconClass =
  "absolute size-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100";

const topbarUtilitiesMarketContentClass = "w-72 overflow-hidden p-0";

const topbarUtilitiesMarketHeaderClass =
  "border-b border-border-default px-4 py-3";

const topbarUtilitiesMarketTitleClass =
  "text-[length:var(--xforge-font-caption-size)] font-medium text-text-primary";

const topbarUtilitiesMarketDescriptionClass =
  "text-[length:var(--xforge-font-label-size)] text-text-secondary";

const topbarUtilitiesMarketMetaClass =
  "px-4 pb-1 pt-3 text-[length:var(--xforge-font-label-size)] text-text-secondary";

const topbarUtilitiesMarketListScrollClass =
  "h-[min(12rem,calc(70vh-16rem))]";

const topbarUtilitiesMarketListRegionClass = "px-2 pb-2 pr-3";

const topbarUtilitiesMarketFooterClass =
  "border-t border-border-default bg-surface-muted px-4 py-3";

const topbarUtilitiesMarketRowActionClass =
  "h-auto min-w-0 flex-1 justify-start gap-3 px-2 py-1 font-normal";

const topbarUtilitiesMarketGripClass =
  "flex size-7 shrink-0 items-center justify-center text-text-secondary";

const topbarUtilitiesSortableDraggingClass = "opacity-40";

const topbarUtilitiesSortableOverlayClass =
  "flex items-center gap-2 rounded-md border border-border-default bg-surface px-2 py-1.5 shadow-lg";

const topbarUtilitiesSortableOverlayLabelClass =
  "text-[length:var(--xforge-font-caption-size)] font-medium text-text-primary";

const topbarUtilitiesBarLegendClass = "sr-only";

const topbarUtilitiesBarSortableItemClass =
  "cursor-grab active:cursor-grabbing";

const topbarUtilitiesMarketListClass = "flex flex-col gap-1";

const topbarUtilitiesMarketRowClass =
  "flex items-center gap-2 rounded-md px-1 py-1";

const topbarUtilitiesMarketRowIconClass = "text-text-secondary";

const topbarUtilitiesMarketRowLabelClass =
  "truncate text-[length:var(--xforge-font-caption-size)]";

const topbarUtilitiesMarketRequestHeaderClass =
  "mb-2 flex items-center gap-2";

const topbarUtilitiesMarketRequestIconClass =
  "size-4 shrink-0 text-text-secondary";

const topbarUtilitiesMarketRequestLabelClass =
  "text-[length:var(--xforge-font-caption-size)] font-medium";

const topbarUtilitiesMarketRequestFormClass = "flex flex-col gap-2";

const topbarUtilitiesMarketRequestTextareaClass =
  "max-h-24 min-h-16 resize-none text-[length:var(--xforge-font-caption-size)]";

const topbarUtilitiesMarketRequestSubmitRowClass = "flex justify-end";

const topbarUtilitiesMarketRequestSubmitClass = "gap-1.5";

const topbarUtilitiesMarketRequestSendIconClass = "size-3.5";

const topbarUtilitiesMarketGripIconClass = "size-3.5";

const topbarUtilitiesMarketDisabledRowClass = "opacity-50";

const topbarFeedbackHiddenTriggerClass =
  "pointer-events-none fixed right-0 bottom-0 size-0 opacity-0";

const topbarFeedbackMenuItemClass = "w-full justify-start gap-2";

const topbarUtilitiesSortableHorizontalItemClass =
  "inline-flex touch-none rounded-md";

const topbarUtilitiesSortableVerticalItemClass = "touch-none rounded-md";

const topbarUtilitiesSortableVerticalItemOverClass =
  "bg-surface-hover ring-1 ring-border-default";

const topbarUtilitiesSortableOverlayWideClass = "gap-3 px-3 py-2";

const topbarUtilitiesSortableOverlayIconClass = "text-text-secondary";

const topbarUtilitiesContextWrapClass = "contents";

const topbarFeedbackMenuContentClass = "w-52 p-1";

export {
  appTopbarShellClass,
  topbarActionIconClass,
  topbarActionsMenuContentClass,
  topbarActionsMenuGroupLabelClass,
  topbarActionsMenuHeaderClass,
  topbarActionsMenuHeaderEmailClass,
  topbarActionsMenuHeaderNameClass,
  topbarActionsMenuItemClass,
  topbarActionsMenuItemDestructiveClass,
  topbarBrandDiskImageClass,
  topbarBrandDiskShellClass,
  topbarFeedbackHiddenTriggerClass,
  topbarFeedbackMenuContentClass,
  topbarFeedbackMenuItemClass,
  topbarIconButtonClass,
  topbarLeftClusterClass,
  topbarRightClusterClass,
  topbarScopeNavClass,
  topbarSidebarTriggerClass,
  topbarScopeSwitcherItemClass,
  topbarSwitcherStackClass,
  topbarSwitcherButtonGroupClass,
  topbarSwitcherButtonClass,
  topbarSwitcherChevronClass,
  topbarSwitcherMenuClass,
  topbarSwitcherScopeLabelClass,
  topbarSwitcherValueClass,
  topbarThemeMoonIconClass,
  topbarThemeSunIconClass,
  topbarUtilitiesBarClass,
  topbarUtilitiesBarFieldsetClass,
  topbarUtilitiesBarLegendClass,
  topbarUtilitiesBarSortableItemClass,
  topbarUtilitiesContextWrapClass,
  topbarUtilitiesFixedClusterClass,
  topbarUtilitiesMarketContentClass,
  topbarUtilitiesMarketDescriptionClass,
  topbarUtilitiesMarketDisabledRowClass,
  topbarUtilitiesMarketFooterClass,
  topbarUtilitiesMarketGripClass,
  topbarUtilitiesMarketGripIconClass,
  topbarUtilitiesMarketHeaderClass,
  topbarUtilitiesMarketListClass,
  topbarUtilitiesMarketListRegionClass,
  topbarUtilitiesMarketListScrollClass,
  topbarUtilitiesMarketMetaClass,
  topbarUtilitiesMarketRequestFormClass,
  topbarUtilitiesMarketRequestHeaderClass,
  topbarUtilitiesMarketRequestIconClass,
  topbarUtilitiesMarketRequestLabelClass,
  topbarUtilitiesMarketRequestSendIconClass,
  topbarUtilitiesMarketRequestSubmitClass,
  topbarUtilitiesMarketRequestSubmitRowClass,
  topbarUtilitiesMarketRequestTextareaClass,
  topbarUtilitiesMarketRowActionClass,
  topbarUtilitiesMarketRowClass,
  topbarUtilitiesMarketRowIconClass,
  topbarUtilitiesMarketRowLabelClass,
  topbarUtilitiesMarketTitleClass,
  topbarUtilitiesRailSeparatorClass,
  topbarUtilitiesSortableDraggingClass,
  topbarUtilitiesSortableHorizontalItemClass,
  topbarUtilitiesSortableOverlayClass,
  topbarUtilitiesSortableOverlayIconClass,
  topbarUtilitiesSortableOverlayLabelClass,
  topbarUtilitiesSortableOverlayWideClass,
  topbarUtilitiesSortableVerticalItemClass,
  topbarUtilitiesSortableVerticalItemOverClass,
  topbarUtilityIconClass,
};
