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
import { expect, waitFor, within } from "storybook/test";

import {
  interactionStoryParameters,
  layoutStoryParameters,
} from "../../.storybook/essentials";

const dashboardSidebarProviderProps = {
  defaultBehaviorMode: "expanded" as const,
  defaultOpen: true,
};

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
          "shadcn dashboard-01 block on Afenda primitives: nav topbar, inset sidebar, KPI cards, chart, and draggable data table.",
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
        story: "Full dashboard-01 page from shadcn-dashboard-01.",
      },
    },
  },
  render: () => <DashboardPage />,
};

export const DashboardNavTopbarDefault: Story = {
  name: "Nav Topbar",
  parameters: {
    docs: {
      description: {
        story: "Simple shadcn-style nav topbar with sidebar trigger and title.",
      },
    },
  },
  render: () => (
    <SidebarProvider {...dashboardSidebarProviderProps}>
      <AppSidebar variant="inset" />
      <SidebarInset className="flex min-h-svh flex-col">
        <DashboardNavTopbar {...DEMO_DASHBOARD_NAV_TOPBAR_PROPS} />
        <div className="grid flex-1 place-items-center p-8 text-[13px] text-text-secondary">
          Main workspace stage
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};

export const AppSidebarWithMainStage: Story = {
  name: "App Sidebar + Main Stage",
  parameters: {
    docs: {
      description: {
        story: "Sidebar with inset main stage placeholder.",
      },
    },
  },
  render: () => (
    <SidebarProvider {...dashboardSidebarProviderProps}>
      <AppSidebar variant="inset" />
      <SidebarInset className="grid min-w-0 flex-1 place-items-center p-8 text-[13px] text-text-secondary">
        Main workspace stage
      </SidebarInset>
    </SidebarProvider>
  ),
};

export const SiteHeaderBar: Story = {
  parameters: {
    docs: {
      description: {
        story: "Site header with optional sidebar trigger.",
      },
    },
  },
  render: () => (
    <SidebarProvider {...dashboardSidebarProviderProps}>
      <AppSidebar variant="inset" />
      <SidebarInset className="flex min-h-svh flex-col">
        <SiteHeader />
        <div className="grid flex-1 place-items-center p-8 text-[13px] text-text-secondary">
          Site header on inset panel
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};

export const SectionCardsDefault: Story = {
  parameters: {
    afendaLayout: "padded",
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
