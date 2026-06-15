import type { Meta, StoryObj } from "@storybook/react"

import { layoutStoryParameters } from "../../.storybook/essentials"

import { Badge } from "@repo/design-system/components/afenda-ui/badge"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/design-system/components/afenda-ui/resizable"
import { Separator } from "@repo/design-system/components/afenda-ui/separator"

function ResizableStory() {
  return (
    <div className="w-[760px] rounded-[var(--card-radius)] border border-border-default bg-surface-raised shadow-panel">
      <div className="flex h-10 items-center justify-between border-b border-border-default px-3">
        <div className="text-[13px] font-medium text-text-primary">
          Approval workspace
        </div>
        <Badge tone="info" variant="outline">
          Resizable
        </Badge>
      </div>
      <ResizablePanelGroup orientation="horizontal" className="h-64">
        <ResizablePanel defaultSize={38} minSize={28}>
          <div className="grid h-full content-start gap-2 p-3">
            <div className="text-[12px] font-medium uppercase tracking-[0.08em] text-text-secondary">
              Records
            </div>
            {["Northwind Trading", "Contoso Retail", "Fabrikam Health"].map(
              (tenant, index) => (
                <div
                  className="rounded-[var(--xforge-radius-sm)] border border-border-default bg-surface px-3 py-2"
                  key={tenant}
                >
                  <div className="truncate text-[13px] font-medium text-text-primary">
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
              <div className="text-[14px] font-semibold text-text-primary">
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
                  <span className="text-[13px] font-medium text-text-primary">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

function VerticalResizableStory() {
  return (
    <div className="w-[520px] rounded-[var(--card-radius)] border border-border-default bg-surface-raised shadow-panel">
      <ResizablePanelGroup orientation="vertical" className="h-72">
        <ResizablePanel defaultSize={55} minSize={35}>
          <div
            className="grid h-full place-items-center p-4 text-[13px] text-text-secondary"
            tabIndex={0}
          >
            Main evidence panel
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={45} minSize={25}>
          <div
            className="grid h-full place-items-center p-4 text-[13px] text-text-secondary"
            tabIndex={0}
          >
            Audit detail panel
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

const meta = {
  title: "Afenda UI/Resizable",
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
} satisfies Meta<typeof ResizableStory>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ResizableStory />,
}

export const Vertical: Story = {
  render: () => <VerticalResizableStory />,
}
