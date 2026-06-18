"use client";

import {
  SidebarControlMenu,
  SidebarMenuItem,
} from "../../../afenda-ui/sidebar";

export function SidebarFooterTrailingControl() {
  return (
    <SidebarMenuItem className="shrink-0 group-data-[collapsible=icon]:w-full">
      <SidebarControlMenu align="center" side="top" />
    </SidebarMenuItem>
  );
}
