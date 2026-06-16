import { Badge, blockRecipe } from "@repo/design-system/design-system";
import { cn } from "@repo/design-system/lib/utils";
import {
  ORBIT_CASE_BOARD_COLUMNS,
  type OrbitCasePriority,
  type OrbitCaseStatus,
} from "@repo/orbit-case";
import type { Meta, StoryObj } from "@storybook/react";

interface MockCase {
  id: string;
  priority: OrbitCasePriority;
  status: OrbitCaseStatus;
  title: string;
}

const mockCases: MockCase[] = [
  { id: "1", title: "Call supplier", status: "backlog", priority: "medium" },
  { id: "2", title: "Review contract", status: "ready", priority: "high" },
  { id: "3", title: "Need RM50k budget", status: "doing", priority: "urgent" },
];

const statusLabel: Record<OrbitCaseStatus, string> = {
  backlog: "Backlog",
  ready: "Ready",
  doing: "Doing",
  waiting: "Waiting",
  done: "Done",
  cancelled: "Cancelled",
};

function OrbitCaseKanbanPreview() {
  return (
    <div className="grid gap-4 p-6 md:grid-cols-5">
      {ORBIT_CASE_BOARD_COLUMNS.map((status) => (
        <section
          className={cn(
            blockRecipe("blockPanel", "blockPanelPadding"),
            "grid min-h-48 content-start gap-2"
          )}
          key={status}
        >
          <h3 className="font-medium text-sm">{statusLabel[status]}</h3>
          {mockCases
            .filter((orbitCase) => orbitCase.status === status)
            .map((orbitCase) => (
              <div
                className="rounded-md border bg-background p-3 text-sm"
                key={orbitCase.id}
              >
                <p className="font-medium">{orbitCase.title}</p>
                <Badge className="mt-2" variant="outline">
                  {orbitCase.priority}
                </Badge>
              </div>
            ))}
        </section>
      ))}
    </div>
  );
}

const meta = {
  title: "Blocks/Workflow/Orbit Case",
  tags: ["autodocs", "block"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const KanbanBoard: Story = {
  name: "Kanban Board",
  render: () => <OrbitCaseKanbanPreview />,
};

function OrbitCaseDetailPreview() {
  return (
    <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_240px]">
      <div className="grid gap-4">
        <section
          className={cn(
            blockRecipe("blockPanel", "blockPanelPadding"),
            "grid gap-2"
          )}
        >
          <h1 className="font-medium text-lg">Need RM50k budget</h1>
          <p className="text-muted-foreground text-sm">
            Supplier quote exceeds current allocation.
          </p>
        </section>
        <section
          className={cn(
            blockRecipe("blockPanel", "blockPanelPadding"),
            "grid gap-2"
          )}
        >
          <h2 className="font-medium text-sm">Activity</h2>
          <p className="text-sm">Status changed to doing</p>
          <p className="text-sm">Created this case</p>
        </section>
      </div>
      <aside
        className={cn(
          blockRecipe("blockPanel", "blockPanelPadding"),
          "grid gap-3"
        )}
      >
        <Badge variant="outline">Doing</Badge>
        <Badge variant="soft">urgent</Badge>
      </aside>
    </div>
  );
}

export const CaseDetail: Story = {
  name: "Case Detail",
  render: () => <OrbitCaseDetailPreview />,
};
