import { Badge, Box, Text } from "@repo/design-system";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/Box",
  component: Box,
  tags: ["autodocs", "afenda-ui", "primitive"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Token-backed layout container for ERP panels, evidence rows, and bounded content.",
      },
    },
  },
} satisfies Meta<typeof Box>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Surfaces: Story = {
  render: () => (
    <div className="grid w-[min(720px,calc(100vw-32px))] gap-3">
      <Box padding="lg" radius="md" surface="raised">
        <Badge tone="warning" variant="outline">
          Policy lock
        </Badge>
        <Text className="mt-2" variant="title">
          Posting batch held
        </Text>
        <Text className="mt-1" color="secondary" variant="caption">
          Manager approval is required before AP-10471 can post.
        </Text>
      </Box>
      <Box padding="md" radius="sm" surface="muted">
        <Text color="secondary" variant="caption">
          Muted evidence surface for secondary operational context.
        </Text>
      </Box>
    </div>
  ),
};
