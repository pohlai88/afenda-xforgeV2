"use client";

import { cn } from "@repo/design-system/lib/utils";
import { Building2Icon } from "lucide-react";
import { topbarBrandDiskClass } from "./topbar-recipes";
import { TopbarTooltip } from "./topbar-tooltip";
import type { TopbarBrandDiskProps } from "./topbar-types";

export function TopbarBrandDisk({
  ariaLabel = "Afenda workspace",
  className,
  description = "Signed-in operator workspace.",
  icon = <Building2Icon aria-hidden="true" className="size-4" />,
  tooltip,
}: TopbarBrandDiskProps) {
  const disk = (
    <span
      aria-label={ariaLabel}
      className={cn(topbarBrandDiskClass, className)}
      data-slot="app-topbar-brand-disk"
      role="img"
    >
      {icon}
    </span>
  );

  if (!tooltip) {
    return disk;
  }

  return (
    <TopbarTooltip description={description} label={tooltip}>
      {disk}
    </TopbarTooltip>
  );
}
