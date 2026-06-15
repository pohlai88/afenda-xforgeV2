"use client";

import type { SiteSettings } from "@repo/cms/settings";
import {
  Button,
  Input,
  Label,
  Textarea,
} from "@repo/design-system/design-system";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateSettings } from "@/app/actions/cms/settings";

type SettingsEditorProperties = {
  initialSettings: SiteSettings;
};

export const SettingsEditor = ({
  initialSettings,
}: SettingsEditorProperties) => {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isDirty =
    settings.siteName !== initialSettings.siteName ||
    settings.tagline !== initialSettings.tagline;

  const handleSave = () => {
    setError(null);
    setSaved(false);

    startTransition(async () => {
      const result = await updateSettings(settings);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (!result.data.ok) {
        setError(result.data.message);
        return;
      }

      setSaved(true);
      router.refresh();
    });
  };

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div className="space-y-2">
        <Label htmlFor="site-name">Site name</Label>
        <Input
          id="site-name"
          onChange={(event) =>
            setSettings((current) => ({
              ...current,
              siteName: event.target.value,
            }))
          }
          value={settings.siteName}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="site-tagline">Tagline</Label>
        <Textarea
          id="site-tagline"
          onChange={(event) =>
            setSettings((current) => ({
              ...current,
              tagline: event.target.value,
            }))
          }
          rows={3}
          value={settings.tagline}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          disabled={!isDirty || isPending}
          onClick={handleSave}
          type="button"
        >
          {isPending ? "Saving…" : "Save settings"}
        </Button>
        {saved ? (
          <span className="text-muted-foreground text-sm">
            Saved — marketing site updates after webhook delivery.
          </span>
        ) : null}
        {isDirty && !saved ? (
          <span className="text-muted-foreground text-xs">Unsaved changes</span>
        ) : null}
      </div>

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
};
