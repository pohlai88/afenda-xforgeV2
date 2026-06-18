"use client";

import * as React from "react";
import { AppSidebar } from "../app-sidebar";
import { ChartAreaInteractive } from "../chart-area-interactive";
import { DataTable } from "../data-table";
import { NavTopbar, NAV_TOPBAR_HEIGHT } from "../nav-topbar";
import { SectionCards } from "../section-cards";
import { SiteHeader } from "../site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "../../../../afenda-ui/sidebar";
import data from "./data.json";

export function DashboardPage() {
  return (
    <SidebarProvider
      style={
        {
          "--dashboard-nav-topbar-height": NAV_TOPBAR_HEIGHT,
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <div className="flex min-h-svh flex-col">
        <NavTopbar />
        <div className="flex min-h-0 flex-1">
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader showSidebarTrigger={false} />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  <SectionCards />
                  <div className="px-4 lg:px-6">
                    <ChartAreaInteractive />
                  </div>
                  <DataTable data={data} />
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
