"use client";

import { Button, Input, Label } from "@repo/design-system/design-system";
import { CMS_WEBHOOK_EVENTS, type CmsWebhookEventType } from "@repo/webhooks";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createEndpoint } from "@/app/actions/webhooks/endpoints";

export const CreateEndpointForm = () => {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [events, setEvents] = useState<CmsWebhookEventType[]>([
    ...CMS_WEBHOOK_EVENTS,
  ]);
  const [secret, setSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggleEvent = (eventType: CmsWebhookEventType) => {
    setEvents((current) =>
      current.includes(eventType)
        ? current.filter((value) => value !== eventType)
        : [...current, eventType]
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      setError(null);
      const result = await createEndpoint({
        url,
        description: description || undefined,
        events,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setSecret(result.data.secret);
      setUrl("");
      setDescription("");
      router.refresh();
    });
  };

  return (
    <form
      className="flex flex-col gap-4 rounded-lg border p-4"
      onSubmit={handleSubmit}
    >
      <div>
        <h3 className="font-medium text-sm">Add endpoint</h3>
        <p className="text-muted-foreground text-xs">
          HTTPS URL that receives signed CMS publish events.
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="webhook-url">Endpoint URL</Label>
        <Input
          id="webhook-url"
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com/webhooks/cms"
          required
          type="url"
          value={url}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="webhook-description">Description</Label>
        <Input
          id="webhook-description"
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Production notifier"
          value={description}
        />
      </div>
      <fieldset className="grid gap-2">
        <legend className="font-medium text-sm">Events</legend>
        {CMS_WEBHOOK_EVENTS.map((eventType) => (
          <label className="flex items-center gap-2 text-sm" key={eventType}>
            <input
              checked={events.includes(eventType)}
              onChange={() => toggleEvent(eventType)}
              type="checkbox"
            />
            <span>{eventType}</span>
          </label>
        ))}
      </fieldset>
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      {secret ? (
        <p className="rounded-md bg-muted p-3 text-xs">
          Signing secret (copy now — it will not be shown again):{" "}
          <code className="font-mono">{secret}</code>
        </p>
      ) : null}
      <Button disabled={isPending || events.length === 0} type="submit">
        {isPending ? "Creating…" : "Create endpoint"}
      </Button>
    </form>
  );
};
