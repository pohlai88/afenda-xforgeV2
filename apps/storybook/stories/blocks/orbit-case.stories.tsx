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
  title: "Blocks/Orbit Case",
  tags: ["autodocs", "block"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const KanbanBoard: Story = {
  name: "Kanban Board",
  render: () => <OrbitCaseKanbanPreview />,
};
