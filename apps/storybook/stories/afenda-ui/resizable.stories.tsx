import {
  Badge,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Separator,
} from "@repo/design-system";
import type { Meta, StoryObj } from "@storybook/react";
import { layoutStoryParameters } from "../../.storybook/essentials";

function ResizableStory() {
  return (
    <div className="w-[760px] rounded-[var(--card-radius)] border border-border-default bg-surface-raised shadow-panel">
      <div className="flex h-10 items-center justify-between border-border-default border-b px-3">
        <div className="font-medium text-[13px] text-text-primary">
          Approval workspace
        </div>
        <Badge tone="info" variant="outline">
          Resizable
        </Badge>
      </div>
      <ResizablePanelGroup className="h-64" orientation="horizontal">
        <ResizablePanel defaultSize={38} minSize={28}>
          <div className="grid h-full content-start gap-2 p-3">
            <div className="font-medium text-[12px] text-text-secondary uppercase tracking-[0.08em]">
              Records
            </div>
            {["Northwind Trading", "Contoso Retail", "Fabrikam Health"].map(
              (tenant, index) => (
                <div
                  className="rounded-[var(--xforge-radius-sm)] border border-border-default bg-surface px-3 py-2"
                  key={tenant}
                >
                  <div className="truncate font-medium text-[13px] text-text-primary">
                    {tenant}
                  </div>
                  <div className="mt-1 text-[12px] text-text-secondary">
                    {index === 0 ? "Pending approval" : "Ready for review"}
                  </div>
                </div>
              )
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={62} minSize={36}>
          <div className="grid h-full content-start gap-3 p-4">
            <div>
              <div className="font-semibold text-[14px] text-text-primary">
                Northwind Trading
              </div>
              <div className="text-[12px] text-text-secondary">
                Preview panel remains readable while resizing.
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Risk", "Medium"],
                ["Owner", "Jordan Lee"],
                ["SLA", "4 hours"],
                ["Status", "Pending"],
              ].map(([label, value]) => (
                <div className="grid gap-1" key={label}>
                  <span className="text-[12px] text-text-secondary">
                    {label}
                  </span>
                  <span className="font-medium text-[13px] text-text-primary">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function VerticalResizableStory() {
  return (
    <div className="w-[520px] rounded-[var(--card-radius)] border border-border-default bg-surface-raised shadow-panel">
      <ResizablePanelGroup className="h-72" orientation="vertical">
        <ResizablePanel defaultSize={55} minSize={35}>
          <div className="grid h-full place-items-center p-4 text-[13px] text-text-secondary">
            Main evidence panel
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={45} minSize={25}>
          <div className="grid h-full place-items-center p-4 text-[13px] text-text-secondary">
            Audit detail panel
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

const meta = {
  title: "Afenda UI/Resizable",
  tags: ["autodocs", "afenda-ui", "primitive"],
  component: ResizableStory,
  parameters: {
    ...layoutStoryParameters,
    docs: {
      description: {
        component:
          "Afenda resizable panels for operational split views. The handle is quiet, discoverable, and readable at ERP density.",
      },
    },
  },
} satisfies Meta<typeof ResizableStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ResizableStory />,
};

export const Vertical: Story = {
  render: () => <VerticalResizableStory />,
};
