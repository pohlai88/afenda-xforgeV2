import { Box } from "@repo/design-system/components/afenda-ui/box";
import { Focusable } from "@repo/design-system/components/afenda-ui/focusable";
import { Stack } from "@repo/design-system/components/afenda-ui/stack";
import { Text } from "@repo/design-system/components/afenda-ui/text";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/Focusable",
  component: Focusable,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Focus-ring primitive for custom interactive surfaces that need keyboard visibility without inventing local focus CSS.",
      },
    },
  },
} satisfies Meta<typeof Focusable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FocusablePanel: Story = {
  render: () => (
    <Focusable
      aria-label="Open AP-10471 evidence"
      className="block w-[min(520px,calc(100vw-32px))]"
      role="button"
    >
      <Box padding="lg" radius="md" surface="raised">
        <Stack gap="xs">
          <Text variant="title">AP-10471 evidence</Text>
          <Text tone="secondary" variant="caption">
            Press Tab to verify the shared focus affordance on this custom
            surface.
          </Text>
        </Stack>
      </Box>
    </Focusable>
  ),
};
