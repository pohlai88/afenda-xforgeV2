"use client";

import {
  Badge,
  Button,
  blockRecipe,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@repo/design-system/design-system";
import { cn } from "@repo/design-system/lib/utils";
import type {
  OrbitCaseBoardColumnDto,
  OrbitCaseDto,
  OrbitCaseStatus,
} from "@repo/orbit-case";
import { ORBIT_CASE_STATUSES } from "@repo/orbit-case";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { moveCaseStatus } from "@/app/actions/orbit-case/board";
import { createCase } from "@/app/actions/orbit-case/create";
import { listCases } from "@/app/actions/orbit-case/list";

interface OrbitCaseWorkspaceProps {
  initialBoard: OrbitCaseBoardColumnDto[];
  initialCases: OrbitCaseDto[];
}

const statusLabel: Record<OrbitCaseStatus, string> = {
  backlog: "Backlog",
  ready: "Ready",
  doing: "Doing",
  waiting: "Waiting",
  done: "Done",
  cancelled: "Cancelled",
};

export function OrbitCaseWorkspace({
  initialCases,
  initialBoard,
}: OrbitCaseWorkspaceProps) {
  const router = useRouter();
  const [cases, setCases] = useState(initialCases);
  const [board, setBoard] = useState(initialBoard);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterAssignee, setFilterAssignee] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    if (!title.trim()) {
      return;
    }

    startTransition(async () => {
      const result = await createCase({
        title: title.trim(),
        description: description.trim() || undefined,
      });

      if (!result.ok) {
        return;
      }

      const created = result.data;
      setTitle("");
      setDescription("");
      router.push(`/orbit-case/${created.id}`);
      router.refresh();
    });
  };

  const handleMove = (caseId: string, status: OrbitCaseStatus) => {
    startTransition(async () => {
      const result = await moveCaseStatus({ caseId, status });

      if (!result.ok) {
        return;
      }

      setBoard(result.data.columns);
      setCases(result.data.columns.flatMap((column) => column.cases));
      router.refresh();
    });
  };

  const applyFilters = () => {
    startTransition(async () => {
      const result = await listCases({
        ...(filterStatus !== "all"
          ? { status: filterStatus as OrbitCaseStatus }
          : {}),
        ...(filterAssignee.trim()
          ? { assigneeId: filterAssignee.trim() }
          : {}),
        ...(filterTag.trim() ? { tag: filterTag.trim() } : {}),
      });

      if (result.ok) {
        setCases(result.data);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 p-[var(--xforge-space-8)]">
      <section
        className={cn(
          blockRecipe("blockPanel", "blockPanelPadding"),
          "grid gap-4"
        )}
      >
        <h2 className={blockRecipe("blockTitle")}>Capture work</h2>
        <p className={blockRecipe("blockDescription")}>
          Start with a title — classify and push to governed modules later.
        </p>
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <Input
            aria-label="Orbit Case title"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What needs attention?"
            value={title}
          />
          <Textarea
            aria-label="Orbit Case description"
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional context"
            rows={1}
            value={description}
          />
          <Button disabled={isPending || !title.trim()} onClick={handleCreate}>
            Create case
          </Button>
        </div>
      </section>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
        </TabsList>
        <TabsContent className="mt-4" value="list">
          <div
            className={cn(
              blockRecipe("blockPanel", "blockPanelPadding"),
              "mb-4 grid gap-3 md:grid-cols-[160px_1fr_1fr_auto]"
            )}
          >
            <Select onValueChange={setFilterStatus} value={filterStatus}>
              <SelectTrigger aria-label="Filter by status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {ORBIT_CASE_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {statusLabel[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              aria-label="Filter by assignee"
              onChange={(event) => setFilterAssignee(event.target.value)}
              placeholder="Assignee ID"
              value={filterAssignee}
            />
            <Input
              aria-label="Filter by tag"
              onChange={(event) => setFilterTag(event.target.value)}
              placeholder="Tag"
              value={filterTag}
            />
            <Button disabled={isPending} onClick={applyFilters} variant="secondary">
              Apply filters
            </Button>
          </div>
          <div className="grid gap-3">
            {cases.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No Orbit Cases yet.
              </p>
            ) : (
              cases.map((orbitCase) => (
                <Link href={`/orbit-case/${orbitCase.id}`} key={orbitCase.id}>
                  <article
                    className={cn(
                      blockRecipe("blockPanel", "blockPanelPadding"),
                      "grid gap-2 transition-colors hover:bg-muted/30"
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium">{orbitCase.title}</h3>
                      <Badge variant="outline">
                        {statusLabel[orbitCase.status]}
                      </Badge>
                      {orbitCase.priority !== "none" ? (
                        <Badge variant="soft">{orbitCase.priority}</Badge>
                      ) : null}
                    </div>
                    {orbitCase.description ? (
                      <p className="text-muted-foreground text-sm">
                        {orbitCase.description}
                      </p>
                    ) : null}
                  </article>
                </Link>
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent className="mt-4" value="kanban">
          <div className="grid gap-4 md:grid-cols-5">
            {board.map((column) => (
              <section
                className={cn(
                  blockRecipe("blockPanel", "blockPanelPadding"),
                  "grid min-h-48 content-start gap-2"
                )}
                key={column.status}
              >
                <h3 className="font-medium text-sm">
                  {statusLabel[column.status]}
                </h3>
                {column.cases.map((orbitCase) => (
                  <div
                    className="rounded-md border bg-background p-3 text-sm"
                    key={orbitCase.id}
                  >
                    <Link
                      className="font-medium hover:underline"
                      href={`/orbit-case/${orbitCase.id}`}
                    >
                      {orbitCase.title}
                    </Link>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {column.status !== "doing" ? (
                        <Button
                          disabled={isPending}
                          onClick={() => handleMove(orbitCase.id, "doing")}
                          size="sm"
                          variant="secondary"
                        >
                          Start
                        </Button>
                      ) : null}
                      {column.status !== "done" ? (
                        <Button
                          disabled={isPending}
                          onClick={() => handleMove(orbitCase.id, "done")}
                          size="sm"
                          variant="quiet"
                        >
                          Done
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
