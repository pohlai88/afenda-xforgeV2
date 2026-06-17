import { Box, Stack, Text } from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/Text",
  component: Text,
  tags: ["autodocs", "afenda-ui", "primitive"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Typography primitive for token-backed ERP copy, labels, captions, and compact titles.",
      },
    },
  },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TypographyRoles: Story = {
  render: () => (
    <Box
      className="w-[min(620px,calc(100vw-32px))]"
      padding="lg"
      radius="md"
      surface="raised"
    >
      <Stack gap="sm">
        <Text variant="metadata">Approval policy</Text>
        <Text variant="title">Threshold override required</Text>
        <Text>
          Posting batch AP-10471 exceeds the configured exposure limit for
          Northwind Trading.
        </Text>
        <Text color="secondary" variant="caption">
          Ask a finance manager to approve the exception before posting.
        </Text>
      </Stack>
    </Box>
  ),
};
