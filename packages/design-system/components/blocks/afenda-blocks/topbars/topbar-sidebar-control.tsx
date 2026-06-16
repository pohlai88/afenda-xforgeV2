"use client";

import { SidebarControlMenu } from "../../../afenda-ui/sidebar";
import { cn } from "@repo/design-system/lib/utils";
import { topbarIconActionClass } from "./topbar-recipes";
import type { TopbarSidebarControlProps } from "./topbar-types";

export function TopbarSidebarControl({
  align = "start",
  className,
  menuLabel,
  side = "bottom",
  triggerLabel,
}: TopbarSidebarControlProps) {
  return (
    <SidebarControlMenu
      align={align}
      className={cn(topbarIconActionClass, className)}
      menuLabel={menuLabel}
      side={side}
      triggerLabel={triggerLabel}
    />
  );
}
