import type {
  DashboardNavTopbarProps,
  SidebarLinkRenderProps,
} from "@repo/design-system";
import {
  AppSidebar,
  ChartAreaInteractive,
  DashboardDataTable,
  DashboardNavTopbar,
  DashboardPage,
  DEMO_DASHBOARD_DATA_TABLE_ROWS,
  DEMO_DASHBOARD_NAV_TOPBAR_PROPS,
  SectionCards,
  SidebarInset,
  SidebarProvider,
  SiteHeader,
} from "@repo/design-system";
import type { Meta, StoryObj } from "@storybook/react";
import type { CSSProperties } from "react";
import { useCallback, useState } from "react";
import { expect, waitFor, within } from "storybook/test";

import {
  interactionStoryParameters,
  layoutStoryParameters,
} from "../../.storybook/essentials";

const demoDefaultPathname = "#";

/** Matches `dashboardPageProviderClass` — no wrapper fill; sidebar on body default bg */
const dashboardStoryShellClass =
  "has-data-[variant=inset]:!bg-transparent [&_[data-slot=sidebar-inner]]:!bg-transparent [&_[data-slot=sidebar-inner]]:shadow-none";

const dashboardSidebarProviderProps = {
  defaultBehaviorMode: "expanded" as const,
  defaultOpen: true,
};

function useDashboardSidebarLinks() {
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

function DashboardPageDemo({
  chartProps,
  sectionCardsProps,
}: {
  readonly chartProps?: false;
  readonly sectionCardsProps?: false;
}) {
  const { renderLink } = useDashboardSidebarLinks();

  return (
    <DashboardPage
      appSidebarProps={{ renderLink }}
      chartProps={chartProps}
      sectionCardsProps={sectionCardsProps}
      sidebarProviderProps={dashboardSidebarProviderProps}
      siteHeaderProps={{ renderLink, title: "Documents" }}
    />
  );
}

function DashboardAppSidebarDemo() {
  const { renderLink } = useDashboardSidebarLinks();

  return (
    <SidebarProvider
      className={dashboardStoryShellClass}
      {...dashboardSidebarProviderProps}
    >
      <AppSidebar renderLink={renderLink} variant="inset" />
      <SidebarInset className="grid min-w-0 flex-1 place-items-center p-8 text-[13px] text-text-secondary">
        Main workspace stage — floating white inset panel on the canvas system
        background; sidebar nav is embedded on the same canvas.
      </SidebarInset>
    </SidebarProvider>
  );
}

function DashboardSiteHeaderDemo() {
  const { renderLink } = useDashboardSidebarLinks();

  return (
    <SidebarProvider
      className={dashboardStoryShellClass}
      {...dashboardSidebarProviderProps}
    >
      <AppSidebar renderLink={renderLink} variant="inset" />
      <SidebarInset className="flex min-h-svh flex-col">
        <SiteHeader renderLink={renderLink} title="Documents" />
        <div className="grid flex-1 place-items-center p-8 text-[13px] text-text-secondary">
          Site header on the floating inset panel; sidebar sits on canvas.
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

const meta = {
  title: "Blocks/Foundation/Dashboard",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "fullscreen",
    afendaLayout: "fullscreen",
    viewport: { defaultViewport: "desktop" },
    docs: {
      description: {
        component:
          "shadcn dashboard-01 block on Afenda primitives: transparent embedded nav topbar and site footer, inset sidebar on body default bg, floating white main panel, outline KPI/chart/table blocks, draggable data table, and sonner save toasts.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const DashboardPageDefault: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Full dashboard-01 page — transparent nav topbar and content-layout footer, default body background behind sidebar, floating white main panel with KPI strip, chart, and data table.",
      },
    },
  },
  render: () => <DashboardPageDemo />,
};

export const DashboardPageWithoutChart: Story = {
  parameters: {
    docs: {
      description: {
        story: "KPI cards and data table only — chart section omitted.",
      },
    },
  },
  render: () => <DashboardPageDemo chartProps={false} />,
};

export const DashboardPageWithoutKpiCards: Story = {
  parameters: {
    docs: {
      description: {
        story: "Chart and data table without the KPI card strip.",
      },
    },
  },
  render: () => <DashboardPageDemo sectionCardsProps={false} />,
};

export const DashboardNavTopbarDefault: Story = {
  name: "Nav Topbar",
  parameters: {
    docs: {
      description: {
        story:
          "Transparent embedded operator nav topbar on body default background — reuses topbars block primitives without blockChrome fill.",
      },
    },
  },
  render: () => (
    <SidebarProvider
      className={dashboardStoryShellClass}
      style={
        {
          "--dashboard-nav-topbar-height": "var(--xforge-layout-app-topbar)",
        } as CSSProperties
      }
      {...dashboardSidebarProviderProps}
    >
      <DashboardNavTopbar {...DEMO_DASHBOARD_NAV_TOPBAR_PROPS} />
    </SidebarProvider>
  ),
};

export const AppSidebarWithMainStage: Story = {
  name: "App Sidebar + Main Stage",
  parameters: {
    docs: {
      description: {
        story:
          "Sidebar nav on canvas with floating inset main stage — mirrors `DashboardPage` shell wiring without page content.",
      },
    },
  },
  render: () => <DashboardAppSidebarDemo />,
};

export const SiteHeaderBar: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Site header with sidebar trigger on the floating inset panel (canvas outer shell).",
      },
    },
  },
  render: () => <DashboardSiteHeaderDemo />,
};

