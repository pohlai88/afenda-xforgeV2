"use client";

import type { z } from "zod";
import { cn } from "../../../../../lib/utils";
import { blockRecipe } from "../../../block-recipes";
import { AfendaAppShell, AfendaAppSidebar } from "../../afenda-appshell";
import type { schema } from "../data-table";
import {
  DashboardContent,
  type DashboardContentProps,
} from "./dashboard-content";
import { dashboardDemoSidebarNavDescriptor } from "./dashboard-demo-nav.descriptor";
import { dashboardDemoSidebarNavIconRegistry } from "./dashboard-demo-nav.registry";

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
    <AfendaAppShell
      sidebar={
        <AfendaAppSidebar
          navDescriptor={dashboardDemoSidebarNavDescriptor}
          navIconRegistry={dashboardDemoSidebarNavIconRegistry}
          pathname="/dashboard"
        />
      }
    >
      <DashboardContent {...props} />
    </AfendaAppShell>
  );
}

export type { DashboardPageTableRow };
