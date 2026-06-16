"use client";

import { Kbd } from "@repo/design-system/components/afenda-ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/design-system/components/afenda-ui/tooltip";
import { cn } from "@repo/design-system/lib/utils";
import type { ReactNode } from "react";

export interface TopbarTooltipProps {
  readonly children: ReactNode;
  readonly description?: string;
  readonly disabled?: boolean;
  readonly label: string;
  readonly shortcut?: string;
  readonly side?: "bottom" | "left" | "right" | "top";
}

export function TopbarTooltip({
  children,
  description,
  disabled = false,
  label,
  shortcut,
  side = "bottom",
}: TopbarTooltipProps) {
  if (disabled) {
    return children;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        className="grid max-w-56 gap-1 px-2 py-1.5"
        side={side}
        sideOffset={8}
      >
        <span className="font-medium text-[11px] leading-4">{label}</span>
        {description ? (
          <span className="text-[10px] text-text-inverse/75 leading-snug">
            {description}
          </span>
        ) : null}
        {shortcut ? (
          <Kbd
            className={cn(
              "h-4 w-fit border-border-subtle/40 bg-surface-inverse/20 px-1",
              "font-mono text-[9px] text-text-inverse/90 tabular-nums"
            )}
          >
            {shortcut}
          </Kbd>
        ) : null}
      </TooltipContent>
    </Tooltip>
  );
}
