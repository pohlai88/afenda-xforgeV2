"use client";

import type { z } from "zod";
import { blockRecipe } from "../../../block-recipes";
import { cn } from "../../../../../lib/utils";
import { AfendaAppShell } from "../../afenda-appshell";
import { schema } from "../data-table";
import { DashboardContent, type DashboardContentProps } from "./dashboard-content";

type DashboardPageTableRow = z.infer<typeof schema>;

export interface DashboardPageProps extends DashboardContentProps {}

export function DashboardPage(props: DashboardPageProps) {
  return (
    <div className={cn(blockRecipe("blockShell"))} data-slot="dashboard-page">
      <DashboardContent {...props} />
    </div>
  );
}

export interface DashboardDemoPageProps extends DashboardContentProps {}

export function DashboardDemoPage(props: DashboardDemoPageProps) {
  return (
    <AfendaAppShell>
      <DashboardContent {...props} />
    </AfendaAppShell>
  );
}

export type { DashboardPageTableRow };
