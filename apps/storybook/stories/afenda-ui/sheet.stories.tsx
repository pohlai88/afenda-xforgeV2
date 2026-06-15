import { Badge } from "@repo/design-system/components/afenda-ui/badge";
import { Button } from "@repo/design-system/components/afenda-ui/button";
import { Input } from "@repo/design-system/components/afenda-ui/input";
import { Label } from "@repo/design-system/components/afenda-ui/label";
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/design-system/components/afenda-ui/sheet";
import type { Meta, StoryObj } from "@storybook/react";
import { FilterIcon, XIcon } from "lucide-react";
import { expect, screen } from "storybook/test";

import { mobileViewportParameters, interactionStoryParameters } from "../../.storybook/essentials";

const meta = {
  title: "Afenda UI/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  globals: {
    backgrounds: { value: "surface" },
  },
  parameters: {
    ...mobileViewportParameters,
    layout: "centered",
    docs: {
      description: {
        component:
          "Afenda sheet primitive. A side-panel workflow surface for filters, detail editing, and contextual operator tasks.",
      },
    },
  },
} satisfies Meta<typeof Sheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[760px] overflow-hidden rounded-[var(--card-radius)] border border-border-default bg-surface">
      <div className="flex items-center justify-between border-border-default border-b px-5 py-4">
        <div>
          <p className="font-medium text-sm text-text-primary">Audit events</p>
          <p className="text-[12px] text-text-secondary">
            1,284 events across finance and identity controls
          </p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">
              <FilterIcon className="size-4" />
              Filter queue
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[420px]" side="right">
            <SheetHeader>
              <SheetTitle>Filter audit queue</SheetTitle>
              <SheetDescription>
                Narrow the current operator view without leaving the event
                ledger.
              </SheetDescription>
            </SheetHeader>

            <SheetBody className="grid gap-5 pr-1">
              <div className="grid gap-2">
                <Label htmlFor="sheet-search">Search</Label>
                <Input
                  id="sheet-search"
                  placeholder="Tenant, actor, control, or event ID"
                />
              </div>

              <div className="grid gap-2">
                <Label>Status</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="positive">Passed</Badge>
                  <Badge tone="warning" variant="outline">
                    Needs review
                  </Badge>
                  <Badge tone="critical" variant="outline">
                    Blocked
                  </Badge>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Control group</Label>
                <div className="grid gap-2 rounded-md border border-border-default bg-surface-muted p-3 text-[13px]">
                  <span>Finance exports</span>
                  <span className="text-text-secondary">
                    Identity lifecycle
                  </span>
                  <span className="text-text-secondary">
                    Vendor master data
                  </span>
                </div>
              </div>
            </SheetBody>

            <SheetFooter>
              <SheetClose asChild>
                <Button variant="quiet">
                  <XIcon className="size-4" />
                  Clear
                </Button>
              </SheetClose>
              <Button variant="primary">Apply filters</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <div className="divide-y divide-border-default text-[13px]">
        {[
          "Payroll export approved",
          "Vendor account changed",
          "SAML role mapped",
        ].map((event) => (
          <div
            className="grid grid-cols-[1fr_120px_110px] gap-3 px-5 py-3"
            key={event}
          >
            <span className="font-medium text-text-primary">{event}</span>
            <span className="text-text-secondary">Today</span>
            <Badge tone="info" variant="soft">
              Logged
            </Badge>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const LeftPanel: Story = {
  render: () => (
    <div className="w-[760px] overflow-hidden rounded-[var(--card-radius)] border border-border-default bg-surface">
      <div className="border-border-default border-b px-5 py-4">
        <p className="font-medium text-sm text-text-primary">Tenant registry</p>
        <p className="text-[12px] text-text-primary">
          Select a tenant row to inspect risk and ownership details.
        </p>
      </div>
      <div className="grid grid-cols-[1fr_110px_150px] items-center gap-3 px-5 py-4 text-[13px]">
        <div>
          <p className="font-medium text-text-primary">Northwind Trading</p>
          <p className="text-text-primary">ERP sync healthy · 482 users</p>
        </div>
        <Badge tone="warning" variant="solid">
          Medium risk
        </Badge>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">Open detail panel</Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[420px]" side="left">
            <SheetHeader>
              <SheetTitle>Tenant details</SheetTitle>
              <SheetDescription className="text-text-primary">
                Contextual details stay on screen while the operator keeps
                scanning the underlying table.
              </SheetDescription>
            </SheetHeader>

            <SheetBody className="grid gap-3 pr-1">
              <div className="grid gap-3 rounded-md border border-border-default bg-surface-muted px-4 py-3 text-[13px]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-text-primary">Tenant</span>
                  <span>Northwind Trading</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-text-primary">Risk</span>
                  <span>Medium</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-text-primary">Owner</span>
                  <span>Mina Patel</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-text-primary">Last sync</span>
                  <span>8 minutes ago</span>
                </div>
              </div>
            </SheetBody>

            <SheetFooter>
              <Button variant="quiet">Archive</Button>
              <Button variant="primary">Save changes</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  parameters: {
    layout: "centered",
    ...interactionStoryParameters,
  },
  tags: ["interaction"],
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">
          <FilterIcon className="size-4" />
          Filter queue
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[420px]" side="right">
        <SheetHeader>
          <SheetTitle>Filter audit queue</SheetTitle>
          <SheetDescription>
            Narrow the operator view without leaving the event ledger.
          </SheetDescription>
        </SheetHeader>
        <SheetBody className="grid gap-2 pr-1">
          <Label htmlFor="sheet-play-search">Search</Label>
          <Input id="sheet-play-search" placeholder="Tenant or actor" />
        </SheetBody>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /filter queue/i }));

    const panel = screen.getByRole("dialog");
    await expect(panel).toBeVisible();
    await expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
  },
};
