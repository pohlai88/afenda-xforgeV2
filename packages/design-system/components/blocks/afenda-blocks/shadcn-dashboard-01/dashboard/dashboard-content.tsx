"use client";

import type { z } from "zod";
import { cn } from "../../../../../lib/utils";
import { blockRecipe } from "../../../block-recipes";
import { ChartAreaInteractive } from "../chart-area-interactive";
import {
  dashboardPageChartWrapperClass,
  dashboardPageContentStackClass,
  dashboardPageMainStackClass,
} from "../dashboard-recipes";
import { DataTable, type schema } from "../data-table";
import { SectionCards } from "../section-cards";
import data from "./data.json";

type DashboardPageTableRow = z.infer<typeof schema>;

export interface DashboardContentProps {
  readonly tableData?: readonly DashboardPageTableRow[];
}

export function DashboardContent({ tableData = data }: DashboardContentProps) {
  return (
    <div className={cn(dashboardPageMainStackClass)} data-slot="dashboard-body">
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
        <DataTable data={[...tableData]} />
      </div>
    </div>
  );
}

export type { DashboardPageTableRow };
