"use client";

import { Button } from "@repo/design-system/components/afenda-ui/button";
import { Input } from "@repo/design-system/components/afenda-ui/input";
import { Label } from "@repo/design-system/components/afenda-ui/label";
import { Textarea } from "@repo/design-system/components/afenda-ui/textarea";
import { cn } from "@repo/design-system/lib/utils";
import { useState } from "react";
import type { TopbarUtilityRequest } from "./topbar-types";

export interface TopbarUtilitiesRequestFormProps {
  readonly className?: string;
  readonly featuresLabel?: string;
  readonly nameLabel?: string;
  readonly note?: string;
  readonly onSubmit?: (request: TopbarUtilityRequest) => void;
  readonly sendLabel?: string;
  readonly title?: string;
}

export function TopbarUtilitiesRequestForm({
  className,
  featuresLabel = "Function or features",
  nameLabel = "Utility name",
  note = "Platform manager review coming soon. Send is a placeholder for now.",
  onSubmit,
  sendLabel = "Send request",
  title = "Request utility shortcut",
}: TopbarUtilitiesRequestFormProps) {
  const [name, setName] = useState("");
  const [features, setFeatures] = useState("");

  const trimmedName = name.trim();
  const canSend = trimmedName.length > 0;

  const handleSend = () => {
    if (!canSend) {
      return;
    }

    const request: TopbarUtilityRequest = {
      name: trimmedName,
      features: features.trim(),
    };

    onSubmit?.(request);
    setName("");
    setFeatures("");
  };

  return (
    <div
      className={cn("grid gap-2.5 px-3 py-3", className)}
      data-slot="app-topbar-utilities-request-form"
      onPointerDown={(event) => {
        event.preventDefault();
      }}
    >
      <div className="grid gap-1">
        <p className="font-medium text-[11px] text-text-secondary">{title}</p>
        {note ? (
          <p className="text-[10px] text-text-tertiary leading-snug">{note}</p>
        ) : null}
      </div>
      <div className="grid gap-1.5">
        <Label
          className="text-[11px] text-text-secondary"
          htmlFor="topbar-utility-request-name"
        >
          {nameLabel}
        </Label>
        <Input
          className="h-8 text-[12px]"
          id="topbar-utility-request-name"
          onChange={(event) => {
            setName(event.target.value);
          }}
          placeholder="e.g. Vendor approvals"
          value={name}
        />
      </div>
      <div className="grid gap-1.5">
        <Label
          className="text-[11px] text-text-secondary"
          htmlFor="topbar-utility-request-features"
        >
          {featuresLabel}
        </Label>
        <Textarea
          className="min-h-16 resize-none text-[12px]"
          id="topbar-utility-request-features"
          onChange={(event) => {
            setFeatures(event.target.value);
          }}
          placeholder="What should this shortcut open or do?"
          rows={2}
          value={features}
        />
      </div>
      <Button
        className="h-8 w-full text-[12px]"
        disabled={!canSend}
        onClick={handleSend}
        size="sm"
        type="button"
        variant="primary"
      >
        {sendLabel}
      </Button>
    </div>
  );
}
