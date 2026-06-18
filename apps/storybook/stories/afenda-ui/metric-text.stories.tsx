import {
  Box,
  MetricText,
  Stack,
  Text,
} from "@repo/design-system";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/MetricText",
  component: MetricText,
  tags: ["autodocs", "afenda-ui", "primitive"],
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
          <Text color="secondary" variant="caption">
            Ready to post
          </Text>
          <MetricText color="success" size="lg">
            86
          </MetricText>
        </div>
        <div>
          <Text color="secondary" variant="caption">
            SLA risk
          </Text>
          <MetricText color="warning" size="md">
            14
          </MetricText>
        </div>
        <div>
          <Text color="secondary" variant="caption">
            Failed sync
          </Text>
          <MetricText color="critical" size="sm">
            2
          </MetricText>
        </div>
      </Stack>
    </Box>
  ),
};
