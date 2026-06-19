"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import { useId, useState } from "react";
import { cn } from "../../../../../lib/utils";
import { blockRecipe } from "../../../block-recipes";
import {
  topbarUtilitiesSortableDraggingClass,
  topbarUtilitiesSortableHorizontalItemClass,
  topbarUtilitiesSortableOverlayClass,
  topbarUtilitiesSortableOverlayIconClass,
  topbarUtilitiesSortableOverlayLabelClass,
  topbarUtilitiesSortableOverlayWideClass,
  topbarUtilitiesSortableVerticalItemClass,
  topbarUtilitiesSortableVerticalItemOverClass,
} from "./topbar-recipes";
import {
  getTopbarUtilityDefinition,
  isTopbarUtilityId,
  renderTopbarUtilityIcon,
  type TopbarUtilityId,
} from "./topbar-utilities-catalog";

function useUtilitySortableSensors(): ReturnType<typeof useSensors> {
  return useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );
}

export function TopbarHorizontalUtilitySortable({
  children,
  ids,
  onReorder,
}: {
  readonly children: ReactNode;
  readonly ids: readonly TopbarUtilityId[];
  readonly onReorder: (
    activeId: TopbarUtilityId,
    overId: TopbarUtilityId
  ) => void;
}): ReactElement {
  const dndContextId = useId();
  const sensors = useUtilitySortableSensors();
  const [activeId, setActiveId] = useState<TopbarUtilityId | null>(null);

  const handleDragStart = (event: DragStartEvent): void => {
    const id = String(event.active.id);

    if (!isTopbarUtilityId(id)) {
      return;
    }

    setActiveId(id);
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const activeUtilityId = String(active.id);
    const overUtilityId = String(over.id);

    if (
      !(isTopbarUtilityId(activeUtilityId) && isTopbarUtilityId(overUtilityId))
    ) {
      return;
    }

    onReorder(activeUtilityId, overUtilityId);
  };

  return (
    <div data-slot="app-topbar-utilities-sortable-horizontal">
      <DndContext
        collisionDetection={closestCenter}
        id={dndContextId}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
        <SortableContext
          items={[...ids]}
          strategy={horizontalListSortingStrategy}
        >
          {children}
        </SortableContext>
        <DragOverlay dropAnimation={{ duration: 160 }}>
          {activeId ? (
            <div
              className={cn(
                blockRecipe("blockShell"),
                topbarUtilitiesSortableOverlayClass
              )}
            >
              <span className={cn(topbarUtilitiesSortableOverlayIconClass)}>
                {renderTopbarUtilityIcon(activeId)}
              </span>
              <span className={cn(topbarUtilitiesSortableOverlayLabelClass)}>
                {getTopbarUtilityDefinition(activeId).label}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export function TopbarVerticalUtilitySortable({
  children,
  ids,
  onReorder,
}: {
  readonly children: ReactNode;
  readonly ids: readonly TopbarUtilityId[];
  readonly onReorder: (
    activeId: TopbarUtilityId,
    overId: TopbarUtilityId
  ) => void;
}): ReactElement {
  const dndContextId = useId();
  const sensors = useUtilitySortableSensors();
  const [activeId, setActiveId] = useState<TopbarUtilityId | null>(null);

  const handleDragStart = (event: DragStartEvent): void => {
    const id = String(event.active.id);

    if (!isTopbarUtilityId(id)) {
      return;
    }

    setActiveId(id);
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const activeUtilityId = String(active.id);
    const overUtilityId = String(over.id);

    if (
      !(isTopbarUtilityId(activeUtilityId) && isTopbarUtilityId(overUtilityId))
    ) {
      return;
    }

    onReorder(activeUtilityId, overUtilityId);
  };

  return (
    <div data-slot="app-topbar-utilities-sortable-vertical">
      <DndContext
        collisionDetection={closestCenter}
        id={dndContextId}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
        <SortableContext
          items={[...ids]}
          strategy={verticalListSortingStrategy}
        >
          {children}
        </SortableContext>
        <DragOverlay dropAnimation={{ duration: 160 }}>
          {activeId ? (
            <div
              className={cn(
                blockRecipe("blockShell"),
                topbarUtilitiesSortableOverlayClass,
                topbarUtilitiesSortableOverlayWideClass
              )}
            >
              <span className={cn(topbarUtilitiesSortableOverlayIconClass)}>
                {renderTopbarUtilityIcon(activeId)}
              </span>
              <span className={cn(topbarUtilitiesSortableOverlayLabelClass)}>
                {getTopbarUtilityDefinition(activeId).label}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export function TopbarSortableHorizontalItem({
  children,
  className,
  id,
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly id: TopbarUtilityId;
}): ReactElement {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={cn(
        topbarUtilitiesSortableHorizontalItemClass,
        isDragging && topbarUtilitiesSortableDraggingClass,
        className
      )}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

export function TopbarSortableVerticalItem({
  children,
  className,
  id,
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly id: TopbarUtilityId;
}): ReactElement {
  const {
    attributes,
    isDragging,
    isOver,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      className={cn(
        topbarUtilitiesSortableVerticalItemClass,
        isDragging && topbarUtilitiesSortableDraggingClass,
        isOver && topbarUtilitiesSortableVerticalItemOverClass,
        className
      )}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
    </li>
  );
}
