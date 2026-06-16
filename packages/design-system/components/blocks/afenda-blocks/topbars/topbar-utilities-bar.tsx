"use client";

import { Button } from "@repo/design-system/components/afenda-ui/button";
import { TOPBAR_MAX_PINNED_UTILITY_SLOTS } from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-constants";
import { topbarIconActionClass } from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-recipes";
import { cn } from "@repo/design-system/lib/utils";
import {
  type DragEvent,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { TopbarNotifications } from "./topbar-notifications";
import { TopbarTooltip } from "./topbar-tooltip";
import type {
  TopbarUtilitiesBarProps,
  TopbarUtilityAction,
} from "./topbar-types";

function reorderUtilityIds(
  order: readonly string[],
  draggedId: string,
  targetId: string
): readonly string[] {
  const next = [...order];
  const fromIndex = next.indexOf(draggedId);
  const toIndex = next.indexOf(targetId);

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return order;
  }

  const [removed] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, removed);
  return next;
}

function getUtilityTooltipDescription(
  action: TopbarUtilityAction,
  draggable: boolean
): string | undefined {
  if (action.description) {
    return action.description;
  }

  return draggable ? "Drag to reorder this utility." : undefined;
}

interface TopbarUtilityPinProps {
  readonly action: TopbarUtilityAction;
  readonly children?: React.ReactNode;
  readonly draggable: boolean;
  readonly isDragging: boolean;
  readonly isDropTarget: boolean;
  readonly onDragEnd: () => void;
  readonly onDragLeave: () => void;
  readonly onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  readonly onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  readonly onDrop: (event: DragEvent<HTMLDivElement>) => void;
  readonly onSelect: () => void;
  readonly tooltipsDisabled: boolean;
}

const TopbarUtilityPin = memo(function TopbarUtilityPin({
  children,
  action,
  draggable,
  isDragging,
  isDropTarget,
  onDragEnd,
  onDragLeave,
  onDragOver,
  onDragStart,
  onDrop,
  onSelect,
  tooltipsDisabled,
}: TopbarUtilityPinProps) {
  return (
    <TopbarTooltip
      description={getUtilityTooltipDescription(action, draggable)}
      disabled={tooltipsDisabled}
      label={action.label}
      shortcut={action.shortcut}
    >
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: Native drag/drop events live on the draggable utility wrapper while click remains on the child button. */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: Draggable wrapper needs drag/drop handlers for pointer reordering. */}
      <div
        aria-grabbed={draggable ? isDragging : undefined}
        className={cn(
          "group relative inline-flex shrink-0 rounded-md transition-[opacity,box-shadow,transform] duration-120 ease-out motion-reduce:transition-none",
          draggable && "cursor-move active:cursor-move",
          "hover:scale-[1.08] focus-visible:scale-[1.08] focus-within:scale-[1.08]",
          isDragging && "z-10 opacity-55 shadow-sm",
          isDropTarget &&
            "after:absolute after:inset-y-0.5 after:-right-0.5 after:w-0.5 after:rounded-full after:bg-brand-primary/70"
        )}
        draggable={draggable}
        onDragEnd={onDragEnd}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDragStart={onDragStart}
        onDrop={onDrop}
      >
        {children ?? (
          <Button
            aria-label={action.label}
            className={cn(
              topbarIconActionClass,
              "transition-transform duration-120 ease-out group-hover:scale-[1.02] motion-reduce:transition-none",
              draggable && "touch-none select-none"
            )}
            data-slot={`app-topbar-utility-${action.id}`}
            onClick={onSelect}
            size="icon-sm"
            type="button"
            variant="quiet"
          >
            {action.icon}
          </Button>
        )}
      </div>
    </TopbarTooltip>
  );
});

export function TopbarUtilitiesBar({
  actions,
  className,
  draggable = true,
  maxActions = TOPBAR_MAX_PINNED_UTILITY_SLOTS,
  notifications,
  onOrderChange,
  order,
}: TopbarUtilitiesBarProps) {
  const actionById = useMemo(
    () => new Map(actions.map((action) => [action.id, action])),
    [actions]
  );
  const defaultOrder = useMemo(
    () => actions.map((action) => action.id),
    [actions]
  );
  const [internalOrder, setInternalOrder] = useState<readonly string[]>(
    () => order ?? defaultOrder
  );
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const suppressClickRef = useRef(false);

  const resolvedOrder = order ?? internalOrder;
  const cappedOrder = useMemo(
    () => resolvedOrder.slice(0, maxActions),
    [maxActions, resolvedOrder]
  );
  const orderedActions = useMemo(
    () =>
      cappedOrder
        .map((id) => actionById.get(id))
        .filter(
          (action): action is TopbarUtilityAction => action !== undefined
        ),
    [actionById, cappedOrder]
  );

  const commitOrder = useCallback(
    (nextOrder: readonly string[]) => {
      if (order === undefined) {
        setInternalOrder(nextOrder);
      }

      onOrderChange?.(nextOrder);
    },
    [onOrderChange, order]
  );

  if (actions.length === 0) {
    return null;
  }

  const tooltipsDisabled = draggingId !== null;
  const hasDraggableActions = orderedActions.some(
    (action) => draggable && action.draggable !== false
  );

  return (
    <div
      aria-label="Pinned utilities"
      aria-roledescription={
        hasDraggableActions ? "Drag icons to reorder" : undefined
      }
      className={cn("flex items-center gap-0.5", className)}
      data-slot="app-topbar-utilities-bar"
      role="toolbar"
    >
      {orderedActions.map((action) => {
        const isPinDraggable = draggable && action.draggable !== false;
        const isDragging = isPinDraggable && draggingId === action.id;
        const isDropTarget =
          isPinDraggable &&
          dropTargetId === action.id &&
          draggingId !== null &&
          draggingId !== action.id;

        return (
          <TopbarUtilityPin
            action={action}
            draggable={isPinDraggable}
            isDragging={isDragging}
            isDropTarget={isDropTarget}
            key={action.id}
            onDragEnd={() => {
              setDraggingId(null);
              setDropTargetId(null);
              suppressClickRef.current = true;
            }}
            onDragLeave={() => {
              setDropTargetId((current) =>
                current === action.id ? null : current
              );
            }}
            onDragOver={(event) => {
              if (!isPinDraggable || draggingId === action.id) {
                return;
              }

              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
              setDropTargetId(action.id);
            }}
            onDragStart={(event) => {
              if (!isPinDraggable) {
                return;
              }

              suppressClickRef.current = false;
              setDraggingId(action.id);
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", action.id);
            }}
            onDrop={(event) => {
              if (!isPinDraggable) {
                return;
              }

              event.preventDefault();
              const draggedId = event.dataTransfer.getData("text/plain");

              if (!draggedId || draggedId === action.id) {
                setDraggingId(null);
                setDropTargetId(null);
                return;
              }

              commitOrder(reorderUtilityIds(cappedOrder, draggedId, action.id));
              setDraggingId(null);
              setDropTargetId(null);
              suppressClickRef.current = true;
            }}
            onSelect={() => {
              if (suppressClickRef.current) {
                suppressClickRef.current = false;
                return;
              }

              action.onSelect?.();
            }}
            tooltipsDisabled={tooltipsDisabled}
          >
            {action.id === "notifications" && notifications ? (
              <TopbarNotifications
                action={action}
                notifications={notifications}
              />
            ) : undefined}
          </TopbarUtilityPin>
        );
      })}
    </div>
  );
}
