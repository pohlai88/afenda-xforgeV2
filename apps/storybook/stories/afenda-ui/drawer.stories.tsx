import {
  Badge,
  Button,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";

import { mobileViewportParameters } from "../../.storybook/essentials";

const meta = {
  title: "Afenda UI/Drawer",
  tags: ["autodocs", "afenda-ui", "primitive"],
  component: Drawer,
  parameters: {
    ...mobileViewportParameters,
    docs: {
      description: {
        component:
          "Afenda drawer primitive for short, bottom-anchored operator workflows that should preserve page context.",
      },
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[760px] overflow-hidden rounded-[var(--card-radius)] border border-border-default bg-surface">
      <div className="flex items-center justify-between border-border-default border-b px-5 py-4">
        <div>
          <p className="font-medium text-sm text-text-primary">
            Month-end close
          </p>
          <p className="text-[12px] text-text-primary">
            Reconcile exceptions before releasing finance exports
          </p>
        </div>
        <Badge tone="warning" variant="solid">
          5 exceptions
        </Badge>
      </div>
      <div className="grid grid-cols-[1fr_130px_150px] items-center gap-3 px-5 py-4 text-[13px]">
        <div>
          <p className="font-medium text-text-primary">
            AP-4471 · duplicate vendor payment
          </p>
          <p className="text-text-primary">
            Matched by invoice number and bank account ending 0842
          </p>
        </div>
        <Badge tone="critical" variant="solid">
          Hold
        </Badge>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="secondary">Resolve exception</Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-[640px]">
              <DrawerHeader>
                <DrawerTitle>Resolve payment exception</DrawerTitle>
                <DrawerDescription>
                  Review the matched records, choose an outcome, and keep the
                  audit note attached to the close packet.
                </DrawerDescription>
              </DrawerHeader>
              <div className="grid gap-3 px-4 pb-4 text-[13px]">
                <div className="rounded-md border border-border-default bg-surface-muted px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-text-primary">Exception</span>
                    <span>AP-4471</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="text-text-primary">Suggested owner</span>
                    <span>Finance Ops</span>
                  </div>
                </div>
                <p className="text-text-primary">
                  Drawer content is constrained so the preview reads as a
                  workflow surface instead of a full-page takeover.
                </p>
              </div>
              <DrawerFooter>
                <Button variant="secondary">Escalate</Button>
                <Button variant="primary">Mark as reviewed</Button>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  ),
};
