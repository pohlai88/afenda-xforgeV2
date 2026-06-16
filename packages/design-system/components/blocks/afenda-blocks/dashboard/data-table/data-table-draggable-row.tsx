"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  TableCell,
  TableRow,
} from "@repo/design-system/components/afenda-ui/table";
import { flexRender, type Row } from "@tanstack/react-table";
import { memo } from "react";
import { dashboardDataTableDraggableRowClass } from "./dashboard-data-table-recipes";
import type { DashboardDataTableRow } from "./dashboard-data-table-schema";

export const DataTableDraggableRow = memo(function DataTableDraggableRow({
  row,
}: {
  readonly row: Row<DashboardDataTableRow>;
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      className={dashboardDataTableDraggableRowClass}
      data-dragging={isDragging}
      data-state={row.getIsSelected() ? "selected" : undefined}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
});
