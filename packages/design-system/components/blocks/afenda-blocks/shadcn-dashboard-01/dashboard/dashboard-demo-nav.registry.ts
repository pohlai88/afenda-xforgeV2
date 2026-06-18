import type {
  AfendaAppSidebarNavIconKeysOf,
  AfendaAppSidebarNavIconRegistry,
} from "../../afenda-appshell/sidebar/sidebar-nav-descriptors";
import {
  LayoutDashboardIcon,
  SettingsIcon,
  ShieldIcon,
} from "lucide-react";

export const dashboardDemoSidebarNavIconRegistry = {
  "layout-dashboard": LayoutDashboardIcon,
  settings: SettingsIcon,
  shield: ShieldIcon,
} satisfies AfendaAppSidebarNavIconRegistry;

export type DashboardDemoSidebarNavIconKey = AfendaAppSidebarNavIconKeysOf<
  typeof dashboardDemoSidebarNavIconRegistry
>;
