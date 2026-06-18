"use client";

import { Button } from "../../../../afenda-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../afenda-ui/dropdown-menu";
import { Input } from "../../../../afenda-ui/input";
import { Switch } from "../../../../afenda-ui/switch";
import { TOPBAR_FIXED_UTILITY_SLOTS } from "./topbar-constants";
import { topbarIconActionClass } from "./topbar-recipes";
import { cn } from "../../../../../lib/utils";
import { GripVerticalIcon, SearchIcon, StoreIcon } from "lucide-react";
import { type DragEvent, memo, useMemo, useState } from "react";
import { TopbarTooltip } from "./topbar-tooltip";
import type { TopbarUtilitiesMarketProps } from "./topbar-types";
import { TopbarUtilitiesRequestForm } from "./topbar-utilities-request-form";

const WHITESPACE_PATTERN = /\s+/;

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

interface MarketCatalogRowProps {
  readonly atPinLimit: boolean;
  readonly draggable: boolean;
  readonly enabled: boolean;
  readonly isDragging: boolean;
  readonly isDropTarget: boolean;
  readonly item: TopbarUtilitiesMarketProps["catalog"][number];
  readonly onDragEnd: () => void;
  readonly onDragLeave: () => void;
  readonly onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  readonly onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  readonly onDrop: (event: DragEvent<HTMLDivElement>) => void;
  readonly onEnabledChange: TopbarUtilitiesMarketProps["onEnabledChange"];
}

function catalogRowMatchesFilter(
  item: TopbarUtilitiesMarketProps["catalog"][number],
  query: string
): boolean {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return true;
  }

  const haystack = [
    item.label,
    item.description ?? "",
    item.id.replaceAll("-", " "),
    ...(item.searchAliases ?? []),
  ]
    .join(" ")
    .toLowerCase();
  const tokens = trimmed.split(WHITESPACE_PATTERN).filter(Boolean);

  return tokens.every((token) => haystack.includes(token));
}

const MarketCatalogRow = memo(function MarketCatalogRow({
  atPinLimit,
  draggable,
  enabled,
  item,
  onEnabledChange,
  onDragEnd,
  onDragLeave,
  onDragOver,
  onDragStart,
  onDrop,
  isDragging,
  isDropTarget,
}: MarketCatalogRowProps) {
  return (
    <>
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: Native drag/drop events live on the draggable catalog row while selection remains on child controls. */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: Draggable catalog row needs drag/drop handlers for pointer reordering. */}
      <div
        className={cn(
          "group relative rounded-md transition-[opacity,box-shadow,transform] duration-120 ease-out motion-reduce:transition-none",
          draggable && "cursor-move active:cursor-move",
          isDragging && "opacity-60",
          isDropTarget &&
            "after:absolute after:inset-y-1 after:-right-0.5 after:w-0.5 after:rounded-full after:bg-brand-primary/70"
        )}
        draggable={draggable}
        onDragEnd={onDragEnd}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDragStart={onDragStart}
        onDrop={onDrop}
      >
        <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
          <span className="grid size-5 shrink-0 place-items-center text-text-tertiary">
            <GripVerticalIcon aria-hidden="true" className="size-3.5" />
          </span>
          <span className="grid size-7 shrink-0 place-items-center rounded-md border border-border-subtle bg-surface-muted/40">
            {item.icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-[12px]">{item.label}</p>
            {item.description ? (
              <p className="truncate text-[10px] text-text-tertiary">
                {item.description}
              </p>
            ) : null}
          </div>
          <Switch
            aria-label={`${enabled ? "Remove" : "Pin"} ${item.label}`}
            checked={enabled}
            disabled={atPinLimit}
            onCheckedChange={(checked) => {
              onEnabledChange(item.id, checked);
            }}
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
          />
        </div>
      </div>
    </>
  );
});