export const SectionCardsDefault: Story = {
  parameters: {
    afendaLayout: "padded",
    docs: {
      description: {
        story:
          "KPI metric cards with transparent fill and hairline borders on the floating panel.",
      },
    },
  },
  render: () => (
    <div className="w-full max-w-6xl rounded-[var(--card-radius)] bg-sidebar p-4">
      <SectionCards />
    </div>
  ),
};

export const ChartAreaInteractiveDefault: Story = {
  parameters: {
    afendaLayout: "padded",
    docs: {
      description: {
        story:
          "Responsive visitors chart with desktop toggle group and mobile select control.",
      },
    },
  },
  render: () => (
    <div className="w-full max-w-4xl rounded-[var(--card-radius)] bg-sidebar p-4">
      <ChartAreaInteractive />
    </div>
  ),
};

export const DashboardDataTableDefault: Story = {
  parameters: {
    afendaLayout: "padded",
    docs: {
      description: {
        story:
          "Draggable document outline table with row selection, inline target/limit fields, and row detail drawer.",
      },
    },
  },
  render: () => (
    <div className="w-full max-w-6xl rounded-[var(--card-radius)] bg-sidebar p-4">
      <DashboardDataTable data={DEMO_DASHBOARD_DATA_TABLE_ROWS.slice(0, 8)} />
    </div>
  ),
};

export const DashboardDataTableTargetSave: Story = {
  tags: ["interaction"],
  parameters: {
    ...interactionStoryParameters,
    afendaLayout: "padded",
    docs: {
      description: {
        story:
          "Submitting a target field fires a sonner toast via DesignSystemProvider — mirrors apps/app /dashboard behavior.",
      },
    },
  },
  render: () => (
    <div className="w-full max-w-6xl rounded-[var(--card-radius)] bg-sidebar p-4">
      <DashboardDataTable data={DEMO_DASHBOARD_DATA_TABLE_ROWS.slice(0, 3)} />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const targetInput = canvas.getByDisplayValue("18");
    await userEvent.clear(targetInput);
    await userEvent.type(targetInput, "22");
    await userEvent.keyboard("{Enter}");

    await waitFor(() => {
      expect(
        within(document.body).getByText("Saving Cover page")
      ).toBeInTheDocument();
    });
  },
};
