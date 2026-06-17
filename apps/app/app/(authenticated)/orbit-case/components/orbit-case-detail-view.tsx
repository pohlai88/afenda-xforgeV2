"use client";

import {
  Badge,
  Button,
  Calendar,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
  blockRecipe,
} from "@repo/design-system/design-system";
import { cn } from "@repo/design-system/lib/utils";
import type {
  OrbitCaseActivityDto,
  OrbitCaseAttachmentDto,
  OrbitCaseCommentDto,
  OrbitCaseDto,
  OrbitCasePriority,
  OrbitCaseStatus,
  OrbitObjectLinkDto,
  PushDestinationDefinition,
} from "@repo/orbit-case";
import {
  ORBIT_CASE_PRIORITIES,
  ORBIT_CASE_STATUSES,
  formatOrbitCaseAttachmentSize,
  formatOrbitCaseDueDateLabel,
  isOrbitCasePrivateBlobAccess,
} from "@repo/orbit-case";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import { useEffect, useRef, useState, useTransition } from "react";
import { removeAttachment } from "@/app/actions/orbit-case/attachment/delete";
import { uploadAttachment } from "@/app/actions/orbit-case/attachment/upload";
import { addComment } from "@/app/actions/orbit-case/comment/create";
import { deleteCase } from "@/app/actions/orbit-case/delete";
import { updateCase } from "@/app/actions/orbit-case/update";
import { watchCase } from "@/app/actions/orbit-case/watch";
import {
  executeCasePush,
  listPushDestinations,
} from "@/app/actions/orbit-case/push/execute";
import type { OrbitCaseAttachmentAccessPreference } from "@/lib/orbit-case-attachment-privacy";
import {
  getOrbitCaseAttachmentDownloadHref,
  readOrbitCaseAttachmentAccessPreference,
  writeOrbitCaseAttachmentAccessPreference,
} from "@/lib/orbit-case-attachment-privacy";

interface OrbitCaseDetailViewProps {
  activity: OrbitCaseActivityDto[];
  attachments: OrbitCaseAttachmentDto[];
  canHardDelete: boolean;
  comments: OrbitCaseCommentDto[];
  destinations: PushDestinationDefinition[];
  links: OrbitObjectLinkDto[];
  orbitCase: OrbitCaseDto;
  watching: boolean;
}

const statusLabel: Record<OrbitCaseStatus, string> = {
  backlog: "Backlog",
  ready: "Ready",
  doing: "Doing",
  waiting: "Waiting",
  done: "Done",
  cancelled: "Cancelled",
};

