import type { Meta, StoryObj } from "@storybook/react";
import {
  AuthenticatedAppShellBlock,
  ContentLayoutBlock,
  ContentLayoutBottomDrawer,
  ContentLayoutBreadcrumbsTopbar,
  ContentLayoutFooter,
  ContentLayoutSidebar,
  DEFAULT_CONTENT_LAYOUT_FOOTER_LINKS,
  DEMO_CONTENT_LAYOUT_BREADCRUMBS,
  DEMO_CONTENT_LAYOUT_BOTTOM_DRAWER_LABEL,
  DEMO_CONTENT_LAYOUT_DEFAULT_NAV_HREF,
  DEMO_ERP_SIDEBAR_LABEL_GROUPS,
  DEMO_ERP_SIDEBAR_NAV_GROUPS,
  DEMO_ERP_SIDEBAR_QUICK_ACTIONS,
  OperatorAppSidebar,
  SidebarFooterProfile,
  stripSidebarNavItemSelection,
  type ContentLayoutBlockProps,
} from "@repo/design-system/design-system";
import { cn } from "@repo/design-system/lib/utils";
import { useCallback, useState } from "react";

import { layoutStoryParameters } from "../../.storybook/essentials";
import {
  DemoContentLayoutActivityDrawer,
  DemoContentLayoutAuditRail,
  DemoContentLayoutBreadcrumbTrailing,
  DemoContentLayoutScrollPanels,
  DemoContentLayoutSectionNav,
} from "./content-layout-demo-panels";

const demoInteractiveNavGroups = stripSidebarNavItemSelection(
  DEMO_ERP_SIDEBAR_NAV_GROUPS
);

function useDemoContentLayoutNav() {
  const [activeHref, setActiveHref] = useState(DEMO_CONTENT_LAYOUT_DEFAULT_NAV_HREF);

  const onNavigate = useCallback((href: string) => {
    setActiveHref(href);
  }, []);

  return { activeHref, onNavigate };
}

function DemoContentLayoutStage({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="h-svh bg-surface-muted/20 p-[var(--xforge-space-6)]">
      {children}
    </div>
  );
}

function DemoChromeFrame({
  children,
  className,
}: {
  readonly children: React.ReactNode;
  readonly className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--card-radius)] border border-border-default bg-surface-raised shadow-panel",
        className
      )}
    >
      {children}
    </div>
  );
}

function DemoContentLayoutBlock({
  children,
  sectionCount,
  ...props
}: Omit<ContentLayoutBlockProps, "children"> & {
  readonly children?: React.ReactNode;
  readonly sectionCount?: number;
}) {
  const { activeHref, onNavigate } = useDemoContentLayoutNav();

  return (
    <ContentLayoutBlock
      bottomDrawer={<DemoContentLayoutActivityDrawer />}
      bottomDrawerConfig={{
        defaultOpen: true,
        label: DEMO_CONTENT_LAYOUT_BOTTOM_DRAWER_LABEL,
      }}
      breadcrumbItems={DEMO_CONTENT_LAYOUT_BREADCRUMBS}
      breadcrumbTrailing={<DemoContentLayoutBreadcrumbTrailing />}
      footerLinks={DEFAULT_CONTENT_LAYOUT_FOOTER_LINKS}
      leftSidebar={
        <DemoContentLayoutSectionNav
          activeHref={activeHref}
          onNavigate={onNavigate}
        />
      }
      resizeConfig={{ adjustable: true }}
      rightSidebar={<DemoContentLayoutAuditRail />}
      {...props}
    >
      {children ?? <DemoContentLayoutScrollPanels sectionCount={sectionCount} />}
    </ContentLayoutBlock>
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
          showSidebarControl
        />
      }
      groups={demoInteractiveNavGroups}
      labelGroups={DEMO_ERP_SIDEBAR_LABEL_GROUPS}
      quickActions={DEMO_ERP_SIDEBAR_QUICK_ACTIONS}
    />
  );
}

const meta = {
  title: "Blocks/Afenda/Content Layout",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Rounded site container with breadcrumb topbar, collapsible sidebars, bottom drawer, fixed footer, and vertical scroll confined to the main pane. Demo panels live in Storybook; catalog data is exported from the design-system package like Afenda sidebars.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const FullChrome: Story = {
  render: () => (
    <DemoContentLayoutStage>
      <DemoContentLayoutBlock />
    </DemoContentLayoutStage>
  ),
};

export const DockedNoResize: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Docked inset without resize handles — useful inside app-shell stage.",
      },
    },
  },
  render: () => (
    <DemoContentLayoutStage>
      <DemoContentLayoutBlock resizeConfig={{ adjustable: false }} />
    </DemoContentLayoutStage>
  ),
};

