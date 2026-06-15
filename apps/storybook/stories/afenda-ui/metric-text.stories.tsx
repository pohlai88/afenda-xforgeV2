import { Box } from "@repo/design-system/components/afenda-ui/box";
import { MetricText } from "@repo/design-system/components/afenda-ui/metric-text";
import { Stack } from "@repo/design-system/components/afenda-ui/stack";
import { Text } from "@repo/design-system/components/afenda-ui/text";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/MetricText",
  component: MetricText,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Tabular numeric text primitive for ERP metrics, SLA counts, amounts, and variance values.",
      },
    },
  },
} satisfies Meta<typeof MetricText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MetricSizes: Story = {
  render: () => (
    <Box
      className="w-[min(560px,calc(100vw-32px))]"
      padding="lg"
      radius="md"
      surface="raised"
    >
      <Stack gap="md">
        <div>
          <Text tone="secondary" variant="caption">
            Ready to post
          </Text>
          <MetricText size="lg" tone="success">
            86
          </MetricText>
        </div>
        <div>
          <Text tone="secondary" variant="caption">
            SLA risk
          </Text>
          <MetricText size="md" tone="warning">
            14
          </MetricText>
        </div>
        <div>
          <Text tone="secondary" variant="caption">
            Failed sync
          </Text>
          <MetricText size="sm" tone="danger">
            2
          </MetricText>
        </div>
      </Stack>
    </Box>
  ),
};
