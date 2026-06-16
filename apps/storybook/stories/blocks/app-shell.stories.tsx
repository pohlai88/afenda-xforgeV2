import type {
  ApprovalQueueRow,
  RiskEvidenceItem,
  StatsMetric,
  TopbarActionMenuItem,
  TopbarScopeSwitcherConfig,
} from "@repo/design-system/design-system";
import {
  ApprovalQueueBlock,
  AuthenticatedAppShellBlock,
  Badge,
  Button,
  blockRecipe,
  DEFAULT_ERP_ACTIONS_MENU_ITEMS,
  DEFAULT_ERP_UTILITIES_MARKET_ITEMS,
  DEMO_ERP_SIDEBAR_LABEL_GROUPS,
  DEMO_ERP_SIDEBAR_NAV_GROUPS,
  DEMO_ERP_SIDEBAR_QUICK_ACTIONS,
  EmptyPanel,
  Kbd,
  OperatorAppSidebar,
  OperatorAppTopbar,
  RiskEvidencePanel,
  SidebarFooterProfile,
  SidebarFooterTrailingControl,
  StatsStrip,
} from "@repo/design-system/design-system";
import { cn } from "@repo/design-system/lib/utils";
import type { Meta, StoryObj } from "@storybook/react";
import {
  BellIcon,
  Building2Icon,
  CalendarIcon,
  HelpCircleIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
} from "lucide-react";

import { layoutStoryParameters } from "../../.storybook/essentials";

const meta = {
  title: "Blocks/Workflow/App Shell",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Page-first authenticated app-shell frame. The block owns the full desktop chrome layer, adjustable V4 site container, app topbar/sidebar slots, site topbar/sidebar slots, right sidebar, bottom drawer, and overflow topology; apps own route, tenant, navigation, and action content.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const metrics: StatsMetric[] = [
  {
    id: "risk",
    label: "Approval risk",
    value: "72",
    description: "Weighted SLA, amount, and lock risk.",
    tone: "warning",
  },
  {
    id: "ready",
    label: "Ready to post",
    value: "86",
    description: "Validated records awaiting approval.",
    tone: "success",
  },
  {
    id: "audit",
    label: "Audit events",
    value: "1,284",
    description: "Captured this tenant period.",
    tone: "info",
  },
];

const approvals: ApprovalQueueRow[] = [
  {
    amount: "86,420.00",
    approvalId: "AP-10482",
    assignee: "Mina Shah",
    evidence: "Invoice and vendor match",
    requestedAt: "10:42",
    risk: "success",
    sla: "1h 12m",
    tenant: "Northwind Trading",
  },
  {
    amount: "14,310.50",
    approvalId: "AP-10479",
    assignee: "Jon Bell",
    evidence: "Evidence required",
    requestedAt: "10:18",
    risk: "warning",
    sla: "38m",
    tenant: "Aster Foods",
  },
  {
    amount: "122,900.00",
    approvalId: "AP-10471",
    assignee: "Priya N.",
    evidence: "Policy lock",
    requestedAt: "09:51",
    risk: "critical",
    sla: "Past due",
    tenant: "Mercury Parts",
  },
];

const evidence: RiskEvidenceItem[] = [
  {
    actor: "Policy engine",
    detail: "AP-7.4 requires second approver for high-value vendor posting.",
    id: "risk-policy",
    time: "10:18",
    tone: "warning",
  },
  {
    actor: "Mina Shah",
    detail: "Vendor invoice, receiving note, and owner confirmation attached.",
    id: "risk-attachment",
    time: "10:42",
    tone: "success",
  },
];

export const ApprovalWorkspace: Story = {
  render: () => (
    <AuthenticatedAppShellBlock
      appSidebar={<DemoAppSidebar />}
      appTopbar={<DemoAppTopbar />}
      contentPadded
      density="default"
      intent="approval"
      siteBottomDrawer={<DemoBottomDrawer />}
      siteContainerConfig={{ adjustable: true }}
      siteRightSidebar={<DemoAuditDock />}
      siteSidebarLeft={<DemoSiteSidebar />}
      siteTopbar={<DemoSiteTopbar />}
    >
      <DemoCommandFilterBar />
      <StatsStrip columns={3} metrics={metrics} />
      <ApprovalQueueBlock rows={approvals} />
    </AuthenticatedAppShellBlock>
  ),
};

export const EmptyApprovalQueue: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Command shell with an empty work queue — geometry matches the loaded state.",
      },
    },
  },
  render: () => (
    <AuthenticatedAppShellBlock
      appSidebar={<DemoAppSidebar />}
      appTopbar={<DemoAppTopbar />}
      contentPadded
      intent="approval"
      siteContainerConfig={{ adjustable: false, mode: "docked" }}
      siteTopbar={<DemoSiteTopbar />}
    >
      <DemoCommandFilterBar />
      <StatsStrip columns={3} metrics={metrics} />
      <EmptyPanel
        description="No approvals match the current tenant scope and filter set."
        title="Approval queue is clear"
      />
    </AuthenticatedAppShellBlock>
  ),
};

