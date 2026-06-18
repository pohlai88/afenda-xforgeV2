import { Badge, blockRecipe } from "@repo/design-system";
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

function OrbitCaseTimelinePreview() {
  const groups = [
    {
      label: "Overdue",
      cases: [{ id: "1", title: "Renew vendor contract", status: "doing" as const, dueAt: "2026-06-10T00:00:00.000Z" }],
    },
    {
      label: "Today",
      cases: [{ id: "2", title: "Approve PO batch", status: "ready" as const, dueAt: "2026-06-17T00:00:00.000Z" }],
    },
    {
      label: "No due date",
      cases: [{ id: "3", title: "Research ERP module", status: "backlog" as const, dueAt: null }],
    },
  ];

  return (
    <div className="grid gap-4 p-6">
      {groups.map((group) => (
        <section
          className={cn(
            blockRecipe("blockPanel", "blockPanelPadding"),
            "grid gap-2"
          )}
          key={group.label}
        >
          <h3 className="font-medium text-sm">{group.label}</h3>
          {group.cases.map((orbitCase) => (
            <div className="rounded-md border bg-background p-3 text-sm" key={orbitCase.id}>
              <p className="font-medium">{orbitCase.title}</p>
              <Badge className="mt-2" variant="outline">
                {statusLabel[orbitCase.status]}
              </Badge>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

export const TimelineView: Story = {
  name: "Timeline View",
  render: () => <OrbitCaseTimelinePreview />,
};

function OrbitCaseCalendarPreview() {
  return (
    <div className="grid gap-4 p-6 lg:grid-cols-2">
      <section className={cn(blockRecipe("blockPanel", "blockPanelPadding"), "text-sm")}>
        <p className="font-medium">June 2026</p>
        <p className="mt-2 text-muted-foreground">Days with due dates highlighted.</p>
      </section>
      <section className={cn(blockRecipe("blockPanel", "blockPanelPadding"), "grid gap-2")}>
        <h3 className="font-medium text-sm">Due 17 Jun 2026</h3>
        <div className="rounded-md border bg-background p-3 text-sm">
          <p className="font-medium">Approve PO batch</p>
          <Badge className="mt-2" variant="outline">
            Ready
          </Badge>
        </div>
      </section>
    </div>
  );
}

export const CalendarView: Story = {
  name: "Calendar View",
  render: () => <OrbitCaseCalendarPreview />,
};

function OrbitCasePushPanelPreview() {
  return (
    <section
      className={cn(
        blockRecipe("blockPanel", "blockPanelPadding"),
        "grid max-w-xl gap-4 p-6"
      )}
    >
      <h2 className="font-medium text-sm">Push to module</h2>
      <div className="grid gap-2">
        <p className="text-muted-foreground text-xs">Destination</p>
        <Badge variant="outline">Budget Request</Badge>
      </div>
      <div className="grid gap-2">
        <p className="text-muted-foreground text-xs">Title *</p>
        <div className="rounded-md border px-3 py-2 text-sm">Need RM50k budget</div>
      </div>
      <div className="grid gap-2">
        <p className="text-muted-foreground text-xs">Amount</p>
        <div className="rounded-md border px-3 py-2 text-sm">RM50000</div>
      </div>
      <Badge variant="soft">Push</Badge>
    </section>
  );
}

export const PushPanel: Story = {
  name: "Push Panel",
  render: () => <OrbitCasePushPanelPreview />,
};

function OrbitCaseLinksPreview() {
  return (
    <section
      className={cn(
        blockRecipe("blockPanel", "blockPanelPadding"),
        "grid max-w-xl gap-3 p-6"
      )}
    >
      <h2 className="font-medium text-sm">Links</h2>
      <div className="text-sm">
        <p className="font-medium text-primary">Budget Request</p>
        <p className="text-muted-foreground text-xs">17 Jun 2026, 10:30</p>
      </div>
    </section>
  );
}

export const LinkedProjections: Story = {
  name: "Linked Projections",
  render: () => <OrbitCaseLinksPreview />,
};

function OrbitCaseMemberPickerPreview() {
  return (
    <section
      className={cn(
        blockRecipe("blockPanel", "blockPanelPadding"),
        "grid max-w-sm gap-3 p-6"
      )}
    >
      <p className="text-muted-foreground text-xs">Assignee</p>
      <div className="rounded-md border px-3 py-2 text-sm">Alex Morgan</div>
      <p className="text-muted-foreground text-xs">Owner</p>
      <div className="rounded-md border px-3 py-2 text-sm">Jordan Lee</div>
    </section>
  );
}

export const MemberPicker: Story = {
  name: "Member Picker",
  render: () => <OrbitCaseMemberPickerPreview />,
};
