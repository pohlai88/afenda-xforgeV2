"use client";

import * as React from "react";
import type { z } from "zod";
import { blockRecipe } from "../../../block-recipes";
import { cn } from "../../../../../lib/utils";
import { ChartAreaInteractive } from "../chart-area-interactive";
import { DataTable, schema } from "../data-table";
import { SectionCards } from "../section-cards";
import {
  dashboardPageChartWrapperClass,
  dashboardPageContentStackClass,
  dashboardPageMainStackClass,
} from "../dashboard-recipes";
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
