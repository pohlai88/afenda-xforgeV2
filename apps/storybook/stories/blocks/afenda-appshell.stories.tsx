import { AfendaAppShell } from "@repo/design-system";
import type { Meta, StoryObj } from "@storybook/react";

import { layoutStoryParameters } from "../../.storybook/essentials";

const meta = {
  title: "Blocks/Foundation/App Shell",
  tags: ["autodocs", "block"],
  parameters: {
    ...layoutStoryParameters,
    layout: "fullscreen",
    afendaLayout: "fullscreen",
    viewport: { defaultViewport: "desktop" },
    docs: {
      description: {
        component:
          "Bento-grid application shell: full-width topbar and footer, sidebar in the middle row, and content with header, left rail, main, and right rail. Layout placeholders only.",
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const BentoLayoutDefault: Story = {
  name: "Bento Layout",
  parameters: {
    docs: {
      description: {
        story:
          "Default shell showing all layout regions with placeholder labels.",
      },
    },
  },
  render: () => <AfendaAppShell />,
};

export const BentoLayoutWithMainOverride: Story = {
  name: "Bento Layout + Main Override",
  parameters: {
    docs: {
      description: {
        story: "Shell with custom main content while keeping layout rails.",
      },
    },
  },
  render: () => (
    <AfendaAppShell>
      <div className="grid min-h-48 place-items-center text-text-secondary text-sm">
        Custom main slot
      </div>
    </AfendaAppShell>
  ),
};
