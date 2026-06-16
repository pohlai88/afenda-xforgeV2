const dashboardDataTableShellClass =
  "@container/main flex w-full flex-col justify-start gap-6";

const dashboardDataTableToolbarClass =
  "flex items-center justify-between";

const dashboardDataTableViewSelectClass = "flex w-fit @4xl/main:hidden";

const dashboardDataTableTabsListClass =
  "hidden @4xl/main:flex !border-0 !bg-transparent !p-0 !shadow-none **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-text-secondary/30 **:data-[slot=badge]:px-1";

const dashboardDataTableToolbarActionsClass = "flex items-center gap-2";

const dashboardDataTableOutlinePanelClass =
  "relative flex flex-col gap-4 overflow-auto";

const dashboardDataTableGridClass =
  "overflow-hidden rounded-lg border border-border-subtle";

const dashboardDataTableHeaderClass =
  "sticky top-0 z-10 border-border-subtle border-b bg-sidebar";

const dashboardDataTableBodyClass = "**:data-[slot=table-cell]:first:w-8";

const dashboardDataTableEmptyCellClass = "h-24 text-center";

const dashboardDataTableFooterClass =
  "flex items-center justify-between px-4";

const dashboardDataTableSelectionSummaryClass =
  "hidden flex-1 text-[12px] text-text-secondary lg:flex";

const dashboardDataTablePaginationClass =
  "flex w-full items-center gap-8 lg:w-fit";

const dashboardDataTablePageSizeClass = "hidden items-center gap-2 lg:flex";

const dashboardDataTablePageIndicatorClass =
  "flex w-fit items-center justify-center text-[12px] font-medium";

const dashboardDataTablePageButtonsClass =
  "ml-auto flex items-center gap-2 lg:ml-0";

const dashboardDataTablePlaceholderPanelClass =
  "aspect-video w-full flex-1 rounded-lg border border-dashed";

const dashboardDataTableDragHandleClass =
  "size-7 text-text-secondary hover:bg-transparent";

const dashboardDataTableNumericInputClass =
  "h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-surface-hover/60 focus-visible:border focus-visible:bg-surface-raised";

const dashboardDataTableReviewerSelectClass =
  "w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate";

const dashboardDataTableActionsTriggerClass =
  "flex size-8 text-text-secondary data-[state=open]:bg-sidebar-accent/60";

const dashboardDataTableTypeBadgeClass = "w-32";

const dashboardDataTableOutlineBadgeClass = "px-1.5 text-text-secondary";

const dashboardDataTableDraggableRowClass =
  "relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80";

const dashboardDataTableDrawerTrendClass =
  "flex gap-2 font-medium leading-none";

const dashboardDataTableDrawerCopyClass = "text-text-secondary";

export {
  dashboardDataTableActionsTriggerClass,
  dashboardDataTableBodyClass,
  dashboardDataTableDragHandleClass,
  dashboardDataTableDraggableRowClass,
  dashboardDataTableDrawerCopyClass,
  dashboardDataTableDrawerTrendClass,
  dashboardDataTableEmptyCellClass,
  dashboardDataTableFooterClass,
  dashboardDataTableGridClass,
  dashboardDataTableHeaderClass,
  dashboardDataTableNumericInputClass,
  dashboardDataTableOutlineBadgeClass,
  dashboardDataTableOutlinePanelClass,
  dashboardDataTablePageButtonsClass,
  dashboardDataTablePageIndicatorClass,
  dashboardDataTablePageSizeClass,
  dashboardDataTablePaginationClass,
  dashboardDataTablePlaceholderPanelClass,
  dashboardDataTableReviewerSelectClass,
  dashboardDataTableSelectionSummaryClass,
  dashboardDataTableShellClass,
  dashboardDataTableTabsListClass,
  dashboardDataTableToolbarActionsClass,
  dashboardDataTableToolbarClass,
  dashboardDataTableTypeBadgeClass,
  dashboardDataTableViewSelectClass,
};
