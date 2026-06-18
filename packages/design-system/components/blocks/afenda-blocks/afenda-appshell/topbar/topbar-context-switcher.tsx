"use client";

import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { blockRecipe } from "../../../block-recipes";
import { Button } from "../../../../afenda-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../../afenda-ui/dropdown-menu";
import { cn } from "../../../../../lib/utils";
import {
  APP_TOPBAR_SWITCHER_MAX_CHARS,
  TOPBAR_CONTEXT_LABELS,
  TOPBAR_CONTEXT_SCOPE_INDICATORS,
  TOPBAR_SWITCHER_CONTENT_SLOTS,
  TOPBAR_SWITCHER_TRIGGER_SLOTS,
} from "./topbar-constants";
import {
  topbarSwitcherButtonClass,
  topbarSwitcherButtonGroupClass,
  topbarSwitcherChevronClass,
  topbarSwitcherMenuClass,
  topbarSwitcherScopeLabelClass,
  topbarSwitcherStackClass,
  topbarSwitcherValueClass,
} from "./topbar-recipes";
import type { TopbarContextSwitcherProps } from "./topbar-types";

function truncateSwitcherLabel(value: string): string {
  if (value.length <= APP_TOPBAR_SWITCHER_MAX_CHARS) {
    return value;
  }

  return `${value.slice(0, APP_TOPBAR_SWITCHER_MAX_CHARS - 1)}…`;
}

export function TopbarContextSwitcher({
  activeOptionId: activeOptionIdProp,
  defaultOptionId,
  menuLabel,
  onOptionChange,
  options,
  scope,
}: TopbarContextSwitcherProps) {
  const [internalActiveOptionId, setInternalActiveOptionId] = useState(
    defaultOptionId ?? options[0]?.id
  );
  const activeOptionId = activeOptionIdProp ?? internalActiveOptionId;
  const activeOption =
    options.find((option) => option.id === activeOptionId) ?? options[0];
  const resolvedMenuLabel = menuLabel ?? TOPBAR_CONTEXT_LABELS[scope];
  const scopeIndicator = TOPBAR_CONTEXT_SCOPE_INDICATORS[scope];

  if (!activeOption) {
    return null;
  }

  return (
    <div data-slot="app-topbar-context-switcher">
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            topbarSwitcherButtonGroupClass,
            blockRecipe("blockToolbar"),
            topbarSwitcherButtonClass
          )}
          data-slot={TOPBAR_SWITCHER_TRIGGER_SLOTS[scope]}
          size="sm"
          type="button"
          variant="quiet"
        >
          <span className={cn(topbarSwitcherStackClass)}>
            <span className={cn(topbarSwitcherScopeLabelClass)}>
              {truncateSwitcherLabel(scopeIndicator)}
            </span>
            <span className={cn(topbarSwitcherValueClass)}>
              {truncateSwitcherLabel(activeOption.name)}
            </span>
          </span>
          <ChevronDownIcon className={cn(topbarSwitcherChevronClass)} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={cn(topbarSwitcherMenuClass)}
        data-slot={TOPBAR_SWITCHER_CONTENT_SLOTS[scope]}
      >
        <DropdownMenuLabel>{resolvedMenuLabel}</DropdownMenuLabel>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.id}
            onSelect={(event) => {
              event.preventDefault();
              if (activeOptionIdProp === undefined) {
                setInternalActiveOptionId(option.id);
              }
              onOptionChange?.(option);
            }}
          >
            {option.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
