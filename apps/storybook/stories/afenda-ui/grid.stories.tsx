import {
  Badge,
  Box,
  Grid,
  MetricText,
  Text,
} from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/Grid",
  component: Grid,
  tags: ["autodocs", "afenda-ui", "primitive"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Responsive grid primitive with stable tracks for dense ERP metrics and panels.",
      },
    },
  },
} satisfies Meta<typeof Grid>;

export default meta;

type Story = StoryObj<typeof meta>;

const metrics = [
  ["Ready", "86", "positive"],
  ["SLA risk", "14", "warning"],
  ["Policy locks", "7", "info"],
  ["Failed sync", "2", "critical"],
] as const;

const metricTextTone = {
  critical: "danger",
  info: "info",
  positive: "success",
  warning: "warning",
} as const;

export const MetricGrid: Story = {
  render: () => (
    <Grid className="w-[min(880px,calc(100vw-32px))]" columns={4} gap="sm">
      {metrics.map(([label, value, tone]) => (
        <Box key={label} padding="md" radius="md" surface="raised">
          <Text tone="secondary" variant="caption">
            {label}
          </Text>
          <MetricText tone={metricTextTone[tone]}>{value}</MetricText>
          <Badge tone={tone} variant="outline">
            Current period
          </Badge>
        </Box>
      ))}
    </Grid>
  ),
};
