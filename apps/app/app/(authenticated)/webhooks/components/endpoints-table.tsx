"use client";

import type { WebhookEndpointPublic } from "@repo/webhooks";
import { Badge } from "@repo/design-system/components/afenda-ui/badge";
import { Button } from "@repo/design-system/components/afenda-ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/components/afenda-ui/table";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  removeEndpoint,
  resetEndpointHealth,
  rotateEndpointSecret,
  testEndpoint,
  updateEndpoint,
} from "@/app/actions/webhooks/endpoints";

type EndpointsTableProperties = {
  endpoints: WebhookEndpointPublic[];
  isOwner: boolean;
};

const healthVariant = (
  status: WebhookEndpointPublic["lastDeliveryStatus"]
): {
  tone: "neutral" | "positive" | "warning" | "critical";
  variant: "soft" | "outline";
} => {
  switch (status) {
    case "delivered":
      return { tone: "positive", variant: "soft" };
    case "failed":
      return { tone: "critical", variant: "soft" };
    case "retrying":
      return { tone: "warning", variant: "outline" };
    default:
      return { tone: "neutral", variant: "soft" };
  }
};

export const EndpointsTable = ({
  endpoints,
  isOwner,
}: EndpointsTableProperties) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [rotatedSecret, setRotatedSecret] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const runAction = (
    action: () => Promise<{ ok: boolean; error?: string }>
  ) => {
    startTransition(async () => {
      setError(null);
      const result = await action();

      if (!result.ok) {
        setError(result.error ?? "Action failed");
        return;
      }

      router.refresh();
    });
  };

  const handleToggle = (endpoint: WebhookEndpointPublic) => {
    runAction(() =>
      updateEndpoint({
        endpointId: endpoint.id,
        enabled: !endpoint.enabled,
      })
    );
  };

  const handleTest = (endpointId: string) => {
    runAction(async () => {
      const result = await testEndpoint(endpointId);

      if (!result.ok) {
        return result;
      }

      if (!result.data) {
        return { ok: false, error: "Test delivery did not succeed" };
      }

      return { ok: true };
    });
  };

  const handleRotate = (endpointId: string) => {
    if (
      !window.confirm(
        "Rotate signing secret? The previous secret remains valid for 24 hours."
      )
    ) {
      return;
    }

    startTransition(async () => {
      setError(null);
      setRotatedSecret(null);
      const result = await rotateEndpointSecret(endpointId);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (result.data?.secret) {
        setRotatedSecret(result.data.secret);
      }

      router.refresh();
    });
  };

  const handleDelete = (endpointId: string) => {
    if (!window.confirm("Delete this webhook endpoint?")) {
      return;
    }

    runAction(() => removeEndpoint(endpointId));
  };

  if (endpoints.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground text-sm">
        No webhook endpoints yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      {rotatedSecret ? (
        <p className="rounded-md bg-muted p-3 text-xs">
          New signing secret (copy now — it will not be shown again):{" "}
          <code className="font-mono">{rotatedSecret}</code>
        </p>
      ) : null}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>URL</TableHead>
            <TableHead>Events</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last delivery</TableHead>
            {isOwner ? (
              <TableHead className="w-[280px]">Actions</TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {endpoints.map((endpoint) => (
            <TableRow key={endpoint.id}>
              <TableCell>
                <p className="font-medium text-sm">{endpoint.url}</p>
                {endpoint.description ? (
                  <p className="text-muted-foreground text-xs">
                    {endpoint.description}
                  </p>
                ) : null}
              </TableCell>
              <TableCell className="text-xs">
                {endpoint.events.join(", ")}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {endpoint.isAutoDisabled ? (
                    <Badge tone="critical" variant="soft">
                      Auto-disabled
                    </Badge>
                  ) : null}
                  <Badge
                    tone={endpoint.enabled ? "positive" : "neutral"}
                    variant="soft"
                  >
                    {endpoint.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                {endpoint.lastDeliveryStatus ? (
                  <div className="flex flex-col gap-1">
                    <Badge {...healthVariant(endpoint.lastDeliveryStatus)}>
                      {endpoint.lastDeliveryStatus}
                    </Badge>
                    {endpoint.lastDeliveryError ? (
                      <p className="text-destructive text-xs">
                        {endpoint.lastDeliveryError}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-xs">—</span>
                )}
              </TableCell>
              {isOwner ? (
                <TableCell className="space-x-2">
                  <Button
                    disabled={isPending}
                    onClick={() => handleTest(endpoint.id)}
                    size="sm"
                    type="button"
                    variant="secondary"
                  >
                    Test
                  </Button>
                  <Button
                    disabled={isPending}
                    onClick={() => handleRotate(endpoint.id)}
                    size="sm"
                    type="button"
                    variant="secondary"
                  >
                    Rotate secret
                  </Button>
                  <Button
                    disabled={isPending}
                    onClick={() => handleToggle(endpoint)}
                    size="sm"
                    type="button"
                    variant="secondary"
                  >
                    {endpoint.enabled ? "Disable" : "Enable"}
                  </Button>
                  {endpoint.isAutoDisabled ? (
                    <Button
                      disabled={isPending}
                      onClick={() =>
                        runAction(() => resetEndpointHealth(endpoint.id))
                      }
                      size="sm"
                      type="button"
                      variant="secondary"
                    >
                      Re-enable
                    </Button>
                  ) : null}
                  <Button
                    disabled={isPending}
                    onClick={() => handleDelete(endpoint.id)}
                    size="sm"
                    type="button"
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
