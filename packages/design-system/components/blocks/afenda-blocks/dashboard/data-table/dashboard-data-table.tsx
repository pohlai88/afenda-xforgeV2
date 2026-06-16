"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Badge } from "@repo/design-system/components/afenda-ui/badge";
import { Button } from "@repo/design-system/components/afenda-ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/design-system/components/afenda-ui/dropdown-menu";
import { Label } from "@repo/design-system/components/afenda-ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/afenda-ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/components/afenda-ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/afenda-ui/tabs";
import { cn } from "@repo/design-system/lib/utils";
import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Columns3Icon,
  PlusIcon,
} from "lucide-react";
import { memo, useId, useMemo, useState } from "react";
import { dashboardDataTableTableClass } from "../dashboard-block-recipes";
import {
  DASHBOARD_DATA_TABLE_PAGE_SIZES,
  DASHBOARD_DATA_TABLE_TAB_VIEWS,
} from "./dashboard-data-table-constants";
import {
  dashboardDataTableBodyClass,
  dashboardDataTableEmptyCellClass,
  dashboardDataTableFooterClass,
  dashboardDataTableGridClass,
  dashboardDataTableHeaderClass,
  dashboardDataTableOutlinePanelClass,
  dashboardDataTablePageButtonsClass,
  dashboardDataTablePageIndicatorClass,
  dashboardDataTablePageSizeClass,
  dashboardDataTablePaginationClass,
  dashboardDataTablePlaceholderPanelClass,
  dashboardDataTableSelectionSummaryClass,
  dashboardDataTableShellClass,
  dashboardDataTableTabsListClass,
  dashboardDataTableToolbarActionsClass,
  dashboardDataTableToolbarClass,
  dashboardDataTableViewSelectClass,
} from "./dashboard-data-table-recipes";
import type { DashboardDataTableProps } from "./dashboard-data-table-types";
import { dashboardDataTableColumns } from "./data-table-columns";
import { DataTableDraggableRow } from "./data-table-draggable-row";

export type { DashboardDataTableProps } from "./dashboard-data-table-types";

export const DashboardDataTable = memo(function DashboardDataTable({
  className,
  data: initialData,
}: DashboardDataTableProps) {
  const [data, setData] = useState(() => [...initialData]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data.map(({ id }) => id),
    [data]
  );

  const table = useReactTable({
    columns: dashboardDataTableColumns,
    data,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id.toString(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      columnVisibility,
      pagination,
      rowSelection,
      sorting,
    },
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!(active && over) || active.id === over.id) {
      return;
    }

    setData((currentData) => {
      const oldIndex = dataIds.indexOf(active.id);
      const newIndex = dataIds.indexOf(over.id);
      return arrayMove(currentData, oldIndex, newIndex);
    });
  }

  return (
    <Tabs
      className={cn(dashboardDataTableShellClass, className)}
      data-slot="dashboard-data-table"
      defaultValue="outline"
    >
      <div className={dashboardDataTableToolbarClass}>
        <Label className="sr-only" htmlFor="view-selector">
          View
        </Label>
        <Select defaultValue="outline">
          <SelectTrigger
            className={dashboardDataTableViewSelectClass}
            id="view-selector"
            size="compact"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            {DASHBOARD_DATA_TABLE_TAB_VIEWS.map((view) => (
              <SelectItem key={view.value} value={view.value}>
                {view.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <TabsList className={dashboardDataTableTabsListClass}>
          {DASHBOARD_DATA_TABLE_TAB_VIEWS.map((view) => (
            <TabsTrigger key={view.value} value={view.value}>
              {view.label}
              {"badge" in view && view.badge ? (
                <Badge tone="neutral" variant="soft">
                  {view.badge}
                </Badge>
              ) : null}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className={dashboardDataTableToolbarActionsClass}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" type="button" variant="secondary">
                <Columns3Icon aria-hidden="true" className="size-4" />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <ChevronDownIcon aria-hidden="true" className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    checked={column.getIsVisible()}
                    className="capitalize"
                    key={column.id}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" type="button" variant="secondary">
            <PlusIcon aria-hidden="true" className="size-4" />
            <span className="hidden lg:inline">Add Section</span>
          </Button>
        </div>
      </div>
      <TabsContent
        className={dashboardDataTableOutlinePanelClass}
        value="outline"
      >
        <div className={dashboardDataTableGridClass}>
          <DndContext
            collisionDetection={closestCenter}
            id={sortableId}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <Table className={dashboardDataTableTableClass}>
              <TableHeader className={dashboardDataTableHeaderClass}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead colSpan={header.colSpan} key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className={dashboardDataTableBodyClass}>
                {table.getRowModel().rows.length > 0 ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DataTableDraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      className={dashboardDataTableEmptyCellClass}
                      colSpan={dashboardDataTableColumns.length}
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className={dashboardDataTableFooterClass}>
          <div className={dashboardDataTableSelectionSummaryClass}>
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className={dashboardDataTablePaginationClass}>
            <div className={dashboardDataTablePageSizeClass}>
              <Label
                className="font-medium text-[12px]"
                htmlFor="rows-per-page"
              >
                Rows per page
              </Label>
              <Select
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
                value={`${table.getState().pagination.pageSize}`}
              >
                <SelectTrigger
                  className="w-20"
                  id="rows-per-page"
                  size="compact"
                >
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {DASHBOARD_DATA_TABLE_PAGE_SIZES.map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className={dashboardDataTablePageIndicatorClass}>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className={dashboardDataTablePageButtonsClass}>
              <Button
                aria-label="Go to first page"
                className="hidden h-8 w-8 p-0 lg:flex"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.setPageIndex(0)}
                size="icon-sm"
                type="button"
                variant="secondary"
              >
                <ChevronsLeftIcon aria-hidden="true" className="size-4" />
                <span className="sr-only">Go to first page</span>
              </Button>
              <Button
                aria-label="Go to previous page"
                className="size-8"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
                size="icon-sm"
                type="button"
                variant="secondary"
              >
                <ChevronLeftIcon aria-hidden="true" className="size-4" />
                <span className="sr-only">Go to previous page</span>
              </Button>
              <Button
                aria-label="Go to next page"
                className="size-8"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
                size="icon-sm"
                type="button"
                variant="secondary"
              >
                <ChevronRightIcon aria-hidden="true" className="size-4" />
                <span className="sr-only">Go to next page</span>
              </Button>
              <Button
                aria-label="Go to last page"
                className="hidden size-8 lg:flex"
                disabled={!table.getCanNextPage()}
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                size="icon-sm"
                type="button"
                variant="secondary"
              >
                <ChevronsRightIcon aria-hidden="true" className="size-4" />
                <span className="sr-only">Go to last page</span>
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      {DASHBOARD_DATA_TABLE_TAB_VIEWS.filter(
        (view) => view.value !== "outline"
      ).map((view) => (
        <TabsContent
          className="flex flex-col"
          key={view.value}
          value={view.value}
        >
          <div className={dashboardDataTablePlaceholderPanelClass} />
        </TabsContent>
      ))}
    </Tabs>
  );
});