export const InAppShell: Story = {
  render: () => (
    <AuthenticatedAppShellBlock
      appSidebar={<DemoAppSidebar />}
      contentPadded={false}
      density="compact"
      intent="operation"
      siteContainerConfig={{ adjustable: false, mode: "docked" }}
    >
      <DemoContentLayoutBlock resizeConfig={{ adjustable: false }} />
    </AuthenticatedAppShellBlock>
  ),
};

export const BreadcrumbsOnly: Story = {
  render: () => (
    <DemoContentLayoutStage>
      <ContentLayoutBlock
        breadcrumbItems={DEMO_CONTENT_LAYOUT_BREADCRUMBS}
        breadcrumbTrailing={<DemoContentLayoutBreadcrumbTrailing />}
        resizeConfig={{ adjustable: false }}
      >
        <DemoContentLayoutScrollPanels sectionCount={4} />
      </ContentLayoutBlock>
    </DemoContentLayoutStage>
  ),
};

export const LeftSidebarOnly: Story = {
  render: () => (
    <DemoContentLayoutStage>
      <ContentLayoutBlock
        leftSidebar={<DemoContentLayoutSectionNav />}
        resizeConfig={{ adjustable: false }}
      >
        <DemoContentLayoutScrollPanels sectionCount={4} />
      </ContentLayoutBlock>
    </DemoContentLayoutStage>
  ),
};

export const RightSidebarOnly: Story = {
  render: () => (
    <DemoContentLayoutStage>
      <ContentLayoutBlock
        resizeConfig={{ adjustable: false }}
        rightSidebar={<DemoContentLayoutAuditRail />}
      >
        <DemoContentLayoutScrollPanels sectionCount={4} />
      </ContentLayoutBlock>
    </DemoContentLayoutStage>
  ),
};

export const BottomDrawerOnly: Story = {
  render: () => (
    <DemoContentLayoutStage>
      <ContentLayoutBlock
        bottomDrawer={<DemoContentLayoutActivityDrawer />}
        bottomDrawerConfig={{
          defaultOpen: true,
          label: DEMO_CONTENT_LAYOUT_BOTTOM_DRAWER_LABEL,
        }}
        resizeConfig={{ adjustable: false }}
      >
        <DemoContentLayoutScrollPanels sectionCount={4} />
      </ContentLayoutBlock>
    </DemoContentLayoutStage>
  ),
};

export const FooterOnly: Story = {
  render: () => (
    <DemoContentLayoutStage>
      <DemoChromeFrame>
        <ContentLayoutFooter links={DEFAULT_CONTENT_LAYOUT_FOOTER_LINKS} />
      </DemoChromeFrame>
    </DemoContentLayoutStage>
  ),
};

export const TopbarComponentOnly: Story = {
  render: () => (
    <DemoContentLayoutStage>
      <DemoChromeFrame>
        <ContentLayoutBreadcrumbsTopbar
          items={DEMO_CONTENT_LAYOUT_BREADCRUMBS}
          trailing={<DemoContentLayoutBreadcrumbTrailing />}
        />
      </DemoChromeFrame>
    </DemoContentLayoutStage>
  ),
};

function DemoSidebarComponentStory() {
  const { activeHref, onNavigate } = useDemoContentLayoutNav();

  return (
    <DemoContentLayoutStage>
      <DemoChromeFrame className="h-[28rem]">
        <ContentLayoutSidebar config={{ ariaLabel: "Demo left sidebar" }} side="left">
          <DemoContentLayoutSectionNav
            activeHref={activeHref}
            onNavigate={onNavigate}
          />
        </ContentLayoutSidebar>
      </DemoChromeFrame>
    </DemoContentLayoutStage>
  );
}

export const SidebarComponentOnly: Story = {
  render: () => <DemoSidebarComponentStory />,
};

export const BottomDrawerComponentOnly: Story = {
  render: () => (
    <DemoContentLayoutStage>
      <DemoChromeFrame>
        <ContentLayoutBottomDrawer
          config={{
            defaultOpen: true,
            label: DEMO_CONTENT_LAYOUT_BOTTOM_DRAWER_LABEL,
          }}
        >
          <DemoContentLayoutActivityDrawer />
        </ContentLayoutBottomDrawer>
      </DemoChromeFrame>
    </DemoContentLayoutStage>
  ),
};

export const MainScrollOnly: Story = {
  render: () => (
    <DemoContentLayoutStage>
      <ContentLayoutBlock resizeConfig={{ adjustable: false }}>
        <DemoContentLayoutScrollPanels />
      </ContentLayoutBlock>
    </DemoContentLayoutStage>
  ),
};
