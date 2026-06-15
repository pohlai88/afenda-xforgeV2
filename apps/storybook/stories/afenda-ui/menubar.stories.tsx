import { Badge } from "@repo/design-system/components/afenda-ui/badge";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@repo/design-system/components/afenda-ui/menubar";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/Menubar",
  component: Menubar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Afenda menubar primitive for app command chrome and power-user operational surfaces. It should read as a horizontal command bar, not a floating pill.",
      },
    },
  },
} satisfies Meta<typeof Menubar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[760px] overflow-hidden rounded-[var(--card-radius)] border border-border-default bg-surface">
      <div className="flex items-center justify-between border-border-default border-b px-4 py-2">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New control record
                <MenubarShortcut>Ctrl N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>Export current view</MenubarItem>
              <MenubarSeparator />
              <MenubarItem variant="destructive">Archive selection</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Audit trail</MenubarItem>
              <MenubarItem>Metadata panel</MenubarItem>
              <MenubarItem>Exception timeline</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Workflow</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Assign reviewer</MenubarItem>
              <MenubarItem>
                Approve selected
                <MenubarShortcut>Ctrl A</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <Badge tone="info" variant="soft">
          Operator console
        </Badge>
      </div>
      <div className="grid min-h-40 grid-cols-[180px_1fr] text-[13px]">
        <div className="border-border-default border-r bg-surface-muted p-4 text-text-secondary">
          Finance controls
        </div>
        <div className="p-4">
          <p className="font-medium text-text-primary">Close readiness</p>
          <p className="mt-1 text-text-secondary">
            App command chrome remains attached to a real operational surface.
          </p>
        </div>
      </div>
    </div>
  ),
};
