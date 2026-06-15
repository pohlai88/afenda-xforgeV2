import {
  Badge,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";

import { layoutStoryParameters } from "../../.storybook/essentials";

const meta = {
  title: "Afenda UI/NavigationMenu",
  tags: ["autodocs", "afenda-ui", "primitive"],
  component: NavigationMenu,
  parameters: {
    ...layoutStoryParameters,
    layout: "centered",
    docs: {
      description: {
        component:
          "Afenda navigation menu primitive for module switching inside ERP and operator shells.",
      },
    },
  },
} satisfies Meta<typeof NavigationMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[820px] overflow-hidden rounded-[var(--card-radius)] border border-border-default bg-surface">
      <div className="flex items-center justify-between border-border-default border-b px-5 py-3">
        <div>
          <p className="font-medium text-sm text-text-primary">Afenda Ops</p>
          <p className="text-[12px] text-text-secondary">
            Module navigation for back-office workflows
          </p>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Modules</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[420px] grid-cols-2 gap-2 p-2">
                  <NavigationMenuLink href="#">
                    <span className="font-medium">Finance controls</span>
                    <span className="text-[12px] text-text-secondary">
                      Invoices, exports, payments, and approval holds.
                    </span>
                  </NavigationMenuLink>
                  <NavigationMenuLink href="#">
                    <span className="font-medium">Identity lifecycle</span>
                    <span className="text-[12px] text-text-secondary">
                      Users, roles, SSO mappings, and access reviews.
                    </span>
                  </NavigationMenuLink>
                  <NavigationMenuLink href="#">
                    <span className="font-medium">Vendor master</span>
                    <span className="text-[12px] text-text-secondary">
                      Bank changes, supplier risk, and duplicate checks.
                    </span>
                  </NavigationMenuLink>
                  <NavigationMenuLink href="#">
                    <span className="font-medium">Audit center</span>
                    <span className="text-[12px] text-text-secondary">
                      Evidence packets, control logs, and reviewer notes.
                    </span>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="grid grid-cols-[180px_1fr] text-[13px]">
        <div className="border-border-default border-r bg-surface-muted p-4 text-text-secondary">
          Active: Finance controls
        </div>
        <div className="grid gap-3 p-4">
          <div className="flex items-center justify-between rounded-md border border-border-default px-4 py-3">
            <span className="font-medium text-text-primary">
              Payroll export approval
            </span>
            <Badge tone="warning" variant="soft">
              Pending
            </Badge>
          </div>
        </div>
      </div>
    </div>
  ),
};
