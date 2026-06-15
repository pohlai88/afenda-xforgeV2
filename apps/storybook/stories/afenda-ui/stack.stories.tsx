import { Badge, Box, Stack, Text } from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/Stack",
  component: Stack,
  tags: ["autodocs", "afenda-ui", "primitive"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Vertical layout primitive with tokenized gaps for dense operator composition.",
      },
    },
  },
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EvidenceStack: Story = {
  render: () => (
    <Stack className="w-[min(560px,calc(100vw-32px))]" gap="sm">
      {["Invoice package", "Bank validation", "Approval note"].map(
        (label, index) => (
          <Box key={label} padding="md" radius="sm" surface="raised">
            <Stack gap="xs">
              <Badge tone={index === 2 ? "warning" : "positive"}>
                {index === 2 ? "Missing" : "Captured"}
              </Badge>
              <Text variant="medium">{label}</Text>
              <Text tone="secondary" variant="caption">
                Required evidence for June close posting.
              </Text>
            </Stack>
          </Box>
        )
      )}
    </Stack>
  ),
};
