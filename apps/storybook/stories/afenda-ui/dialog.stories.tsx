import {
  Badge,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/design-system";
import type { Meta, StoryObj } from "@storybook/react";
import { ChevronRightIcon, CircleAlertIcon } from "lucide-react";
import { expect, screen } from "storybook/test";

import { interactionStoryParameters } from "../../.storybook/essentials";

const REVIEW_REQUEST_NAME = /review request/i;
const REVIEW_PAYROLL_EXPORT_ACCESS_TEXT = /review payroll export access/i;

const meta = {
  title: "Afenda UI/Dialog",
  component: Dialog,
  tags: ["autodocs", "afenda-ui", "primitive"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Afenda dialog primitive. Calm, token-driven modal chrome for confirmations, detail views, and short operator workflows.",
      },
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[720px] overflow-hidden rounded-[var(--card-radius)] border border-border-default bg-surface">
      <div className="flex items-center justify-between border-border-default border-b px-5 py-4">
        <div>
          <p className="font-medium text-sm text-text-primary">
            Approval queue
          </p>
          <p className="text-[12px] text-text-secondary">
            Tenant permission changes pending reviewer action
          </p>
        </div>
        <Badge tone="warning" variant="soft">
          3 pending
        </Badge>
      </div>
      <div className="divide-y divide-border-default">
        {[
          ["EXP-1184", "Payroll export access", "Jordan Lee", "Medium"],
          ["VEN-2041", "Vendor bank update", "Mina Patel", "High"],
          ["INV-4430", "Invoice release hold", "Rowan Chen", "Low"],
        ].map(([id, scope, owner, risk]) => (
          <div
            className="grid grid-cols-[96px_1fr_120px_120px] items-center gap-3 px-5 py-3 text-[13px]"
            key={id}
          >
            <span className="font-mono text-text-secondary">{id}</span>
            <span className="font-medium text-text-primary">{scope}</span>
            <span className="text-text-secondary">{owner}</span>
            <span className="flex items-center justify-between gap-2">
              <span className="text-text-secondary">{risk}</span>
              {id === "EXP-1184" ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="secondary">
                      Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                      <DialogTitle>Review payroll export access</DialogTitle>
                      <DialogDescription>
                        This request affects tenant-scoped finance data. Check
                        the control owner and audit context before approving.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-3 rounded-md border border-border-default bg-surface-muted px-4 py-3 text-[13px]">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-text-secondary">Requester</span>
                        <span>Jordan Lee</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-text-secondary">Tenant</span>
                        <span>Northwind Trading</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-text-secondary">Control</span>
                        <span>FIN-EXPORT-02</span>
                      </div>
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="quiet">Send back</Button>
                      </DialogClose>
                      <Button variant="primary">
                        Approve request
                        <ChevronRightIcon className="size-4" />
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : null}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Warning: Story = {
  render: () => (
    <div className="w-[680px] overflow-hidden rounded-[var(--card-radius)] border border-border-default bg-surface">
      <div className="border-border-default border-b px-5 py-4">
        <p className="font-medium text-sm text-text-primary">Access review</p>
        <p className="text-[12px] text-text-secondary">
          Operators remove stale accounts from the tenant roster.
        </p>
      </div>
      <div className="grid grid-cols-[1fr_120px_140px] items-center gap-3 px-5 py-4 text-[13px]">
        <div>
          <p className="font-medium text-text-primary">Samir Wallace</p>
          <p className="text-text-secondary">No login activity for 94 days</p>
        </div>
        <Badge tone="critical" variant="outline">
          Dormant
        </Badge>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="critical">Remove access</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Remove user from tenant</DialogTitle>
              <DialogDescription>
                This will revoke access immediately and cannot be undone from
                the operator console.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-start gap-3 rounded-md border border-critical/30 bg-critical-muted px-4 py-3 text-[13px]">
              <CircleAlertIcon className="mt-0.5 size-4 text-critical" />
              <p className="text-text-primary">
                Samir will lose access to active workflows, saved reports, and
                approval history. The audit trail remains retained.
              </p>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="quiet">Cancel</Button>
              </DialogClose>
              <Button variant="critical">Remove access</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Review request</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Review payroll export access</DialogTitle>
          <DialogDescription>
            Check the control owner and audit context before approving.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="quiet">Cancel</Button>
          </DialogClose>
          <Button variant="primary">Approve request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: REVIEW_REQUEST_NAME })
    );

    const dialog = screen.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(
      screen.getByText(REVIEW_PAYROLL_EXPORT_ACCESS_TEXT)
    ).toBeInTheDocument();
  },
};