export const AppSidebarQuickActions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Focused preview of sidebar quick actions with explicit topic labels and keyboard shortcuts.",
      },
    },
  },
  render: () => (
    <AuthenticatedAppShellBlock
      appSidebar={<DemoAppSidebar />}
      appTopbar={<DemoAppTopbar />}
      siteContainerConfig={{ adjustable: false, mode: "docked" }}
      siteTopbar={<DemoSiteTopbar />}
    >
      <div className="grid min-h-0 gap-3 p-[var(--card-padding)]">
        <div className={cn(blockRecipe("blockPanel", "blockPanelPadding"))}>
          <div className={blockRecipe("blockDescription")}>Story focus</div>
          <div className={cn(blockRecipe("blockTitle"), "mt-1")}>
            Sidebar quick actions wired to Storybook
          </div>
          <p
            className={cn(blockRecipe("blockDescription"), "mt-1 max-w-prose")}
          >
            This story isolates app sidebar quick actions so topic labels and
            keyboard shortcuts stay explicit without the rest of the shell
            competing for attention.
          </p>
        </div>
      </div>
    </AuthenticatedAppShellBlock>
  ),
};

function DemoCommandFilterBar() {
  const filters = [
    { id: "tenant", label: "Tenant", active: true },
    { id: "risk", label: "Risk tier", active: false },
    { id: "assignee", label: "Assignee", active: false },
  ] as const;

  return (
    <section
      aria-label="Approval queue filters"
      className={blockRecipe("blockToolbar")}
      data-slot="demo-command-filter-bar"
    >
      {filters.map((filter) => (
        <Button
          aria-pressed={filter.active}
          className={cn(
            filter.active && "bg-brand-primary/10 text-brand-primary"
          )}
          key={filter.id}
          size="sm"
          type="button"
          variant="quiet"
        >
          {filter.label}
        </Button>
      ))}
      <span aria-hidden="true" className="mx-1 h-4 w-px bg-border-subtle" />
      <Button
        className="gap-1.5 text-text-secondary"
        size="sm"
        type="button"
        variant="quiet"
      >
        <CalendarIcon aria-hidden="true" className="size-3.5" />
        June 1 – June 16
      </Button>
      <Button
        className="ms-auto text-text-secondary"
        size="sm"
        type="button"
        variant="link"
      >
        Reset filters
      </Button>
    </section>
  );
}

function DemoAppTopbar() {
  const scopeSwitchers: TopbarScopeSwitcherConfig[] = [
    {
      id: "company",
      label: "Company",
      activeOptionId: "northwind",
      options: [
        { id: "northwind", label: "Northwind" },
        { id: "aster", label: "Aster" },
        { id: "mercury", label: "Mercury" },
        { id: "atlas", label: "Atlas" },
      ],
    },
    {
      id: "department",
      label: "Department",
      activeOptionId: "finance",
      options: [
        { id: "finance", label: "Finance" },
        { id: "operations", label: "Operations" },
        { id: "hr", label: "HR" },
        { id: "compliance", label: "Compliance" },
      ],
    },
    {
      id: "team",
      label: "Team",
      activeOptionId: "controls",
      options: [
        { id: "controls", label: "Controls" },
        { id: "posting", label: "Posting" },
        { id: "evidence", label: "Evidence" },
        { id: "policy", label: "Policy" },
      ],
    },
    {
      id: "project",
      label: "Project",
      activeOptionId: "june-close",
      options: [
        { id: "june-close", label: "June close" },
        { id: "q3-audit", label: "Q3 audit" },
        { id: "vendor-review", label: "Vendor review" },
        { id: "policy-cleanup", label: "Policy cleanup" },
      ],
    },
  ];

  const defaultEnabledUtilityIds = [
    "help",
    "feedback",
    "notifications",
  ] as const;
  const actionsMenuItems: readonly TopbarActionMenuItem[] =
    DEFAULT_ERP_ACTIONS_MENU_ITEMS;

  return (
    <OperatorAppTopbar
      brand={{
        icon: <Building2Icon aria-hidden="true" className="size-4" />,
      }}
      scopeSwitchers={scopeSwitchers}
      sidebarControl
      utilitiesRail={{
        catalog: DEFAULT_ERP_UTILITIES_MARKET_ITEMS,
        defaultEnabledIds: defaultEnabledUtilityIds,
        defaultOrder: [...defaultEnabledUtilityIds],
        actionsMenu: {
          actions: actionsMenuItems,
        },
        onRequestUtility: () => undefined,
      }}
    />
  );
}

