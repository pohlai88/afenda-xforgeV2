/** @internal Storybook / dashboard-01 demo only — sidebar navigation fixtures. */

import {
  CameraIcon,
  ChartBarIcon,
  DatabaseIcon,
  FileTextIcon,
  FolderIcon,
  GalleryVerticalEndIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";
import type {
  NavDocumentsItem,
  NavMainItem,
  NavSecondaryItem,
  NavStartedItem,
} from "../nav/dashboard-nav-types";
import { DASHBOARD_SIDEBAR_DEFAULT_BRAND_LABEL } from "./dashboard-sidebar-constants";
import type {
  DashboardSidebarBrand,
  DashboardSidebarUser,
} from "./dashboard-sidebar-types";

export const DEMO_DASHBOARD_SIDEBAR_USER: DashboardSidebarUser = {
  displayName: "shadcn",
  email: "m@example.com",
  avatarSrc: "/avatars/shadcn.jpg",
};

export const DEMO_DASHBOARD_SIDEBAR_BRAND: DashboardSidebarBrand = {
  href: "#",
  icon: GalleryVerticalEndIcon,
  label: DASHBOARD_SIDEBAR_DEFAULT_BRAND_LABEL,
};

export const DEMO_DASHBOARD_SIDEBAR_MAIN_ITEMS: readonly NavMainItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "#",
    icon: LayoutDashboardIcon,
  },
  {
    id: "lifecycle",
    label: "Lifecycle",
    href: "#",
    icon: ListIcon,
  },
  {
    id: "analytics",
    label: "Analytics",
    href: "#",
    icon: ChartBarIcon,
  },
  {
    id: "projects",
    label: "Projects",
    href: "#",
    icon: FolderIcon,
  },
  {
    id: "team",
    label: "Team",
    href: "#",
    icon: UsersIcon,
  },
];

export const DEMO_DASHBOARD_SIDEBAR_STARTED_ITEMS: readonly NavStartedItem[] = [
  {
    id: "capture",
    label: "Capture",
    href: "#",
    icon: CameraIcon,
    isActive: true,
    items: [
      { id: "capture-active", label: "Active Proposals", href: "#" },
      { id: "capture-archived", label: "Archived", href: "#" },
    ],
  },
  {
    id: "proposal",
    label: "Proposal",
    href: "#",
    icon: FileTextIcon,
    items: [
      { id: "proposal-active", label: "Active Proposals", href: "#" },
      { id: "proposal-archived", label: "Archived", href: "#" },
    ],
  },
  {
    id: "prompts",
    label: "Prompts",
    href: "#",
    icon: SparklesIcon,
    items: [
      { id: "prompts-active", label: "Active Proposals", href: "#" },
      { id: "prompts-archived", label: "Archived", href: "#" },
    ],
  },
];

export const DEMO_DASHBOARD_SIDEBAR_DOCUMENTS: readonly NavDocumentsItem[] = [
  {
    id: "data-library",
    label: "Data Library",
    href: "#",
    icon: DatabaseIcon,
  },
  {
    id: "reports",
    label: "Reports",
    href: "#",
    icon: FileTextIcon,
  },
  {
    id: "word-assistant",
    label: "Word Assistant",
    href: "#",
    icon: FileTextIcon,
  },
];

export const DEMO_DASHBOARD_SIDEBAR_SECONDARY_ITEMS: readonly NavSecondaryItem[] =
  [
    {
      id: "settings",
      label: "Settings",
      href: "#",
      icon: SettingsIcon,
    },
    {
      id: "help",
      label: "Get Help",
      href: "#",
      icon: HelpCircleIcon,
    },
    {
      id: "search",
      label: "Search",
      href: "#",
      icon: SearchIcon,
    },
  ];
