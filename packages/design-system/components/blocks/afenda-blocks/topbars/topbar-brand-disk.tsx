"use client";

import {
  TOPBAR_DEFAULT_BRAND_ARIA_LABEL,
  TOPBAR_DEFAULT_BRAND_DESCRIPTION,
} from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-constants";
import { topbarBrandDiskClass } from "@repo/design-system/components/blocks/afenda-blocks/topbars/topbar-recipes";
import { cn } from "@repo/design-system/lib/utils";
import { Building2Icon } from "lucide-react";
import { TopbarTooltip } from "./topbar-tooltip";
import type { TopbarBrandDiskProps } from "./topbar-types";

export function TopbarBrandDisk({
  ariaLabel = TOPBAR_DEFAULT_BRAND_ARIA_LABEL,
  className,
  description = TOPBAR_DEFAULT_BRAND_DESCRIPTION,
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