function DemoAppSidebar() {
  return (
    <OperatorAppSidebar
      footer={
        <SidebarFooterProfile
          avatarFallback="MS"
          href="#profile"
          primaryLabel="Mina Shah"
          secondaryLabel="Control owner"
          trailingControl={<SidebarFooterTrailingControl />}
        />
      }
      groups={DEMO_ERP_SIDEBAR_NAV_GROUPS}
      labelGroups={DEMO_ERP_SIDEBAR_LABEL_GROUPS}
      quickActions={DEMO_ERP_SIDEBAR_QUICK_ACTIONS}
    />
  );
}

function DemoSiteTopbar() {
  return (
    <div
      className={cn(
        blockRecipe("blockHeader"),
        "min-h-[var(--workspace-app-nav-topbar-height)] px-[var(--xforge-space-8)] antialiased"
      )}
      data-slot="workspace-nav-site-topbar"
    >
      <div className={blockRecipe("blockHeaderContent")}>
        <div className={blockRecipe("blockDescription")}>
          Workspace / Approvals
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <h1 className={cn(blockRecipe("blockTitle"), "tracking-tight")}>
            Approval control center
          </h1>
          <Badge tone="positive" variant="outline">
            Controlled
          </Badge>
        </div>
        <p
          className={cn(
            blockRecipe("blockDescription"),
            "max-w-prose truncate"
          )}
        >
          Review approvals, evidence completeness, and policy locks before
          posting operational changes.
        </p>
      </div>
    </div>
  );
}

function DemoSiteSidebar() {
  return (
    <nav aria-label="Approval views" className="grid content-start gap-1 p-2">
      {["Queue", "Evidence", "Policies", "Posting", "Audit"].map(
        (label, index) => (
          <a
            aria-current={index === 0 ? "page" : undefined}
            className={
              index === 0
                ? "rounded-[var(--card-radius)] bg-brand-primary/10 px-2 py-1.5 font-medium text-[13px] text-brand-primary"
                : "rounded-[var(--card-radius)] px-2 py-1.5 text-[13px] text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            }
            href="#approval-workspace"
            key={label}
          >
            {label}
          </a>
        )
      )}
    </nav>
  );
}

function DemoAuditDock() {
  return (
    <RiskEvidencePanel
      evidence={evidence}
      metrics={metrics}
      progress={{
        label: "Evidence completeness",
        tone: "warning",
        value: 68,
      }}
    />
  );
}

function DemoBottomDrawer() {
  return (
    <section
      aria-label="Posting review drawer"
      className={cn(
        blockRecipe("blockSection"),
        "h-full min-h-0 overflow-hidden"
      )}
      data-slot="demo-site-bottom-drawer-content"
    >
      <div className={blockRecipe("blockHeader")}>
        <div className={blockRecipe("blockHeaderContent")}>
          <h2 className={blockRecipe("blockTitle")}>Batch posting review</h2>
          <p className={cn(blockRecipe("blockDescription"), "truncate")}>
            Reversible posting window, job state, and audit confirmation.
          </p>
        </div>
        <Badge tone="warning" variant="outline">
          3 checks pending
        </Badge>
      </div>
      <div className="grid min-h-0 grid-cols-3 gap-3 overflow-hidden">
        {[
          ["Idempotency key", "POST-JUNE-07-8421"],
          ["Rollback window", "14 minutes"],
          ["Policy lock state", "Requires control owner"],
        ].map(([label, value]) => (
          <div
            className={cn(blockRecipe("blockPanel", "blockPanelPadding"))}
            key={label}
          >
            <div className={blockRecipe("blockMetricLabel")}>{label}</div>
            <div className={cn(blockRecipe("blockMetric"), "text-[12px]")}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
