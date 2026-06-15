import {
  Badge,
  Button,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";
import { FilterIcon, SearchIcon } from "lucide-react";
import { expect, screen } from "storybook/test";

import { interactionStoryParameters } from "../../.storybook/essentials";

const QUICK_FILTER_NAME = /quick filter/i;
const WORK_ORDER_OR_TENANT_PLACEHOLDER = /work order or tenant/i;

const meta = {
  title: "Afenda UI/Popover",
  component: Popover,
  tags: ["autodocs", "afenda-ui", "primitive"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Afenda popover primitive. Use for local decisions like quick filters, inline pickers, and compact record actions.",
      },
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[720px] overflow-hidden rounded-[var(--card-radius)] border border-border-default bg-surface">
      <div className="flex items-center justify-between border-border-default border-b px-5 py-4">
        <div>
          <p className="font-medium text-sm text-text-primary">Work orders</p>
          <p className="text-[12px] text-text-secondary">
            Operational queue filtered by owner, control, and status
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary">
              <FilterIcon className="size-4" />
              Quick filter
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80">
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <div className="flex items-center gap-2">
                  <SearchIcon className="size-4 text-text-secondary" />
                  <span className="font-medium">Quick filter</span>
                </div>
                <p className="text-[12px] text-text-secondary leading-4">
                  Narrow the work order table without opening the full filter
                  panel.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="popover-search">Search</Label>
                <Input
                  id="popover-search"
                  placeholder="Work order, tenant, or control"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge tone="positive">Ready</Badge>
                <Badge tone="warning" variant="outline">
                  Needs review
                </Badge>
                <Badge tone="critical" variant="outline">
                  Blocked
                </Badge>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="divide-y divide-border-default text-[13px]">
        {[
          "Reconcile AP batch",
          "Approve payroll export",
          "Validate SSO mapping",
        ].map((task) => (
          <div
            className="grid grid-cols-[1fr_120px_100px] gap-3 px-5 py-3"
            key={task}
          >
            <span className="font-medium text-text-primary">{task}</span>
            <span className="text-text-secondary">Ops desk</span>
            <Badge tone="info" variant="soft">
              Open
            </Badge>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const RecordAction: Story = {
  render: () => (
    <div className="w-[680px] rounded-[var(--card-radius)] border border-border-default bg-surface">
      <div className="grid grid-cols-[1fr_120px_120px] items-center gap-3 px-5 py-4 text-[13px]">
        <div>
          <p className="font-medium text-text-primary">TEN-1048</p>
          <p className="text-text-secondary">
            Northwind Trading · finance connector
          </p>
        </div>
        <Badge tone="positive" variant="soft">
          Healthy
        </Badge>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="quiet">More actions</Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64">
            <div className="grid gap-1">
              <Button className="justify-start px-2" variant="quiet">
                View audit trail
              </Button>
              <Button className="justify-start px-2" variant="quiet">
                Edit metadata
              </Button>
              <Button className="justify-start px-2" variant="quiet">
                Copy tenant identifier
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  parameters: {
    layout: "centered",
    ...interactionStoryParameters,
  },
  tags: ["interaction", "afenda-ui", "primitive"],
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">
          <FilterIcon className="size-4" />
          Quick filter
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72">
        <div className="grid gap-2">
          <Label htmlFor="popover-play-search">Search</Label>
          <Input id="popover-play-search" placeholder="Work order or tenant" />
        </div>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: QUICK_FILTER_NAME })
    );
    await expect(
      await screen.findByPlaceholderText(WORK_ORDER_OR_TENANT_PLACEHOLDER)
    ).toBeVisible();
  },
};
