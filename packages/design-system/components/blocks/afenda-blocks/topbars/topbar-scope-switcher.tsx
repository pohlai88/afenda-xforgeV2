"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@repo/design-system/components/afenda-ui/menubar";
import { cn } from "@repo/design-system/lib/utils";
import {
  topbarScopeCaptionClass,
  topbarScopeTriggerClass,
  topbarScopeValueClass,
} from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-recipes";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { TopbarTooltip } from "./topbar-tooltip";
import type { TopbarScopeSwitcherProps } from "./topbar-types";

export function TopbarScopeSwitcher({
  activeOptionId,
  className,
  description,
  label,
  onSelect,
  options,
  scopeId,
}: TopbarScopeSwitcherProps) {
  const activeOption =
    options.find((option) => option.id === activeOptionId) ?? options[0];
  const tooltipDescription =
    description ?? `Choose the active ${label.toLowerCase()} for this workspace.`;

  return (
    <Menubar className={cn("h-auto w-auto border-0 bg-transparent p-0", className)}>
      <MenubarMenu>
        <TopbarTooltip
          description={tooltipDescription}
          label={`Switch ${label.toLowerCase()}`}
        >
          <MenubarTrigger
            aria-label={`Switch ${label.toLowerCase()}`}
            className={topbarScopeTriggerClass}
            data-slot={`app-topbar-${scopeId}-switcher`}
          >
            <span className="grid min-w-0 flex-1 gap-0 text-left">
              <span className={topbarScopeCaptionClass}>{label}</span>
              <span className={topbarScopeValueClass}>
                {activeOption?.label ?? `Select ${label.toLowerCase()}`}
              </span>
            </span>
            <ChevronDownIcon
              aria-hidden="true"
              className="size-3.5 shrink-0 text-sidebar-foreground/55"
            />
          </MenubarTrigger>
        </TopbarTooltip>
        <MenubarContent align="start" className="w-52">
          {options.length === 0 ? (
            <MenubarItem disabled>No {label.toLowerCase()} options</MenubarItem>
          ) : (
            options.map((option) => (
              <MenubarItem
                className="gap-2"
                key={option.id}
                onSelect={() => {
                  if (option.id === activeOptionId) {
                    return;
                  }

                  onSelect?.(option.id);
                }}
              >
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                {option.id === activeOptionId ? (
                  <CheckIcon aria-hidden="true" className="size-4 shrink-0" />
                ) : null}
              </MenubarItem>
            ))
          )}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
