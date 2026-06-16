import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Button,
} from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";
import { Trash2Icon } from "lucide-react";

const meta = {
  title: "Afenda UI/AlertDialog",
  component: AlertDialog,
  tags: ["autodocs", "afenda-ui", "primitive"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Afenda alert dialog primitive. Used for irreversible or high-blast-radius actions where the consequence must be explicit.",
      },
    },
  },
} satisfies Meta<typeof AlertDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[720px] overflow-hidden rounded-[var(--card-radius)] border border-border-default bg-surface">
      <div className="flex items-center justify-between border-border-default border-b px-5 py-4">
        <div>
          <p className="font-medium text-sm text-text-primary">
            Dormant account review
          </p>
          <p className="text-[12px] text-text-secondary">
            Quarterly control check for privileged users
          </p>
        </div>
        <Badge tone="critical" variant="soft">
          Action required
        </Badge>
      </div>
      <div className="grid grid-cols-[1fr_140px_150px] items-center gap-3 px-5 py-4 text-[13px]">
        <div>
          <p className="font-medium text-text-primary">Jordan Lee</p>
          <p className="text-text-secondary">
            Payroll administrator · last active 117 days ago
          </p>
        </div>
        <Badge tone="warning" variant="outline">
          Privileged
        </Badge>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="critical">
              <Trash2Icon className="size-4" />
              Remove access
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-[500px]">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Remove Jordan Lee from Northwind Trading?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This revokes payroll administrator access immediately. Existing
                records stay in the audit trail and cannot be edited by Jordan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="rounded-md border border-border-default bg-surface-muted px-4 py-3 text-[13px] text-text-secondary">
              Impact: 6 scheduled exports and 2 open approval tasks will be
              reassigned to the finance control owner.
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Remove access</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  ),
};
