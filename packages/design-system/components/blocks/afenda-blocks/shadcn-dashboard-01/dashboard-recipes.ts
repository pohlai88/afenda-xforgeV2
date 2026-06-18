const dashboardNavTopbarShellClass =
  "flex h-(--header-height,var(--dashboard-nav-topbar-height,calc(var(--spacing)*12))) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)";

const dashboardNavTopbarInnerClass =
  "flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6";

const dashboardNavTopbarTitleClass = "text-base font-medium";

const dashboardNavTopbarActionsClass = "ml-auto flex items-center gap-2";

const dashboardNavTopbarGithubButtonClass = "hidden sm:flex dark:text-foreground";

const dashboardNavTopbarSeparatorClass =
  "mx-2 data-[orientation=vertical]:h-4";

const dashboardNavTopbarTriggerClass = "-ml-1";

const dashboardAppSidebarBrandButtonClass =
  "data-[slot=sidebar-menu-button]:p-1.5!";

const dashboardAppSidebarBrandIconClass = "size-5!";

const dashboardAppSidebarBrandLabelClass = "text-base font-semibold";

const dashboardSectionCardsGridClass =
  "grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card";

const dashboardSectionCardClass = "@container/card";

const dashboardSectionCardTitleClass =
  "text-2xl font-semibold tabular-nums @[250px]/card:text-3xl";

const dashboardSectionCardFooterClass =
  "flex-col items-start gap-1.5 text-sm";

const dashboardSectionCardFooterPrimaryClass =
  "line-clamp-1 flex gap-2 font-medium";

const dashboardSectionCardFooterSecondaryClass = "text-muted-foreground";

const dashboardSectionCardIconClass = "size-4";

const dashboardChartCardClass = "@container/card";

const dashboardChartDescriptionWideClass = "hidden @[540px]/card:block";

const dashboardChartDescriptionCompactClass = "@[540px]/card:hidden";

const dashboardChartToggleGroupClass =
  "hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex";

const dashboardChartSelectTriggerClass =
  "flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden";

const dashboardChartSelectContentClass = "rounded-xl";

const dashboardChartSelectItemClass = "rounded-lg";

const dashboardChartContainerClass = "aspect-auto h-[250px] w-full";

const dashboardNavUserTriggerClass =
  "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground";

const dashboardNavUserAvatarClass = "h-8 w-8 rounded-lg grayscale";

const dashboardNavUserAvatarFallbackClass = "rounded-lg";

const dashboardNavUserIdentityClass =
  "grid flex-1 text-left text-sm leading-tight";

const dashboardNavUserNameClass = "truncate font-medium";

const dashboardNavUserEmailClass = "truncate text-xs text-muted-foreground";

const dashboardNavUserMenuIconClass = "ml-auto size-4";

const dashboardNavUserMenuContentClass =
  "w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg";

const dashboardNavUserMenuLabelClass = "p-0 font-normal";

const dashboardNavUserMenuIdentityRowClass =
  "flex items-center gap-2 px-1 py-1.5 text-left text-sm";

const dashboardNavDocumentsGroupClass = "group-data-[collapsible=icon]:hidden";

const dashboardNavDocumentsActionClass =
  "rounded-sm data-[state=open]:bg-accent";

const dashboardNavDocumentsMenuClass = "w-24 rounded-lg";

const dashboardNavDocumentsMoreButtonClass = "text-sidebar-foreground/70";

const dashboardNavDocumentsMoreIconClass = "text-sidebar-foreground/70";

const dashboardPageInsetStackClass = "flex flex-1 flex-col";

const dashboardPageMainStackClass = "@container/main flex flex-1 flex-col gap-2";

const dashboardPageContentStackClass = "flex flex-col gap-4 py-4 md:gap-6 md:py-6";

const dashboardPageChartWrapperClass = "px-4 lg:px-6";

const dashboardDataTableRootClass = "w-full flex-col justify-start gap-6";

const dashboardDataTableToolbarClass =
  "flex items-center justify-between px-4 lg:px-6";

const dashboardDataTableViewSelectClass = "flex w-fit @4xl/main:hidden";

const dashboardDataTableTabsListClass =
  "hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex";

const dashboardDataTableToolbarActionsClass = "flex items-center gap-2";

