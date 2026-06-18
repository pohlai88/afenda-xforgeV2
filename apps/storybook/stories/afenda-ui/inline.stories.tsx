import { Badge, Box, Inline, Text } from "@repo/design-system";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/Inline",
  component: Inline,
  tags: ["autodocs", "afenda-ui", "primitive"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Horizontal layout primitive for wrapping action rows, metadata, filters, and status chips.",
      },
    },
  },
} satisfies Meta<typeof Inline>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FilterRow: Story = {
  render: () => (
    <Box
      className="w-[min(720px,calc(100vw-32px))]"
      padding="md"
      radius="md"
      surface="raised"
    >
      <Inline justify="between">
        <Text variant="medium">Approval filters</Text>
        <Inline gap="xs">
          <Badge tone="info" variant="outline">
            Tenant: Northwind
          </Badge>
          <Badge tone="warning" variant="outline">
            SLA &lt; 4h
          </Badge>
          <Badge tone="neutral" variant="outline">
            Risk first
          </Badge>
        </Inline>
      </Inline>
    </Box>
  ),
};
