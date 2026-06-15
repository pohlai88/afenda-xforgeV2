import { Button } from "@repo/design-system/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@repo/design-system/components/ui/empty";
import type { Meta, StoryObj } from "@storybook/react";
import { InboxIcon } from "lucide-react";

const meta = {
  title: "ui/Empty",
  component: Empty,
  tags: ["autodocs"],
  render: (args) => (
    <Empty {...args}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <InboxIcon />
        </EmptyMedia>
        <EmptyTitle>No records found</EmptyTitle>
        <EmptyDescription>
          Create the first tenant-scoped record to populate this lane.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">New record</Button>
      </EmptyContent>
    </Empty>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Empty>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
