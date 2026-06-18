"use client";

import { TooltipProvider } from "../../../afenda-ui/tooltip";
import { blockRecipe } from "../../block-recipes";
import { TopbarBrandDisk } from "./topbar/topbar-brand-disk";
import {
  DEFAULT_ERP_ACTIONS_MENU_ITEMS,
  DEFAULT_ERP_UTILITIES_MARKET_ITEMS,
} from "./topbar";
import { TOPBAR_DEFAULT_BRAND_TOOLTIP } from "./topbar/topbar-constants";
import { resolveTopbarSidebarControl } from "./topbar/topbar-helpers";
import { TopbarScopeSwitchers } from "./topbar/topbar-scope-switchers";
import { TopbarSidebarControl } from "./topbar/topbar-sidebar-control";
import type {
  TopbarBrandDiskProps,
  TopbarScopeSwitcherConfig,
  TopbarSidebarControlProps,
  TopbarUtilitiesRailProps,
} from "./topbar/topbar-types";
import { TopbarUtilitiesRail } from "./topbar/topbar-utilities-rail";
import { cn } from "../../../../lib/utils";
import { memo, type ComponentPropsWithoutRef, type ReactNode } from "react";

const NAV_TOPBAR_HEIGHT = "var(--xforge-layout-app-topbar)";

const navTopbarShellClass = [
  blockRecipe("blockShell"),
  "sticky top-0 z-[var(--xforge-z-sticky)] flex h-[var(--dashboard-nav-topbar-height,var(--xforge-layout-app-topbar))] shrink-0 items-center justify-between gap-3 bg-transparent px-4 text-sidebar-foreground antialiased lg:px-6",
].join(" ");

const navTopbarLeftClass = "flex min-w-0 items-center gap-1";

const navTopbarRightClass = "flex shrink-0 items-center justify-end gap-0.5";

const DEFAULT_NAV_TOPBAR_ENABLED_UTILITY_IDS = [
  "shortcuts",
  "notifications",
  "tasks",
  "reports",
  "messenger",
  "settings",
] as const;

const DEFAULT_NAV_TOPBAR_SCOPE_SWITCHERS: readonly TopbarScopeSwitcherConfig[] =
  [
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
  ];

const DEFAULT_NAV_TOPBAR_NOTIFICATIONS = [
  {
    id: "notif-approval-1",
    title: "Approval queue breached SLA",
    body: "Northwind APAC has 4 approvals waiting longer than 2 hours.",
    scope: "team" as const,
    timeLabel: "4m",
    unread: true,
  },
  {
    id: "notif-follow-1",
    title: "Evidence packet needs your review",
    body: "June payroll packet is missing two supporting bank files.",
    scope: "following" as const,
    timeLabel: "19m",
    unread: true,
  },
  {
    id: "notif-inbox-1",
    title: "Posting batch completed",
    body: "Batch POST-2026-06-18 reconciled without variance.",
    scope: "inbox" as const,
    timeLabel: "1h",
  },
  {
    id: "notif-team-2",
    title: "Webhook delivery retried",
    body: "ERP sync recovered after the second delivery attempt.",
    scope: "team" as const,
    timeLabel: "2h",
  },
];

const DEFAULT_NAV_TOPBAR_BRAND: TopbarBrandDiskProps = {
  ariaLabel: "Afenda",
  description: "Afenda workspace identity.",
  className: "size-7 place-items-stretch overflow-hidden border-0 bg-transparent p-0",
  icon: (
    // biome-ignore lint/performance/noImgElement: Design-system demo renders a static public asset without a Next runtime.
    <img
      alt=""
      aria-hidden="true"
      className="block size-full object-contain"
      height={180}
      src="/afenda-brand/afenda-icon-180-transparent.png"
      width={180}
    />
  ),
};

const DEFAULT_NAV_TOPBAR_UTILITIES_RAIL: TopbarUtilitiesRailProps = {
  catalog: DEFAULT_ERP_UTILITIES_MARKET_ITEMS,
  defaultEnabledIds: DEFAULT_NAV_TOPBAR_ENABLED_UTILITY_IDS,
  enabledIds: [...DEFAULT_NAV_TOPBAR_ENABLED_UTILITY_IDS],
  notifications: {
    items: DEFAULT_NAV_TOPBAR_NOTIFICATIONS,
  },
  order: [...DEFAULT_NAV_TOPBAR_ENABLED_UTILITY_IDS],
  requestUtilityTitle: "Request utility shortcut",
  requestUtilityNote:
    "Describe the shortcut or tool operators need in the workspace chrome.",
  actionsMenu: {
    actions: DEFAULT_ERP_ACTIONS_MENU_ITEMS,
  },
};

export const DEFAULT_NAV_TOPBAR_PROPS = {
  brand: DEFAULT_NAV_TOPBAR_BRAND,
  scopeSwitchers: DEFAULT_NAV_TOPBAR_SCOPE_SWITCHERS,
  sidebarControl: true,
  utilitiesRail: DEFAULT_NAV_TOPBAR_UTILITIES_RAIL,
} as const;

export interface NavTopbarProps
  extends Omit<ComponentPropsWithoutRef<"header">, "children"> {
  readonly brand?: TopbarBrandDiskProps | false;
  readonly scopeSwitchers?: readonly TopbarScopeSwitcherConfig[];
  readonly sidebarControl?: boolean | TopbarSidebarControlProps | false;
  readonly trailing?: ReactNode;
  readonly utilitiesRail?: TopbarUtilitiesRailProps | false;
}

export const NavTopbar = memo(function NavTopbar({
  brand = DEFAULT_NAV_TOPBAR_BRAND,
  className,
  scopeSwitchers = DEFAULT_NAV_TOPBAR_SCOPE_SWITCHERS,
  sidebarControl = true,
  trailing,
  utilitiesRail = DEFAULT_NAV_TOPBAR_UTILITIES_RAIL,
  ...properties
}: NavTopbarProps) {
  const sidebarControlProps = resolveTopbarSidebarControl(
    sidebarControl === false ? undefined : sidebarControl
  );
  const showBrand = brand !== false;
  const showUtilitiesRail = utilitiesRail !== false;

  return (
    <TooltipProvider delayDuration={350} skipDelayDuration={100}>
      <header
        className={cn(navTopbarShellClass, className)}
        data-slot="nav-topbar"
        {...properties}
      >
        <div className={navTopbarLeftClass} data-slot="nav-topbar-left">
          {sidebarControlProps ? (
            <TopbarSidebarControl {...sidebarControlProps} />
          ) : null}
          {showBrand && brand ? (
            <TopbarBrandDisk
              tooltip={TOPBAR_DEFAULT_BRAND_TOOLTIP}
              {...brand}
            />
          ) : null}
          <TopbarScopeSwitchers switchers={scopeSwitchers} />
        </div>
        <div className={navTopbarRightClass} data-slot="nav-topbar-right">
          {trailing}
          {showUtilitiesRail && utilitiesRail ? (
            <TopbarUtilitiesRail {...utilitiesRail} />
          ) : null}
        </div>
      </header>
    </TooltipProvider>
  );
});

export { NAV_TOPBAR_HEIGHT };
