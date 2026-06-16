import {
  DEFAULT_ERP_ACTIONS_MENU_ITEMS,
  DEFAULT_ERP_UTILITIES_MARKET_ITEMS,
} from "@repo/design-system/components/blocks/afenda-blocks/topbars";
import type { DashboardNavTopbarProps } from "./dashboard-topbar-types";

export const DEFAULT_DASHBOARD_NAV_TOPBAR_ENABLED_UTILITY_IDS = [
  "shortcuts",
  "notifications",
  "tasks",
  "reports",
  "messenger",
  "settings",
] as const;

const demoDashboardScopeSwitchers = [
  {
    id: "organization",
    label: "Organization",
    description: "Tenant scope for reads, writes, and audit evidence.",
    activeOptionId: "org-vf",
    options: [
      { id: "org-vf", label: "Vietnam Feed Co." },
      { id: "org-apac", label: "APAC Holdings" },
    ],
  },
  {
    id: "department",
    label: "Department",
    description: "Functional area within the active organization.",
    activeOptionId: "dept-brand",
    options: [
      { id: "dept-brand", label: "Brand Systems" },
      { id: "dept-erp", label: "ERP Surfaces" },
    ],
  },
  {
    id: "team",
    label: "Team",
    description: "Working group for queue ownership and approvals.",
    activeOptionId: "team-design",
    options: [
      { id: "team-design", label: "Design Ops" },
      { id: "team-product", label: "Product UX" },
    ],
  },
  {
    id: "project",
    label: "Project",
    description: "Time-bound initiative or delivery track.",
    activeOptionId: "proj-rail",
    options: [
      { id: "proj-rail", label: "Workspace Rail" },
      { id: "proj-scorecard", label: "Scorecard Gate" },
    ],
  },
] as const;

const DEMO_DASHBOARD_NAV_TOPBAR_USER = {
  avatarFallback: "AF",
  displayName: "Afenda Operator",
  email: "operator@afenda.example",
} as const;

const demoDashboardNotifications = [
  {
    id: "notif-approval-1",
    title: "Approval queue breached SLA",
    body: "Northwind APAC has 4 approvals waiting longer than 2 hours.",
    scope: "team",
    timeLabel: "4m",
    unread: true,
  },
  {
    id: "notif-follow-1",
    title: "Evidence packet needs your review",
    body: "June payroll packet is missing two supporting bank files.",
    scope: "following",
    timeLabel: "19m",
    unread: true,
  },
  {
    id: "notif-inbox-1",
    title: "Posting batch completed",
    body: "Batch POST-2026-06-18 reconciled without variance.",
    scope: "inbox",
    timeLabel: "1h",
  },
  {
    id: "notif-team-2",
    title: "Webhook delivery retried",
    body: "ERP sync recovered after the second delivery attempt.",
    scope: "team",
    timeLabel: "2h",
  },
] as const;

export const DEMO_DASHBOARD_NAV_TOPBAR_PROPS = {
  brand: {
    ariaLabel: "Afenda",
    description: "Afenda workspace identity.",
    className:
      "size-7 place-items-stretch overflow-hidden border-0 bg-transparent p-0",
    icon: (
      <img
        alt=""
        aria-hidden="true"
        className="block size-full object-contain"
        src="/afenda-brand/afenda-icon-180-transparent.png"
      />
    ),
  },
  sidebarControl: true,
  scopeSwitchers: demoDashboardScopeSwitchers,
  utilitiesRail: {
    catalog: DEFAULT_ERP_UTILITIES_MARKET_ITEMS,
    defaultEnabledIds: DEFAULT_DASHBOARD_NAV_TOPBAR_ENABLED_UTILITY_IDS,
    enabledIds: [...DEFAULT_DASHBOARD_NAV_TOPBAR_ENABLED_UTILITY_IDS],
    notifications: {
      items: demoDashboardNotifications,
    },
    order: [...DEFAULT_DASHBOARD_NAV_TOPBAR_ENABLED_UTILITY_IDS],
    requestUtilityTitle: "Request utility shortcut",
    requestUtilityNote:
      "Describe the shortcut or tool operators need in the workspace chrome.",
    actionsMenu: {
      actions: DEFAULT_ERP_ACTIONS_MENU_ITEMS,
    },
  },
} satisfies DashboardNavTopbarProps;
