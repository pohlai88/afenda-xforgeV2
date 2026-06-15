import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/Avatar",
  tags: ["autodocs", "afenda-ui", "primitive"],
  component: Avatar,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-muted p-6">
      <div className="mx-auto max-w-3xl rounded-lg border border-border-default bg-surface-raised p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="font-medium text-[12px] text-text-secondary uppercase tracking-wide">
              Operator presence
            </p>
            <h3 className="font-semibold text-[15px] text-text-primary">
              Payroll close reviewers
            </h3>
          </div>
          <div className="flex -space-x-2">
            {["JL", "MC", "OA"].map((initials) => (
              <Avatar
                className="border-2 border-surface-raised"
                key={initials}
                size="sm"
              >
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
        <div className="grid gap-2">
          {[
            ["Jordan Lee", "Tenant owner · NWT-1042", "JL", "Reviewing"],
            ["Maya Chen", "Governance lead · CTR-8831", "MC", "Queued"],
            ["Omar Ali", "Security admin · FBH-2219", "OA", "Escalated"],
          ].map(([name, role, initials, state]) => (
            <div
              className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md bg-surface-muted px-3 py-2"
              key={name}
            >
              <Avatar size="md">
                <AvatarImage alt={name} src="https://github.com/shadcn.png" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-[13px] text-text-primary">
                  {name}
                </p>
                <p className="text-[12px] text-text-secondary">{role}</p>
              </div>
              <span className="text-[12px] text-text-secondary">{state}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
