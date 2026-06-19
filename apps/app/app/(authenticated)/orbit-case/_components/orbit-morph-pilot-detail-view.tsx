"use client";

import {
  Badge,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  blockRecipe,
} from "@repo/design-system";
import { cn } from "@repo/design-system/lib/utils";
import {
  ORBIT_MORPH_STATUSES,
  ORBIT_MORPH_STATUS_LABELS,
  resolveMorphLifecycleSegmentConfig,
  type MorphLifecycleSegment,
  type OrbitMorphStatus,
} from "@repo/orbit-case";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  updateMorphPilotRequest,
  type MorphPilotUpdateResult,
} from "@/app/actions/orbit-case/morph/update-pilot";
import { OrgMemberCombobox } from "./org-member-combobox";

import type { MorphPilotFieldConfig, MorphPilotRequestViewModel } from "@/lib/morph-pilot-ui";
import { toMorphPilotViewModel } from "@/lib/morph-pilot-ui";

interface OrbitMorphPilotDetailViewProps {
  fields: MorphPilotFieldConfig[];
  request: MorphPilotRequestViewModel;
  segment: MorphLifecycleSegment;
}

export function OrbitMorphPilotDetailView({
  fields,
  request: initialRequest,
  segment,
}: OrbitMorphPilotDetailViewProps) {
  const config = resolveMorphLifecycleSegmentConfig(segment);
  const router = useRouter();
  const [request, setRequest] = useState(initialRequest);
  const [title, setTitle] = useState(initialRequest.title);
  const [fieldValues, setFieldValues] = useState(initialRequest.fields);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const applyResult = (result: MorphPilotUpdateResult) => {
    setRequest(toMorphPilotViewModel(result));
    setTitle(result.title);
    setFieldValues(result.values);
  };

  const saveFields = (patch: Record<string, string | null | OrbitMorphStatus>) => {
    startTransition(async () => {
      setError(null);

      const values: Record<string, string | null> = { ...request.fields };

      for (const field of fields) {
        if (patch[field.key] !== undefined) {
          values[field.key] =
            typeof patch[field.key] === "string" ? patch[field.key] : null;
        }
      }

      const result = await updateMorphPilotRequest({
        assigneeId:
          patch.assigneeId === undefined ? request.assigneeId : patch.assigneeId,
        requestId: request.id,
        segment,
        status: (patch.status as OrbitMorphStatus | undefined) ?? request.status,
        title: typeof patch.title === "string" ? patch.title : request.title,
        values,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      applyResult(result.data);
      router.refresh();
    });
  };

  return (
    <section
      className={cn(
        blockRecipe("blockPanel", "blockPanelPadding"),
        "grid max-w-2xl gap-4"
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <h2 className={blockRecipe("blockTitle")}>{config.panelTitle}</h2>
        <Badge variant="outline">{ORBIT_MORPH_STATUS_LABELS[request.status]}</Badge>
      </div>

      <div className="grid gap-2">
        <Label htmlFor={`${segment}-title`}>Title</Label>
        <Input
          id={`${segment}-title`}
          onChange={(event) => setTitle(event.target.value)}
          value={title}
        />
      </div>

      {fields.map((field) => (
        <div className="grid gap-2" key={field.key}>
          <Label htmlFor={`${segment}-${field.key}`}>{field.label}</Label>
          <Input
            id={`${segment}-${field.key}`}
            onChange={(event) =>
              setFieldValues((current) => ({
                ...current,
                [field.key]: event.target.value,
              }))
            }
            placeholder={field.placeholder}
            value={fieldValues[field.key] ?? ""}
          />
        </div>
      ))}

      <div className="grid gap-2">
        <Label htmlFor={`${segment}-status`}>Status</Label>
        <Select
          onValueChange={(value) =>
            saveFields({ status: value as OrbitMorphStatus })
          }
          value={request.status}
        >
          <SelectTrigger id={`${segment}-status`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ORBIT_MORPH_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {ORBIT_MORPH_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <OrgMemberCombobox
          aria-label="Assignee"
          id={`${segment}-assignee`}
          onValueChange={(assigneeId) => saveFields({ assigneeId })}
          value={request.assigneeId}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          disabled={isPending}
          onClick={() => {
            const patch: Record<string, string | null> = {
              title: title.trim(),
            };

            for (const field of fields) {
              patch[field.key] = fieldValues[field.key]?.trim() || null;
            }

            saveFields(patch);
          }}
          type="button"
        >
          {isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>

      <dl className="grid gap-2 border-t pt-4 text-sm">
        <div>
          <dt className="text-muted-foreground">Created</dt>
          <dd>{new Date(request.createdAt).toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Updated</dt>
          <dd>{new Date(request.updatedAt).toLocaleString()}</dd>
        </div>
      </dl>

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
