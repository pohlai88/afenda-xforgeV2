"use client";

import {
  Badge,
  Button,
  Input,
  blockRecipe,
  Label,
} from "@repo/design-system/design-system";
import { cn } from "@repo/design-system/lib/utils";
import type { PushDestinationDefinition } from "@repo/orbit-case";
import type { PushTemplateDefinition } from "@repo/orbit-case";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  removePushDestination,
  removePushTemplate,
  savePushDestination,
  savePushTemplate,
} from "@/app/actions/orbit-case/registry/admin";

interface OrbitPushRegistryAdminProps {
  destinations: Array<{
    rowId: string;
    organizationId: string | null;
    definition: PushDestinationDefinition;
    enabled: boolean;
    isSystem: boolean;
  }>;
  templates: Array<{
    rowId: string;
    organizationId: string | null;
    definition: PushTemplateDefinition;
    isSystem: boolean;
  }>;
}

export function OrbitPushRegistryAdmin({
  destinations,
  templates,
}: OrbitPushRegistryAdminProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [destinationId, setDestinationId] = useState("");
  const [destinationLabel, setDestinationLabel] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [capabilities, setCapabilities] = useState("budget");
  const [roles, setRoles] = useState("owner,editor");

  const handleSaveDestination = () => {
    if (!destinationId.trim() || !destinationLabel.trim() || !templateId.trim()) {
      return;
    }

    startTransition(async () => {
      setError(null);
      const result = await savePushDestination({
        id: destinationId.trim(),
        label: destinationLabel.trim(),
        templateId: templateId.trim(),
        requiredCapabilities: capabilities
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        visibleToRoles: roles
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        enabled: true,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setDestinationId("");
      setDestinationLabel("");
      router.refresh();
    });
  };

  const handleDeleteDestination = (id: string) => {
    startTransition(async () => {
      setError(null);
      const result = await removePushDestination({ destinationId: id });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  };

  const handleSaveTemplate = () => {
    if (!templateId.trim() || !destinationId.trim() || !destinationLabel.trim()) {
      return;
    }

    startTransition(async () => {
      setError(null);
      const result = await savePushTemplate({
        id: templateId.trim(),
        destinationId: destinationId.trim(),
        label: destinationLabel.trim(),
        fields: [
          { key: "title", label: "Title", type: "text", required: true },
        ],
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  };

  const handleDeleteTemplate = (id: string) => {
    startTransition(async () => {
      setError(null);
      const result = await removePushTemplate({ templateId: id });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.refresh();
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
      </div>

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <section
        className={cn(
          blockRecipe("blockPanel", "blockPanelPadding"),
          "grid gap-4"
        )}
      >
        <h2 className={blockRecipe("blockTitle")}>Org push destinations</h2>
        <p className={blockRecipe("blockDescription")}>
          System defaults are read-only. Add org overrides for tenant-specific
          push targets.
        </p>
        <div className="grid gap-3">
          {destinations.map((row) => (
            <article
              className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3 text-sm"
              key={row.rowId}
            >
              <div>
                <p className="font-medium">{row.definition.label}</p>
                <p className="text-muted-foreground text-xs">
                  {row.definition.id} · template {row.definition.templateId}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {row.isSystem ? "System" : "Org"}
                </Badge>
                {!row.isSystem ? (
                  <Button
                    disabled={isPending}
                    onClick={() => handleDeleteDestination(row.definition.id)}
                    size="sm"
                    variant="critical"
                  >
                    Delete
                  </Button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="destination-id">Destination ID</Label>
            <Input
              id="destination-id"
              onChange={(event) => setDestinationId(event.target.value)}
              placeholder="budget-request"
              value={destinationId}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="destination-label">Label</Label>
            <Input
              id="destination-label"
              onChange={(event) => setDestinationLabel(event.target.value)}
              placeholder="Budget Request"
              value={destinationLabel}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="template-id">Template ID</Label>
            <Input
              id="template-id"
              onChange={(event) => setTemplateId(event.target.value)}
              placeholder="budget-request-template"
              value={templateId}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="capabilities">Capabilities (comma-separated)</Label>
            <Input
              id="capabilities"
              onChange={(event) => setCapabilities(event.target.value)}
              value={capabilities}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="roles">Visible roles (comma-separated)</Label>
            <Input
              id="roles"
              onChange={(event) => setRoles(event.target.value)}
              value={roles}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button disabled={isPending} onClick={handleSaveDestination}>
            Save destination
          </Button>
          <Button
            disabled={isPending}
            onClick={handleSaveTemplate}
            variant="secondary"
          >
            Save matching template
          </Button>
        </div>
      </section>

      <section
        className={cn(
          blockRecipe("blockPanel", "blockPanelPadding"),
          "grid gap-4"
        )}
      >
        <h2 className={blockRecipe("blockTitle")}>Templates</h2>
        <div className="grid gap-3">
          {templates.map((row) => (
            <article
              className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3 text-sm"
              key={row.rowId}
            >
              <div>
                <p className="font-medium">{row.definition.label}</p>
                <p className="text-muted-foreground text-xs">
                  {row.definition.id} · {row.definition.fields.length} fields
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {row.isSystem ? "System" : "Org"}
                </Badge>
                {!row.isSystem ? (
                  <Button
                    disabled={isPending}
                    onClick={() => handleDeleteTemplate(row.definition.id)}
                    size="sm"
                    variant="critical"
                  >
                    Delete
                  </Button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
