"use client";

import {
  SidebarControlMenu,
  SidebarMenuItem,
} from "@repo/design-system/components/afenda-ui/sidebar";

export function SidebarFooterTrailingControl() {
  return (
    <SidebarMenuItem className="shrink-0 group-data-[collapsible=icon]:w-full">
      <SidebarControlMenu align="center" side="top" />
    </SidebarMenuItem>
  );
}