const dashboardDataTableColumnsMenuClass = "w-56";

const dashboardDataTableColumnItemClass = "capitalize";

const dashboardDataTableOutlineContentClass =
  "relative flex flex-col gap-4 overflow-auto px-4 lg:px-6";

const dashboardDataTablePanelClass = "overflow-hidden rounded-lg border";

const dashboardDataTableHeaderClass = "sticky top-0 z-10 bg-muted";

const dashboardDataTableBodyClass = "**:data-[slot=table-cell]:first:w-8";

const dashboardDataTableRowClass =
  "relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80";

const dashboardDataTableEmptyCellClass = "h-24 text-center";

const dashboardDataTablePaginationClass =
  "flex items-center justify-between px-4";

const dashboardDataTableSelectionSummaryClass =
  "hidden flex-1 text-sm text-muted-foreground lg:flex";

const dashboardDataTablePaginationClusterClass =
  "flex w-full items-center gap-8 lg:w-fit";

const dashboardDataTableRowsPerPageClass = "hidden items-center gap-2 lg:flex";

const dashboardDataTableRowsPerPageLabelClass = "text-sm font-medium";

const dashboardDataTableRowsPerPageSelectClass = "w-20";

const dashboardDataTablePageIndicatorClass =
  "flex w-fit items-center justify-center text-sm font-medium";

const dashboardDataTablePageActionsClass = "ml-auto flex items-center gap-2 lg:ml-0";

const dashboardDataTableFirstPageButtonClass = "hidden h-8 w-8 p-0 lg:flex";

const dashboardDataTableIconButtonClass = "size-8";

const dashboardDataTablePlaceholderTabClass = "flex flex-col px-4 lg:px-6";

const dashboardDataTablePlaceholderPanelClass =
  "aspect-video w-full flex-1 rounded-lg border border-dashed";

const dashboardDataTableDragHandleClass =
  "size-7 text-muted-foreground hover:bg-transparent";

const dashboardDataTableDragIconClass = "size-3 text-muted-foreground";

const dashboardDataTableSelectCellClass = "flex items-center justify-center";

const dashboardDataTableTypeCellClass = "w-32";

const dashboardDataTableBadgeClass = "px-1.5 text-muted-foreground";

const dashboardDataTableStatusIconDoneClass =
  "fill-green-500 dark:fill-green-400";

const dashboardDataTableHeaderRightClass = "w-full text-right";

const dashboardDataTableInlineInputClass =
  "h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:hover:bg-input/30 dark:focus-visible:bg-input/30";

const dashboardDataTableReviewerSelectClass =
  "w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate";

const dashboardDataTableRowActionsButtonClass =
  "flex size-8 text-muted-foreground data-[state=open]:bg-muted";

const dashboardDataTableRowActionsMenuClass = "w-32";

const dashboardDataTableDrawerTriggerClass =
  "w-fit px-0 text-left text-foreground";

const dashboardDataTableDrawerBodyClass =
  "flex flex-col gap-4 overflow-y-auto px-4 text-sm";

const dashboardDataTableDrawerTrendClass = "flex gap-2 leading-none font-medium";

const dashboardDataTableDrawerTrendIconClass = "size-4";

const dashboardDataTableDrawerCopyClass = "text-muted-foreground";

const dashboardDataTableDrawerFormClass = "flex flex-col gap-4";

const dashboardDataTableDrawerFieldStackClass = "flex flex-col gap-3";

const dashboardDataTableDrawerFieldGridClass = "grid grid-cols-2 gap-4";

const dashboardDataTableDrawerSelectTriggerClass = "w-full";

const dashboardDataTableHiddenLgInlineClass = "hidden lg:inline";

const dashboardDataTableVisibleLgHiddenClass = "lg:hidden";

const dashboardDataTableDrawerHeaderClass = "gap-1";

const dashboardDataTableDrawerMetricGridClass = "grid gap-2";

const dashboardChartContentClass = "px-2 pt-4 sm:px-6 sm:pt-6";

