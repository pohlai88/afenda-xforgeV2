"use client";

import { useSortable } from "@dnd-kit/sortable";
import { Button } from "@repo/design-system/components/afenda-ui/button";
import { GripVerticalIcon } from "lucide-react";
import { memo } from "react";
import { dashboardDataTableDragHandleClass } from "./dashboard-data-table-recipes";

export const DataTableDragHandle = memo(function DataTableDragHandle({
  id,
}: {
  readonly id: number;
}) {
  const { attributes, listeners } = useSortable({ id });

  return (
    <Button
      {...attributes}
      {...listeners}
      aria-label="Drag to reorder"
      className={dashboardDataTableDragHandleClass}
      size="icon-sm"
      type="button"
      variant="quiet"
    >
      <GripVerticalIcon aria-hidden="true" className="size-3 text-text-secondary" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
});
