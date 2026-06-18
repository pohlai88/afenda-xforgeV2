import {
  AuthenticatedAppShellBlock,
  DEMO_ERP_SIDEBAR_LABEL_GROUPS,
  DEMO_ERP_SIDEBAR_NAV_GROUPS,
  DEMO_ERP_SIDEBAR_QUICK_ACTIONS,
  OperatorAppSidebar,
  Sidebar,
  SidebarFooterProfile,
  SidebarFooterTrailingControl,
  type SidebarLabelGroup,
  type SidebarLinkRenderProps,
  SidebarNavPanel,
  SidebarProvider,
  SidebarQuickActions,
  SidebarRail,
  stripSidebarNavItemSelection,
} from "@repo/design-system";
import type { Meta, StoryObj } from "@storybook/react";
import { useCallback, useState } from "react";

import { layoutStoryParameters } from "../../.storybook/essentials";

const demoDefaultPathname = "#approval-workspace";

const demoInteractiveNavGroups = stripSidebarNavItemSelection(
  DEMO_ERP_SIDEBAR_NAV_GROUPS
);

function useDemoSidebarLinks() {
  const [pathname, setPathname] = useState(demoDefaultPathname);

  const renderLink = useCallback(
    ({
      "aria-current": ariaCurrent,
      children,
      className,
      href,
    }: SidebarLinkRenderProps) => (
      <a
        aria-current={ariaCurrent}
        className={className}
        href={href}
        onClick={(event) => {
          event.preventDefault();
          setPathname(href);
        }}
      >
        {children}
      </a>
    ),
    []
  );

  return { pathname, renderLink };
}

function DemoOperatorSidebar() {
  const { pathname, renderLink } = useDemoSidebarLinks();

  return (
    <OperatorAppSidebar
      footer={
        <SidebarFooterProfile
          avatarFallback="MS"
          href="#profile"
          primaryLabel="Mina Shah"
          renderLink={renderLink}
          secondaryLabel="Control owner"
          trailingControl={<SidebarFooterTrailingControl />}
        />
      }
      groups={demoInteractiveNavGroups}
      labelGroups={DEMO_ERP_SIDEBAR_LABEL_GROUPS}
      pathname={pathname}
      quickActions={DEMO_ERP_SIDEBAR_QUICK_ACTIONS}
      renderLink={renderLink}
    />
  );
}

function DemoNavPanel({
  labelGroups = [],
}: {
  readonly labelGroups?: readonly SidebarLabelGroup[];
}) {
  const { pathname, renderLink } = useDemoSidebarLinks();

  return (
    <SidebarNavPanel
      groups={demoInteractiveNavGroups}
      labelGroups={labelGroups}
      pathname={pathname}
      renderLink={renderLink}
    />
  );
}

function DemoOperatorSidebarStory({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultBehaviorMode="expanded" defaultOpen>
      <div className="flex h-svh w-full bg-surface-canvas">
        <Sidebar collapsible="icon" variant="sidebar">
          {children}
          <SidebarRail />
        </Sidebar>
        <div className="grid min-w-0 flex-1 place-items-center p-8 text-[13px] text-text-secondary">
          Main workspace stage — app owns route content.
        </div>
      </div>
    </SidebarProvider>
  );
}

const meta = {
  title: "Blocks/Operator/Sidebars",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "fullscreen",
    docs: {
      description: {
        component:
          'Operator app sidebar (shadcn sidebar-07 icon collapse). Use `collapsible="icon"` on `Sidebar`, `SidebarRail`, and tooltips when collapsed. Quick actions, grouped nav, optional labels, footer profile.',
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const OperatorChrome: Story = {
  render: () => (
    <DemoOperatorSidebarStory>
      <DemoOperatorSidebar />
    </DemoOperatorSidebarStory>
  ),
};

export const InAppShell: Story = {
  render: () => (
    <AuthenticatedAppShellBlock
      appSidebar={<DemoOperatorSidebar />}
      contentPadded
      density="compact"
      intent="operation"
      siteContainerConfig={{ adjustable: false, mode: "docked" }}
    >
      <div className="grid min-h-40 place-items-center rounded-[var(--card-radius)] border border-border-default border-dashed bg-surface-muted/20 p-6 text-[13px] text-text-secondary">
        Site container content — sidebar block owns navigation chrome.
      </div>
    </AuthenticatedAppShellBlock>
  ),
};

export const QuickActionsOnly: Story = {
  render: () => (
    <DemoOperatorSidebarStory>
      <SidebarQuickActions actions={DEMO_ERP_SIDEBAR_QUICK_ACTIONS} />
    </DemoOperatorSidebarStory>
  ),
};

export const NavigationGroupsOnly: Story = {
  render: () => (
    <DemoOperatorSidebarStory>
      <DemoNavPanel />
    </DemoOperatorSidebarStory>
  ),
};

export const LabelGroupsOnly: Story = {
  render: () => (
    <DemoOperatorSidebarStory>
      <SidebarNavPanel
        groups={[]}
        labelGroups={DEMO_ERP_SIDEBAR_LABEL_GROUPS}
      />
    </DemoOperatorSidebarStory>
  ),
};

export const FooterProfileOnly: Story = {
  render: () => (
    <DemoOperatorSidebarStory>
      <SidebarFooterProfile
        avatarFallback="MS"
        href="#profile"
        primaryLabel="Mina Shah"
        secondaryLabel="Control owner"
        trailingControl={<SidebarFooterTrailingControl />}
      />
    </DemoOperatorSidebarStory>
  ),
};

export const NavAndLabels: Story = {
  render: () => (
    <DemoOperatorSidebarStory>
      <DemoNavPanel labelGroups={DEMO_ERP_SIDEBAR_LABEL_GROUPS} />
    </DemoOperatorSidebarStory>
  ),
};

export const EmptyNavigation: Story = {
  render: () => (
    <DemoOperatorSidebarStory>
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
        groups={[]}
        pathname="/"
        quickActions={DEMO_ERP_SIDEBAR_QUICK_ACTIONS}
      />
    </DemoOperatorSidebarStory>
  ),
};