export {
  dashboardAppSidebarBrandButtonClass,
  dashboardAppSidebarBrandIconClass,
  dashboardAppSidebarBrandLabelClass,
  dashboardChartCardClass,
  dashboardChartContainerClass,
  dashboardChartContentClass,
  dashboardChartDescriptionCompactClass,
  dashboardChartDescriptionWideClass,
  dashboardChartSelectContentClass,
  dashboardChartSelectItemClass,
  dashboardChartSelectTriggerClass,
  dashboardChartToggleGroupClass,
  dashboardDataTableBadgeClass,
  dashboardDataTableBodyClass,
  dashboardDataTableColumnItemClass,
  dashboardDataTableColumnsMenuClass,
  dashboardDataTableDragHandleClass,
  dashboardDataTableDragIconClass,
  dashboardDataTableDrawerBodyClass,
  dashboardDataTableDrawerCopyClass,
  dashboardDataTableDrawerFieldGridClass,
  dashboardDataTableDrawerFieldStackClass,
  dashboardDataTableDrawerFormClass,
  dashboardDataTableDrawerHeaderClass,
  dashboardDataTableDrawerMetricGridClass,
  dashboardDataTableDrawerSelectTriggerClass,
  dashboardDataTableDrawerTrendClass,
  dashboardDataTableDrawerTrendIconClass,
  dashboardDataTableDrawerTriggerClass,
  dashboardDataTableEmptyCellClass,
  dashboardDataTableFirstPageButtonClass,
  dashboardDataTableHeaderClass,
  dashboardDataTableHeaderRightClass,
  dashboardDataTableHiddenLgInlineClass,
  dashboardDataTableIconButtonClass,
  dashboardDataTableInlineInputClass,
  dashboardDataTableOutlineContentClass,
  dashboardDataTablePageActionsClass,
  dashboardDataTablePageIndicatorClass,
  dashboardDataTablePaginationClass,
  dashboardDataTablePaginationClusterClass,
  dashboardDataTablePanelClass,
  dashboardDataTablePlaceholderPanelClass,
  dashboardDataTablePlaceholderTabClass,
  dashboardDataTableReviewerSelectClass,
  dashboardDataTableRootClass,
  dashboardDataTableRowActionsButtonClass,
  dashboardDataTableRowActionsMenuClass,
  dashboardDataTableRowClass,
  dashboardDataTableRowsPerPageClass,
  dashboardDataTableRowsPerPageLabelClass,
  dashboardDataTableRowsPerPageSelectClass,
  dashboardDataTableSelectionSummaryClass,
  dashboardDataTableSelectCellClass,
  dashboardDataTableStatusIconDoneClass,
  dashboardDataTableTabsListClass,
  dashboardDataTableToolbarActionsClass,
  dashboardDataTableToolbarClass,
  dashboardDataTableTypeCellClass,
  dashboardDataTableViewSelectClass,
  dashboardDataTableVisibleLgHiddenClass,
  dashboardNavDocumentsActionClass,
  dashboardNavDocumentsGroupClass,
  dashboardNavDocumentsMenuClass,
  dashboardNavDocumentsMoreButtonClass,
  dashboardNavDocumentsMoreIconClass,
  dashboardNavTopbarActionsClass,
  dashboardNavTopbarGithubButtonClass,
  dashboardNavTopbarInnerClass,
  dashboardNavTopbarSeparatorClass,
  dashboardNavTopbarShellClass,
  dashboardNavTopbarTitleClass,
  dashboardNavTopbarTriggerClass,
  dashboardNavUserAvatarClass,
  dashboardNavUserAvatarFallbackClass,
  dashboardNavUserEmailClass,
  dashboardNavUserIdentityClass,
  dashboardNavUserMenuContentClass,
  dashboardNavUserMenuIconClass,
  dashboardNavUserMenuIdentityRowClass,
  dashboardNavUserMenuLabelClass,
  dashboardNavUserNameClass,
  dashboardNavUserTriggerClass,
  dashboardPageChartWrapperClass,
  dashboardPageContentStackClass,
  dashboardPageInsetStackClass,
  dashboardPageMainStackClass,
  dashboardSectionCardClass,
  dashboardSectionCardFooterClass,
  dashboardSectionCardFooterPrimaryClass,
  dashboardSectionCardFooterSecondaryClass,
  dashboardSectionCardIconClass,
  dashboardSectionCardsGridClass,
  dashboardSectionCardTitleClass,
};
