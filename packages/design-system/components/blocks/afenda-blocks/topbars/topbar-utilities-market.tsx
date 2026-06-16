"use client";

import { memo, useMemo } from "react";
import { Button } from "@repo/design-system/components/afenda-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/design-system/components/afenda-ui/dropdown-menu";
import { Switch } from "@repo/design-system/components/afenda-ui/switch";
import { cn } from "@repo/design-system/lib/utils";
import { LayoutGridIcon } from "lucide-react";
import { TOPBAR_FIXED_UTILITY_SLOTS } from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-constants";
import { topbarIconActionClass } from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-recipes";
import { TopbarTooltip } from "./topbar-tooltip";
import { TopbarUtilitiesRequestForm } from "./topbar-utilities-request-form";
import type { TopbarUtilitiesMarketProps } from "./topbar-types";

interface MarketCatalogRowProps {
  readonly atPinLimit: boolean;
  readonly enabled: boolean;
  readonly item: TopbarUtilitiesMarketProps["catalog"][number];
  readonly onEnabledChange: TopbarUtilitiesMarketProps["onEnabledChange"];
}

const MarketCatalogRow = memo(function MarketCatalogRow({
  atPinLimit,
  enabled,
  item,
  onEnabledChange,
}: MarketCatalogRowProps) {
  return (
    <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
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
      />
    </div>
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
  onRequestUtility,
  requestUtilityFeaturesLabel,
  requestUtilityNameLabel,
  requestUtilityNote,
  requestUtilitySendLabel,
  requestUtilityTitle,
}: TopbarUtilitiesMarketProps) {
  const enabledIdSet = useMemo(() => new Set(enabledIds), [enabledIds]);
  const enabledCount = enabledIds.length;
  const onBarTotal = enabledCount + TOPBAR_FIXED_UTILITY_SLOTS;
  const atPinLimit = enabledCount >= maxPinnedSlots;

  if (catalog.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
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
            <LayoutGridIcon aria-hidden="true" className="size-4" />
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
            {catalog.length} available · {maxPinnedSlots} pin slots · {onBarTotal}/
            {maxTotalSlots} on bar
          </p>
          <p className="text-[10px] text-text-tertiary leading-snug">
            {enabledCount} pinned · {TOPBAR_FIXED_UTILITY_SLOTS} fixed (market, account,
            menu)
          </p>
        </div>
        <div className="max-h-64 overflow-y-auto p-1">
          {catalog.map((item) => (
            <MarketCatalogRow
              atPinLimit={atPinLimit && !enabledIdSet.has(item.id)}
              enabled={enabledIdSet.has(item.id)}
              item={item}
              key={item.id}
              onEnabledChange={onEnabledChange}
            />
          ))}
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
