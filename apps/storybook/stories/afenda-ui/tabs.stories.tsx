import {
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/design-system";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Afenda UI/Tabs",
  component: Tabs,
  tags: ["autodocs", "afenda-ui", "primitive"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Tabs previewed as operational record views with dense metadata.",
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const RecordViews: Story = {
  render: () => (
    <Tabs
      className="w-[620px] rounded-[var(--card-radius)] border border-border-default bg-surface-raised p-4 shadow-panel"
      defaultValue="overview"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <h2 className="font-semibold text-[14px] text-text-primary">
            Employee record
          </h2>
          <p className="text-[12px] text-text-secondary">
            Switch between summary, audit, and access without leaving context.
          </p>
        </div>
        <Badge tone="success" variant="outline">
          Active
        </Badge>
      </div>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="audit">Audit</TabsTrigger>
        <TabsTrigger value="access">Access</TabsTrigger>
      </TabsList>
      <TabsContent
        className="pt-4 text-[13px] text-text-secondary"
        value="overview"
      >
        Payroll profile, compensation band, and current assignment are in good
        standing.
      </TabsContent>
      <TabsContent
        className="pt-4 text-[13px] text-text-secondary"
        value="audit"
      >
        Three approval changes were recorded in the last seven days.
      </TabsContent>
      <TabsContent
        className="pt-4 text-[13px] text-text-secondary"
        value="access"
      >
        Workspace permissions are limited to HR operations and payroll review.
      </TabsContent>
    </Tabs>
  ),
};