export function OrbitCaseDetailView({
  orbitCase: initialCase,
  comments: initialComments,
  attachments: initialAttachments,
  activity: initialActivity,
  links: initialLinks,
  destinations: initialDestinations,
  watching: initialWatching,
  canHardDelete,
}: OrbitCaseDetailViewProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [orbitCase, setOrbitCase] = useState(initialCase);
  const [comments, setComments] = useState(initialComments);
  const [attachments, setAttachments] = useState(initialAttachments);
  const [destinations, setDestinations] = useState(initialDestinations);
  const [watching, setWatching] = useState(initialWatching);
  const [title, setTitle] = useState(initialCase.title);
  const [description, setDescription] = useState(initialCase.description ?? "");
  const [commentBody, setCommentBody] = useState("");
  const [pushDestinationId, setPushDestinationId] = useState(
    initialDestinations[0]?.id ?? ""
  );
  const [pushTitle, setPushTitle] = useState(initialCase.title);
  const [pushAmount, setPushAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [attachmentAccess, setAttachmentAccess] =
    useState<OrbitCaseAttachmentAccessPreference>("public");

  useEffect(() => {
    setAttachmentAccess(readOrbitCaseAttachmentAccessPreference());
  }, []);

  const saveFields = (patch: {
    title?: string;
    description?: string | null;
    status?: OrbitCaseStatus;
    priority?: OrbitCasePriority;
    assigneeId?: string | null;
    dueAt?: string | null;
    tags?: string[];
  }) => {
    startTransition(async () => {
      setError(null);
      const result = await updateCase({ caseId: orbitCase.id, ...patch });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setOrbitCase(result.data);
      router.refresh();
    });
  };

  const handleSaveTitleDescription = () => {
    saveFields({
      title: title.trim(),
      description: description.trim() || null,
    });
  };

  const handleAddComment = () => {
    if (!commentBody.trim()) {
      return;
    }

    startTransition(async () => {
      setError(null);
      const result = await addComment({
        caseId: orbitCase.id,
        body: commentBody.trim(),
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setComments((current) => [...current, result.data]);
      setCommentBody("");
      router.refresh();
    });
  };

  const handleWatchToggle = (next: boolean) => {
    startTransition(async () => {
      const result = await watchCase({ caseId: orbitCase.id, watching: next });

      if (result.ok) {
        setWatching(result.data.watching);
      }
    });
  };

  const handleSoftDelete = () => {
    startTransition(async () => {
      const result = await deleteCase({ caseId: orbitCase.id });

      if (result.ok) {
        router.push("/orbit-case");
        router.refresh();
      }
    });
  };

  const handleHardDelete = () => {
    startTransition(async () => {
      const result = await deleteCase({ caseId: orbitCase.id, hard: true });

      if (result.ok) {
        router.push("/orbit-case");
        router.refresh();
      }
    });
  };

  const handlePush = () => {
    if (!pushDestinationId) {
      return;
    }

    startTransition(async () => {
      setError(null);
      const result = await executeCasePush({
        caseId: orbitCase.id,
        destinationId: pushDestinationId,
        idempotencyKey: crypto.randomUUID(),
        fieldValues: {
          title: pushTitle.trim() || orbitCase.title,
          amount: pushAmount.trim() || null,
        },
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (!result.data.ok) {
        if (result.data.code === "missing_fields") {
          setError(`Missing fields: ${result.data.missingFields?.join(", ")}`);
        } else {
          setError(result.data.code);
        }
        return;
      }

      const destResult = await listPushDestinations();
      if (destResult.ok) {
        setDestinations(destResult.data);
      }

      router.refresh();
    });
  };

  const handleUploadAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleAttachmentSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    startTransition(async () => {
      setError(null);
      const formData = new FormData();
      formData.set("caseId", orbitCase.id);
      formData.set("file", file);
      formData.set("blobAccess", attachmentAccess);

      const result = await uploadAttachment(formData);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setAttachments((current) => [result.data, ...current]);
      event.target.value = "";
      router.refresh();
    });
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    startTransition(async () => {
      setError(null);
      const result = await removeAttachment({ attachmentId });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setAttachments((current) =>
        current.filter((attachment) => attachment.id !== attachmentId)
      );
      router.refresh();
    });
  };

  const selectedDueDate = orbitCase.dueAt
    ? new Date(orbitCase.dueAt)
    : undefined;

  const handleDueDateSelect = (date: Date | undefined) => {
    if (!date) {
      saveFields({ dueAt: null });
      return;
    }

    saveFields({
      dueAt: new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      ).toISOString(),
    });
  };

  return (
    <div className="flex flex-col gap-6 p-[var(--xforge-space-8)]">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          className="text-muted-foreground text-sm hover:text-foreground"
          href="/orbit-case"
        >
          ← Orbit Case
        </Link>
        <Badge variant="outline">{statusLabel[orbitCase.status]}</Badge>
        {orbitCase.priority !== "none" ? (
          <Badge variant="soft">{orbitCase.priority}</Badge>
        ) : null}
      </div>

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="grid gap-6">
          <section
            className={cn(
              blockRecipe("blockPanel", "blockPanelPadding"),
              "grid gap-4"
            )}
          >
            <Input
              aria-label="Case title"
              className="font-medium text-lg"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
            <Textarea
              aria-label="Case description"
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Description"
              rows={4}
              value={description}
            />
            <Button disabled={isPending} onClick={handleSaveTitleDescription}>
              Save
            </Button>
          </section>

          <section
            className={cn(
              blockRecipe("blockPanel", "blockPanelPadding"),
              "grid gap-4"
            )}
          >
            <h2 className={blockRecipe("blockTitle")}>Comments</h2>
            <div className="grid gap-3">
              {comments.length === 0 ? (
                <p className="text-muted-foreground text-sm">No comments yet.</p>
              ) : (
                comments.map((comment) => (
                  <article
                    className="rounded-md border bg-background p-3 text-sm"
                    key={comment.id}
                  >
                    <p>{comment.body}</p>
                    <p className="mt-2 text-muted-foreground text-xs">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </article>
                ))
              )}
            </div>
            <Textarea
              aria-label="Comment"
              onChange={(event) => setCommentBody(event.target.value)}
              placeholder="Add a comment"
              rows={3}
              value={commentBody}
            />
            <Button
              disabled={isPending || !commentBody.trim()}
              onClick={handleAddComment}
            >
              Post comment
            </Button>
          </section>

          <section
            className={cn(
              blockRecipe("blockPanel", "blockPanelPadding"),
              "grid gap-4"
            )}
          >
            <h2 className={blockRecipe("blockTitle")}>Attachments</h2>
            <div className="grid max-w-sm gap-2">
              <Label htmlFor="attachment-access">Default privacy for uploads</Label>
              <Select
                onValueChange={(value) => {
                  const next = value as OrbitCaseAttachmentAccessPreference;
                  setAttachmentAccess(next);
                  writeOrbitCaseAttachmentAccessPreference(next);
                }}
                value={attachmentAccess}
              >
                <SelectTrigger id="attachment-access">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    Public link — anyone with the URL can open
                  </SelectItem>
                  <SelectItem value="private">
                    Private — org members only (authenticated download)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                Saved in this browser as your upload default. Private files never
                use a direct blob URL in the UI.
              </p>
            </div>
            <input
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              aria-label="Upload attachment"
              className="sr-only"
              onChange={handleAttachmentSelected}
              ref={fileInputRef}
              type="file"
            />
            <Button disabled={isPending} onClick={handleUploadAttachment}>
              Upload file
            </Button>
            {attachments.length === 0 ? (
              <p className="text-muted-foreground text-sm">No attachments yet.</p>
            ) : (
              attachments.map((attachment) => (
                <article
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-background p-3 text-sm"
                  key={attachment.id}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        className="font-medium hover:underline"
                        href={getOrbitCaseAttachmentDownloadHref(attachment)}
                        rel={
                          isOrbitCasePrivateBlobAccess(attachment.blobAccess)
                            ? undefined
                            : "noopener noreferrer"
                        }
                        target={
                          isOrbitCasePrivateBlobAccess(attachment.blobAccess)
                            ? undefined
                            : "_blank"
                        }
                      >
                        {attachment.fileName}
                      </a>
                      {isOrbitCasePrivateBlobAccess(attachment.blobAccess) ? (
                        <Badge variant="outline">Private</Badge>
                      ) : null}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {formatOrbitCaseAttachmentSize(attachment.sizeBytes)} ·{" "}
                      {new Date(attachment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    disabled={isPending}
                    onClick={() => handleDeleteAttachment(attachment.id)}
                    size="sm"
                    variant="secondary"
                  >
                    Remove
                  </Button>
                </article>
              ))
            )}
          </section>

          <section
            className={cn(
              blockRecipe("blockPanel", "blockPanelPadding"),
              "grid gap-3"
            )}
          >
            <h2 className={blockRecipe("blockTitle")}>Activity</h2>
            {initialActivity.length === 0 ? (
              <p className="text-muted-foreground text-sm">No activity yet.</p>
            ) : (
              initialActivity.map((entry) => (
                <div className="border-border border-b pb-2 text-sm" key={entry.id}>
                  <p>{entry.summary}</p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </section>

          {destinations.length > 0 ? (
            <section
              className={cn(
                blockRecipe("blockPanel", "blockPanelPadding"),
                "grid gap-4"
              )}
            >
              <h2 className={blockRecipe("blockTitle")}>Push to module</h2>
              <div className="grid gap-2">
                <Label htmlFor="push-destination">Destination</Label>
                <Select
                  onValueChange={setPushDestinationId}
                  value={pushDestinationId}
                >
                  <SelectTrigger id="push-destination">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((destination) => (
                      <SelectItem key={destination.id} value={destination.id}>
                        {destination.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input
                aria-label="Push title"
                onChange={(event) => setPushTitle(event.target.value)}
                placeholder="Title"
                value={pushTitle}
              />
              <Input
                aria-label="Push amount"
                onChange={(event) => setPushAmount(event.target.value)}
                placeholder="Amount (optional)"
                value={pushAmount}
              />
              <Button disabled={isPending || !pushDestinationId} onClick={handlePush}>
                Push
              </Button>
            </section>
          ) : null}

          {initialLinks.length > 0 ? (
            <section
              className={cn(
                blockRecipe("blockPanel", "blockPanelPadding"),
                "grid gap-3"
              )}
            >
              <h2 className={blockRecipe("blockTitle")}>Links</h2>
              {initialLinks.map((link) => (
                <div className="text-sm" key={link.id}>
                  <p className="font-medium">
                    {link.targetType} · {link.targetId}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(link.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </section>
          ) : null}
        </div>

        <aside
          className={cn(
            blockRecipe("blockPanel", "blockPanelPadding"),
            "grid h-fit gap-4"
          )}
        >
          <div className="grid gap-2">
            <Label htmlFor="case-status">Status</Label>
            <Select
              onValueChange={(value) =>
                saveFields({ status: value as OrbitCaseStatus })
              }
              value={orbitCase.status}
            >
              <SelectTrigger id="case-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORBIT_CASE_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {statusLabel[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="case-priority">Priority</Label>
            <Select
              onValueChange={(value) =>
                saveFields({ priority: value as OrbitCasePriority })
              }
              value={orbitCase.priority}
            >
              <SelectTrigger id="case-priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORBIT_CASE_PRIORITIES.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="case-watch">Watch</Label>
            <Switch
              checked={watching}
              id="case-watch"
              onCheckedChange={handleWatchToggle}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="case-due-date">Due date</Label>
            <div className="flex flex-wrap items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button id="case-due-date" variant="secondary">
                    {formatOrbitCaseDueDateLabel(orbitCase.dueAt) ??
                      "Set due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    onSelect={handleDueDateSelect}
                    selected={selectedDueDate}
                  />
                </PopoverContent>
              </Popover>
              {orbitCase.dueAt ? (
                <Button
                  disabled={isPending}
                  onClick={() => saveFields({ dueAt: null })}
                  size="sm"
                  variant="quiet"
                >
                  Clear
                </Button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="case-tags">Tags (comma-separated)</Label>
            <Input
              id="case-tags"
              onBlur={(event) => {
                const tags = event.target.value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean);
                saveFields({ tags });
              }}
              defaultValue={orbitCase.tags.join(", ")}
            />
          </div>

          <div className="grid gap-2 border-t pt-4">
            <Button
              disabled={isPending}
              onClick={handleSoftDelete}
              variant="secondary"
            >
              Archive case
            </Button>
            {canHardDelete ? (
              <Button
                disabled={isPending}
                onClick={handleHardDelete}
                variant="critical"
              >
                Delete permanently
              </Button>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
