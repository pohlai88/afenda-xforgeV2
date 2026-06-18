import {
  AuthenticatedAppShellBlock,
  ContentLayoutBlock,
  type ContentLayoutBlockProps,
  ContentLayoutBottomDrawer,
  ContentLayoutBreadcrumbsTopbar,
  ContentLayoutFooter,
  DEFAULT_CONTENT_LAYOUT_FOOTER_LINKS,
  DEMO_CONTENT_LAYOUT_BOTTOM_DRAWER_LABEL,
  DEMO_CONTENT_LAYOUT_BREADCRUMBS,
  DEMO_CONTENT_LAYOUT_DEFAULT_NAV_HREF,
  DEMO_ERP_SIDEBAR_LABEL_GROUPS,
  DEMO_ERP_SIDEBAR_NAV_GROUPS,
  DEMO_ERP_SIDEBAR_QUICK_ACTIONS,
  OperatorAppSidebar,
  SidebarFooterProfile,
  SidebarFooterTrailingControl,
  type SidebarLinkRenderProps,
  stripSidebarNavItemSelection,
} from "@repo/design-system";
import type { Meta, StoryObj } from "@storybook/react";
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
  const [activeHref, setActiveHref] = useState(
    DEMO_CONTENT_LAYOUT_DEFAULT_NAV_HREF
  );

  const onNavigate = useCallback((href: string) => {
    setActiveHref(href);
  }, []);

  return { activeHref, onNavigate };
}

function useDemoSidebarLinks() {
  const [pathname, setPathname] = useState("#approval-workspace");

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

function DemoContentLayoutStory({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="relative h-svh w-full bg-surface-canvas p-[var(--xforge-space-6)]">
      <div className="relative h-full min-h-0 w-full">{children}</div>
    </div>
  );
}

function DemoContentLayoutBlock({
  children,
  resizeConfig,
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
      resizeConfig={{ adjustable: false, ...resizeConfig }}
      rightSidebar={<DemoContentLayoutAuditRail />}
      {...props}
    >
      {children ?? (
        <DemoContentLayoutScrollPanels sectionCount={sectionCount} />
      )}
    </ContentLayoutBlock>
  );
}

function DemoAppSidebar() {
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

const meta = {
  title: "Blocks/Foundation/Content Layout",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Rounded site container with breadcrumb topbar, collapsible sidebars, bottom drawer, fixed footer, and vertical scroll confined to the main pane. Catalog data lives in the design-system package; Storybook owns demo panels.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const OperatorChrome: Story = {
  render: () => (
    <DemoContentLayoutStory>
      <DemoContentLayoutBlock />
    </DemoContentLayoutStory>
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
      <DemoContentLayoutBlock />
    </AuthenticatedAppShellBlock>
  ),
};

export const ResizableContainer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Floating site container with edge resize handles — drag to adjust width and height within the stage.",
      },
    },
  },
  render: () => (
    <DemoContentLayoutStory>
      <DemoContentLayoutBlock resizeConfig={{ adjustable: true }} />
    </DemoContentLayoutStory>
  ),
};

export const BreadcrumbsTopbarOnly: Story = {
  render: () => (
    <DemoContentLayoutStory>
      <div className="overflow-hidden rounded-[var(--card-radius)] border border-border-default bg-surface-raised shadow-panel">
        <ContentLayoutBreadcrumbsTopbar
          items={DEMO_CONTENT_LAYOUT_BREADCRUMBS}
          trailing={<DemoContentLayoutBreadcrumbTrailing />}
        />
      </div>
    </DemoContentLayoutStory>
  ),
};

function DemoLeftSidebarOnly() {
  const { activeHref, onNavigate } = useDemoContentLayoutNav();

  return (
    <ContentLayoutBlock
      leftSidebar={
        <DemoContentLayoutSectionNav
          activeHref={activeHref}
          onNavigate={onNavigate}
        />
      }
      resizeConfig={{ adjustable: false }}
    >
      <DemoContentLayoutScrollPanels sectionCount={4} />
    </ContentLayoutBlock>
  );
}

export const LeftSidebarOnly: Story = {
  render: () => (
    <DemoContentLayoutStory>
      <DemoLeftSidebarOnly />
    </DemoContentLayoutStory>
  ),
};

export const RightSidebarOnly: Story = {
  render: () => (
    <DemoContentLayoutStory>
      <ContentLayoutBlock
        resizeConfig={{ adjustable: false }}
        rightSidebar={<DemoContentLayoutAuditRail />}
      >
        <DemoContentLayoutScrollPanels sectionCount={4} />
      </ContentLayoutBlock>
    </DemoContentLayoutStory>
  ),
};

export const BottomDrawerOnly: Story = {
  render: () => (
    <DemoContentLayoutStory>
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
    </DemoContentLayoutStory>
  ),
};

export const FooterOnly: Story = {
  render: () => (
    <DemoContentLayoutStory>
      <div className="overflow-hidden rounded-[var(--card-radius)] border border-border-default bg-surface-raised shadow-panel">
        <ContentLayoutFooter links={DEFAULT_CONTENT_LAYOUT_FOOTER_LINKS} />
      </div>
    </DemoContentLayoutStory>
  ),
};

export const BottomDrawerComponentOnly: Story = {
  render: () => (
    <DemoContentLayoutStory>
      <div className="overflow-hidden rounded-[var(--card-radius)] border border-border-default bg-surface-raised shadow-panel">
        <ContentLayoutBottomDrawer
          config={{
            defaultOpen: true,
            label: DEMO_CONTENT_LAYOUT_BOTTOM_DRAWER_LABEL,
          }}
        >
          <DemoContentLayoutActivityDrawer />
        </ContentLayoutBottomDrawer>
      </div>
    </DemoContentLayoutStory>
  ),
};

export const MainScrollOnly: Story = {
  render: () => (
    <DemoContentLayoutStory>
      <ContentLayoutBlock resizeConfig={{ adjustable: false }}>
        <DemoContentLayoutScrollPanels />
      </ContentLayoutBlock>
    </DemoContentLayoutStory>
  ),
};