export function TopbarUtilitiesMarket({
  catalog,
  className,
  description = "Pin utilities to the topbar or request a new shortcut.",
  enabledIds,
  label = "Utilities market",
  maxPinnedSlots,
  maxTotalSlots,
  menuLabel = "Open utilities market",
  onEnabledChange,
  onOrderChange,
  onOpenChange,
  order,
  onRequestUtility,
  open,
  requestUtilityFeaturesLabel,
  requestUtilityNameLabel,
  requestUtilityNote,
  requestUtilitySendLabel,
  requestUtilityTitle,
}: TopbarUtilitiesMarketProps) {
  const [query, setQuery] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const enabledIdSet = useMemo(() => new Set(enabledIds), [enabledIds]);
  const normalizedQuery = query.trim().toLowerCase();
  const enabledCount = enabledIds.length;
  const onBarTotal = enabledCount + TOPBAR_FIXED_UTILITY_SLOTS;
  const atPinLimit = enabledCount >= maxPinnedSlots;
  const resolvedOrder = useMemo(() => {
    if (!order || order.length === 0) {
      return catalog.map((item) => item.id);
    }

    const orderedIds = order.filter((id) =>
      catalog.some((item) => item.id === id)
    );
    const missingIds = catalog
      .map((item) => item.id)
      .filter((id) => !orderedIds.includes(id));

    return [...orderedIds, ...missingIds];
  }, [catalog, order]);
  const orderedCatalog = useMemo(() => {
    const itemById = new Map(catalog.map((item) => [item.id, item]));
    return resolvedOrder
      .map((id) => itemById.get(id))
      .filter(
        (item): item is TopbarUtilitiesMarketProps["catalog"][number] =>
          item !== undefined
      );
  }, [catalog, resolvedOrder]);
  const filteredCatalog = useMemo(() => {
    if (!normalizedQuery) {
      return orderedCatalog;
    }

    return orderedCatalog.filter((item) =>
      catalogRowMatchesFilter(item, normalizedQuery)
    );
  }, [normalizedQuery, orderedCatalog]);
  const pinnedItems = useMemo(
    () => filteredCatalog.filter((item) => enabledIdSet.has(item.id)),
    [enabledIdSet, filteredCatalog]
  );
  const availableItems = useMemo(
    () => filteredCatalog.filter((item) => !enabledIdSet.has(item.id)),
    [enabledIdSet, filteredCatalog]
  );

  if (catalog.length === 0) {
    return null;
  }

  return (
    <DropdownMenu onOpenChange={onOpenChange} open={open}>
      <TopbarTooltip description={description} label={label}>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={menuLabel}
            className={cn(topbarIconActionClass, className)}
            data-slot="app-topbar-utilities-market-trigger"
            size="icon-sm"
            type="button"
            variant="quiet"
          >
            <StoreIcon aria-hidden="true" className="size-4" />
          </Button>
        </DropdownMenuTrigger>
      </TopbarTooltip>
      <DropdownMenuContent
        align="end"
        className="w-72 p-0"
        data-slot="app-topbar-utilities-market-content"
      >
        <div className="border-border-default border-b px-3 py-2.5">
          <DropdownMenuLabel className="p-0 font-medium text-[11px] text-text-secondary uppercase tracking-[0.08em]">
            Utilities market
          </DropdownMenuLabel>
          <p className="mt-1 text-[11px] text-text-tertiary leading-snug">
            {catalog.length} available · {maxPinnedSlots} pin slots ·{" "}
            {onBarTotal}/{maxTotalSlots} on bar
          </p>
          <p className="text-[10px] text-text-tertiary leading-snug">
            {enabledCount} pinned · {TOPBAR_FIXED_UTILITY_SLOTS} fixed (market,
            menu)
          </p>
          <p className="text-[10px] text-text-tertiary leading-snug">
            Drag here or on the topbar to reorder.
          </p>
          <div className="relative mt-2">
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-text-tertiary"
            />
            <Input
              aria-label="Search utilities"
              autoFocus
              className="h-8 rounded-lg border-border-subtle bg-surface-muted/35 ps-8 text-[12px] shadow-none placeholder:text-text-tertiary focus-visible:border-sidebar-ring/35 focus-visible:ring-0"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search utilities..."
              type="search"
              value={query}
            />
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto p-1">
          {filteredCatalog.length > 0 ? (
            <>
              {pinnedItems.length > 0 ? (
                <div className="px-2 pt-2 pb-1 font-medium text-[10px] text-text-tertiary uppercase tracking-[0.08em]">
                  Pinned on topbar
                </div>
              ) : null}
              {pinnedItems.map((item) => (
                <MarketCatalogRow
                  atPinLimit={atPinLimit && !enabledIdSet.has(item.id)}
                  draggable={!normalizedQuery}
                  enabled={enabledIdSet.has(item.id)}
                  isDragging={draggingId === item.id}
                  isDropTarget={
                    dropTargetId === item.id &&
                    draggingId !== null &&
                    draggingId !== item.id
                  }
                  item={item}
                  key={item.id}
                  onDragEnd={() => {
                    setDraggingId(null);
                    setDropTargetId(null);
                  }}
                  onDragLeave={() => {
                    setDropTargetId((current) =>
                      current === item.id ? null : current
                    );
                  }}
                  onDragOver={(event) => {
                    if (normalizedQuery || draggingId === item.id) {
                      return;
                    }

                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                    setDropTargetId(item.id);
                  }}
                  onDragStart={(event) => {
                    if (normalizedQuery) {
                      return;
                    }

                    setDraggingId(item.id);
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", item.id);
                  }}
                  onDrop={(event) => {
                    if (normalizedQuery) {
                      return;
                    }

                    event.preventDefault();
                    const draggedId = event.dataTransfer.getData("text/plain");

                    if (!draggedId || draggedId === item.id) {
                      setDraggingId(null);
                      setDropTargetId(null);
                      return;
                    }

                    onOrderChange?.(
                      reorderUtilityIds(resolvedOrder, draggedId, item.id)
                    );
                    setDraggingId(null);
                    setDropTargetId(null);
                  }}
                  onEnabledChange={onEnabledChange}
                />
              ))}
              {availableItems.length > 0 ? (
                <div className="px-2 pt-3 pb-1 font-medium text-[10px] text-text-tertiary uppercase tracking-[0.08em]">
                  Available utilities
                </div>
              ) : null}
              {availableItems.map((item) => (
                <MarketCatalogRow
                  atPinLimit={atPinLimit && !enabledIdSet.has(item.id)}
                  draggable={!normalizedQuery}
                  enabled={enabledIdSet.has(item.id)}
                  isDragging={draggingId === item.id}
                  isDropTarget={
                    dropTargetId === item.id &&
                    draggingId !== null &&
                    draggingId !== item.id
                  }
                  item={item}
                  key={item.id}
                  onDragEnd={() => {
                    setDraggingId(null);
                    setDropTargetId(null);
                  }}
                  onDragLeave={() => {
                    setDropTargetId((current) =>
                      current === item.id ? null : current
                    );
                  }}
                  onDragOver={(event) => {
                    if (normalizedQuery || draggingId === item.id) {
                      return;
                    }

                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                    setDropTargetId(item.id);
                  }}
                  onDragStart={(event) => {
                    if (normalizedQuery) {
                      return;
                    }

                    setDraggingId(item.id);
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", item.id);
                  }}
                  onDrop={(event) => {
                    if (normalizedQuery) {
                      return;
                    }

                    event.preventDefault();
                    const draggedId = event.dataTransfer.getData("text/plain");

                    if (!draggedId || draggedId === item.id) {
                      setDraggingId(null);
                      setDropTargetId(null);
                      return;
                    }

                    onOrderChange?.(
                      reorderUtilityIds(resolvedOrder, draggedId, item.id)
                    );
                    setDraggingId(null);
                    setDropTargetId(null);
                  }}
                  onEnabledChange={onEnabledChange}
                />
              ))}
            </>
          ) : (
            <div className="px-2 py-6 text-center text-[11px] text-text-tertiary">
              No utilities match that search.
            </div>
          )}
        </div>
        <DropdownMenuSeparator className="my-0" />
        <TopbarUtilitiesRequestForm
          featuresLabel={requestUtilityFeaturesLabel}
          nameLabel={requestUtilityNameLabel}
          note={requestUtilityNote}
          onSubmit={onRequestUtility}
          sendLabel={requestUtilitySendLabel}
          title={requestUtilityTitle}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
