import { Badge } from "@repo/design-system/components/afenda-ui/badge";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@repo/design-system/components/afenda-ui/context-menu";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/ContextMenu",
  component: ContextMenu,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Afenda context menu primitive for right-click row and canvas actions in operator workspaces.",
      },
    },
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="block w-[760px] overflow-hidden rounded-[var(--card-radius)] border border-border-default bg-surface text-left">
        <div className="border-border-default border-b px-5 py-4">
          <p className="font-medium text-sm text-text-primary">
            Exceptions board
          </p>
          <p className="text-[12px] text-text-secondary">
            Right click a record row to open contextual workflow actions.
          </p>
        </div>
        <div className="grid grid-cols-[1fr_120px_120px] items-center gap-3 bg-surface-muted px-5 py-4 text-[13px]">
          <div>
            <p className="font-medium text-text-primary">
              AP-4471 duplicate vendor payment
            </p>
            <p className="text-text-secondary">
              Invoice matched to an existing approved payment
            </p>
          </div>
          <Badge tone="critical" variant="outline">
            Hold
          </Badge>
          <span className="text-text-secondary">Finance Ops</span>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel>Record actions</ContextMenuLabel>
        <ContextMenuItem>
          Open exception
          <ContextMenuShortcut>Enter</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>Assign reviewer</ContextMenuItem>
        <ContextMenuItem>Copy exception ID</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Release hold</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
