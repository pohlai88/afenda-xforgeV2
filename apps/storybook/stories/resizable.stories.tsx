import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/design-system/components/ui/resizable";
import type { Meta, StoryObj } from "@storybook/react";

import { layoutStoryParameters } from "../.storybook/essentials";

const meta = {
  title: "ui/ResizablePanelGroup",
  component: ResizablePanelGroup,
  tags: ["autodocs"],
  args: {
    className: "max-w-96 rounded-lg border",
    orientation: "horizontal",
  },
  parameters: {
    ...layoutStoryParameters,
    a11y: {
      // Disable automated a11y for this demo because the drag interaction is not stable in the runner.
      disable: true,
    },
  },
  render: (args) => (
    <ResizablePanelGroup {...args}>
      <ResizablePanel defaultSize={50}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">Two</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the resizable panel group.
 */
export const Default: Story = {};
