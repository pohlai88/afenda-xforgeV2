import type {
  AfendaAppSidebarNavIconKeysOf,
  AfendaAppSidebarNavIconRegistry,
} from "@repo/design-system";
import {
  LayoutDashboardIcon,
  SettingsIcon,
  ShieldIcon,
} from "lucide-react";

export const storyAppShellSidebarNavIconRegistry = {
  "layout-dashboard": LayoutDashboardIcon,
  settings: SettingsIcon,
  shield: ShieldIcon,
} satisfies AfendaAppSidebarNavIconRegistry;

export type StoryAppShellSidebarNavIconKey = AfendaAppSidebarNavIconKeysOf<
  typeof storyAppShellSidebarNavIconRegistry
>;
