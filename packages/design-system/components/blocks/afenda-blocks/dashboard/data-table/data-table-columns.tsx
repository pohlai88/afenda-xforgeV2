"use client";

import { Badge } from "@repo/design-system/components/afenda-ui/badge";
import { Button } from "@repo/design-system/components/afenda-ui/button";
import { Checkbox } from "@repo/design-system/components/afenda-ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/design-system/components/afenda-ui/dropdown-menu";
import { Input } from "@repo/design-system/components/afenda-ui/input";
import { Label } from "@repo/design-system/components/afenda-ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/afenda-ui/select";
import type { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle2Icon,
  EllipsisVerticalIcon,
  LoaderIcon,
} from "lucide-react";
import {
  DASHBOARD_DATA_TABLE_REVIEWER_PLACEHOLDER,
  DASHBOARD_DATA_TABLE_REVIEWERS,
} from "./dashboard-data-table-constants";
import {
  dashboardDataTableActionsTriggerClass,
  dashboardDataTableNumericInputClass,
  dashboardDataTableOutlineBadgeClass,
  dashboardDataTableReviewerSelectClass,
  dashboardDataTableTypeBadgeClass,
} from "./dashboard-data-table-recipes";
import type { DashboardDataTableRow } from "./dashboard-data-table-schema";
import { demoSaveDashboardDataTableField } from "./dashboard-data-table-demo-actions";
import { DataTableCellViewer } from "./data-table-cell-viewer";
import { DataTableDragHandle } from "./data-table-drag-handle";

export const dashboardDataTableColumns: ColumnDef<DashboardDataTableRow>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DataTableDragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          aria-label="Select all"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "header",
    header: "Header",
    cell: ({ row }) => <DataTableCellViewer item={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Section Type",
    cell: ({ row }) => (
      <div className={dashboardDataTableTypeBadgeClass}>
        <Badge
          className={dashboardDataTableOutlineBadgeClass}
          tone="neutral"
          variant="outline"
        >
          {row.original.type}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        className={dashboardDataTableOutlineBadgeClass}
        tone="neutral"
        variant="outline"
      >
        {row.original.status === "Done" ? (
          <CheckCircle2Icon
            aria-hidden="true"
            className="fill-success text-success"
          />
        ) : (
          <LoaderIcon aria-hidden="true" className="size-3" />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "target",
    header: () => <div className="w-full text-right">Target</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          demoSaveDashboardDataTableField(row.original.header);
        }}
      >
        <Label className="sr-only" htmlFor={`${row.original.id}-target`}>
          Target
        </Label>
        <Input
          className={dashboardDataTableNumericInputClass}
          defaultValue={row.original.target}
          id={`${row.original.id}-target`}
        />
      </form>
    ),
  },
  {
    accessorKey: "limit",
    header: () => <div className="w-full text-right">Limit</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          demoSaveDashboardDataTableField(row.original.header);
        }}
      >
        <Label className="sr-only" htmlFor={`${row.original.id}-limit`}>
          Limit
        </Label>
        <Input
          className={dashboardDataTableNumericInputClass}
          defaultValue={row.original.limit}
          id={`${row.original.id}-limit`}
        />
      </form>
    ),
  },
  {
    accessorKey: "reviewer",
    header: "Reviewer",
    cell: ({ row }) => {
      const isAssigned =
        row.original.reviewer !== DASHBOARD_DATA_TABLE_REVIEWER_PLACEHOLDER;

      if (isAssigned) {
        return row.original.reviewer;
      }

      return (
        <>
          <Label className="sr-only" htmlFor={`${row.original.id}-reviewer`}>
            Reviewer
          </Label>
          <Select>
            <SelectTrigger
              className={dashboardDataTableReviewerSelectClass}
              id={`${row.original.id}-reviewer`}
              size="compact"
            >
              <SelectValue
                placeholder={DASHBOARD_DATA_TABLE_REVIEWER_PLACEHOLDER}
              />
            </SelectTrigger>
            <SelectContent align="end">
              {DASHBOARD_DATA_TABLE_REVIEWERS.map((reviewer) => (
                <SelectItem key={reviewer} value={reviewer}>
                  {reviewer}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      );
    },
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            className={dashboardDataTableActionsTriggerClass}
            size="icon-sm"
            type="button"
            variant="quiet"
          >
            <EllipsisVerticalIcon aria-hidden="true" className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="critical">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
