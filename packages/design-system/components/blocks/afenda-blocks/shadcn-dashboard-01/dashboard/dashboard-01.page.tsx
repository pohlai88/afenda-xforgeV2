"use client";

import * as React from "react";
import { AppSidebar } from "../app-sidebar";
import { ChartAreaInteractive } from "../chart-area-interactive";
import { DataTable } from "../data-table";
import { SectionCards } from "../section-cards";
import { SiteHeader } from "../site-header";
import { blockRecipe } from "../../../block-recipes";
import { cn } from "../../../../../lib/utils";
import {
  dashboardPageChartWrapperClass,
  dashboardPageContentStackClass,
  dashboardPageInsetStackClass,
  dashboardPageMainStackClass,
} from "../dashboard-recipes";
import {
  SidebarInset,
  SidebarProvider,
} from "../../../../afenda-ui/sidebar";
import data from "./data.json";

export function DashboardPage() {
  return (
    <SidebarProvider
      data-slot="dashboard-page"
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className={cn(blockRecipe("blockStage"))}>
        <SiteHeader />
        <div className={cn(dashboardPageInsetStackClass)}>
          <div className={cn(dashboardPageMainStackClass)}>
            <div
              className={cn(
                blockRecipe("blockStack"),
                dashboardPageContentStackClass
              )}
            >
              <SectionCards />
              <div className={cn(dashboardPageChartWrapperClass)}>
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
