import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";
import { SearchIcon } from "lucide-react";

const meta = {
  title: "Afenda UI/Empty",
  tags: ["autodocs", "afenda-ui", "primitive"],
  component: Empty,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Empty>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-muted p-6">
      <div className="mx-auto max-w-4xl rounded-lg border border-border-default bg-surface-raised p-4">
        <div className="mb-3 flex items-center justify-between text-[12px]">
          <span className="font-medium text-text-secondary uppercase tracking-wide">
            Evidence search
          </span>
          <span className="text-text-secondary">
            Tenant CTR-8831 · last 24h
          </span>
        </div>
        <Empty className="min-h-[260px] border border-border-default border-dashed bg-surface">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchIcon />
            </EmptyMedia>
            <EmptyTitle>No matching audit packets</EmptyTitle>
            <EmptyDescription>
              No payroll lock evidence matches operator Maya Chen, export scope,
              and high-risk filters.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm">Clear filters</Button>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  ),
};
