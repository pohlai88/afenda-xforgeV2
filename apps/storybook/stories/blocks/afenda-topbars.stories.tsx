import {
  AuthenticatedAppShellBlock,
  DEFAULT_ERP_ACTIONS_MENU_ITEMS,
  DEFAULT_ERP_UTILITIES_MARKET_ITEMS,
  OperatorAppTopbar,
  SidebarProvider,
  type TopbarActionMenuItem,
  type TopbarScopeSwitcherConfig,
} from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";
import { Building2Icon } from "lucide-react";
import { useMemo, useState } from "react";

import { layoutStoryParameters } from "../../.storybook/essentials";

const demoScopeSwitchers: TopbarScopeSwitcherConfig[] = [
  {
    id: "company",
    label: "Company",
    description: "Tenant scope for reads, writes, and audit evidence.",
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
    description: "Functional area within the active company.",
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
    description: "Working group for queue ownership and approvals.",
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
    description: "Time-bound initiative or close cycle.",
    activeOptionId: "june-close",
    options: [
      { id: "june-close", label: "June close" },
      { id: "q3-audit", label: "Q3 audit" },
      { id: "vendor-review", label: "Vendor review" },
      { id: "policy-cleanup", label: "Policy cleanup" },
    ],
  },
];

const demoDefaultEnabledUtilityIds = [
  "help",
  "feedback",
  "notifications",
] as const;

function DemoOperatorTopbar() {
  const [scopeSwitchers, setScopeSwitchers] = useState(demoScopeSwitchers);
  const [enabledUtilityIds, setEnabledUtilityIds] = useState<readonly string[]>(
    [...demoDefaultEnabledUtilityIds]
  );
  const [utilityOrder, setUtilityOrder] = useState<readonly string[]>([
    ...demoDefaultEnabledUtilityIds,
  ]);

  const wiredSwitchers = useMemo(
    () =>
      scopeSwitchers.map((switcher) => ({
        ...switcher,
        onSelect: (optionId: string) => {
          setScopeSwitchers((current) =>
            current.map((entry) =>
              entry.id === switcher.id
                ? { ...entry, activeOptionId: optionId }
                : entry
            )
          );
        },
      })),
    [scopeSwitchers]
  );

  const wiredActionsMenu = useMemo<readonly TopbarActionMenuItem[]>(
    () => DEFAULT_ERP_ACTIONS_MENU_ITEMS,
    []
  );

  return (
    <OperatorAppTopbar
      brand={{
        icon: <Building2Icon aria-hidden="true" className="size-4" />,
      }}
      scopeSwitchers={wiredSwitchers}
      sidebarControl
      utilitiesRail={{
        catalog: DEFAULT_ERP_UTILITIES_MARKET_ITEMS,
        defaultEnabledIds: demoDefaultEnabledUtilityIds,
        enabledIds: enabledUtilityIds,
        actionsMenu: {
          actions: wiredActionsMenu,
        },
        onEnabledChange: setEnabledUtilityIds,
        onOrderChange: setUtilityOrder,
        order: utilityOrder,
      }}
    />
  );
}

function DemoOperatorTopbarStory({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <SidebarProvider>{children}</SidebarProvider>;
}

const meta = {
  title: "Blocks/Operator/Topbars",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Dense operator app topbar with scope switchers and a utilities rail with pinned icons plus fixed market and actions menu.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const OperatorChrome: Story = {
  render: () => (
    <DemoOperatorTopbarStory>
      <div className="h-[var(--xforge-layout-app-topbar)] border-border-default border-b bg-surface-canvas">
        <DemoOperatorTopbar />
      </div>
    </DemoOperatorTopbarStory>
  ),
};

export const InAppShell: Story = {
  render: () => (
    <AuthenticatedAppShellBlock
      appTopbar={<DemoOperatorTopbar />}
      contentPadded
      density="compact"
      intent="operation"
      siteContainerConfig={{ adjustable: false, mode: "docked" }}
    >
      <div className="grid min-h-40 place-items-center rounded-[var(--card-radius)] border border-border-default border-dashed bg-surface-muted/20 p-6 text-[13px] text-text-secondary">
        Site container content — topbar owns chrome; app owns route data.
      </div>
    </AuthenticatedAppShellBlock>
  ),
};

export const UtilitiesOnly: Story = {
  render: () => (
    <DemoOperatorTopbarStory>
      <div className="h-[var(--xforge-layout-app-topbar)] border-border-default border-b bg-surface-canvas">
        <OperatorAppTopbar
          utilitiesRail={{
            catalog: DEFAULT_ERP_UTILITIES_MARKET_ITEMS,
            defaultEnabledIds: [],
            actionsMenu: {
              actions: DEFAULT_ERP_ACTIONS_MENU_ITEMS,
            },
          }}
        />
      </div>
    </DemoOperatorTopbarStory>
  ),
};

export const ScopeSwitchersOnly: Story = {
  render: () => (
    <DemoOperatorTopbarStory>
      <div className="h-[var(--xforge-layout-app-topbar)] border-border-default border-b bg-surface-canvas">
        <OperatorAppTopbar
          scopeSwitchers={demoScopeSwitchers}
          utilitiesRail={{
            catalog: DEFAULT_ERP_UTILITIES_MARKET_ITEMS,
            defaultEnabledIds: [],
            actionsMenu: {
              actions: DEFAULT_ERP_ACTIONS_MENU_ITEMS,
            },
          }}
        />
      </div>
    </DemoOperatorTopbarStory>
  ),
};

export const UtilitiesRail: Story = {
  render: () => (
    <DemoOperatorTopbarStory>
      <div className="h-[var(--xforge-layout-app-topbar)] border-border-default border-b bg-surface-canvas">
        <DemoOperatorTopbar />
      </div>
    </DemoOperatorTopbarStory>
  ),
};
