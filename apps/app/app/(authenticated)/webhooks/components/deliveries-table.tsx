"use client";

import type {
  WebhookDeliveryRecord,
  WebhookDeliveryStatus,
  WebhookEndpointPublic,
} from "@repo/webhooks";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/components/ui/table";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { replayDelivery } from "@/app/actions/webhooks/endpoints";

type DeliveriesTableProperties = {
  deliveries: WebhookDeliveryRecord[];
  endpoints: WebhookEndpointPublic[];
  isOwner: boolean;
  statusFilter: WebhookDeliveryStatus | "all";
  endpointFilter: string;
  onStatusFilterChange: (status: WebhookDeliveryStatus | "all") => void;
  onEndpointFilterChange: (endpointId: string) => void;
};

const statusVariant = (
  status: WebhookDeliveryStatus
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "delivered":
      return "default";
    case "failed":
      return "destructive";
    case "retrying":
      return "outline";
    default:
      return "secondary";
  }
};

const truncateUrl = (url: string, maxLength = 48): string =>
  url.length > maxLength ? `${url.slice(0, maxLength - 1)}…` : url;

export const DeliveriesTable = ({
  deliveries,
  endpoints,
  isOwner,
  statusFilter,
  endpointFilter,
  onStatusFilterChange,
  onEndpointFilterChange,
}: DeliveriesTableProperties) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleReplay = (deliveryId: string) => {
    startTransition(async () => {
      setError(null);
      setNotice(null);
      const result = await replayDelivery(deliveryId);

      if (!result.ok) {
        setError(result.error ?? "Replay failed");
        return;
      }

      setNotice("Replay queued — cron will deliver shortly.");
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm" htmlFor="delivery-status-filter">
            Status
          </label>
          <select
            className="rounded-md border bg-background px-2 py-1 text-sm"
            id="delivery-status-filter"
            onChange={(event) =>
              onStatusFilterChange(
                event.target.value as WebhookDeliveryStatus | "all"
              )
            }
            value={statusFilter}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
            <option value="retrying">Retrying</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm" htmlFor="delivery-endpoint-filter">
            Endpoint
          </label>
          <select
            className="max-w-md rounded-md border bg-background px-2 py-1 text-sm"
            id="delivery-endpoint-filter"
            onChange={(event) => onEndpointFilterChange(event.target.value)}
            value={endpointFilter}
          >
            <option value="all">All endpoints</option>
            {endpoints.map((endpoint) => (
              <option key={endpoint.id} value={endpoint.id}>
                {truncateUrl(endpoint.url)}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="text-muted-foreground text-sm" role="status">
          {notice}
        </p>
      ) : null}
      {deliveries.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground text-sm">
          No deliveries match this filter.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Endpoint</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Attempts</TableHead>
              <TableHead>Created</TableHead>
              {isOwner ? (
                <TableHead className="w-[120px]">Actions</TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveries.map((delivery) => (
              <TableRow key={delivery.id}>
                <TableCell className="text-sm">
                  <p className="font-medium">{delivery.eventType}</p>
                  <p className="text-muted-foreground text-xs">
                    {delivery.eventId}
                  </p>
                </TableCell>
                <TableCell className="max-w-xs truncate text-xs">
                  {delivery.endpointUrl}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(delivery.status)}>
                    {delivery.status}
                  </Badge>
                  {delivery.lastError ? (
                    <p className="mt-1 text-destructive text-xs">
                      {delivery.lastError}
                    </p>
                  ) : null}
                  {delivery.responseBody ? (
                    <p className="mt-1 text-muted-foreground text-xs">
                      {delivery.responseBody}
                    </p>
                  ) : null}
                </TableCell>
                <TableCell className="text-sm">{delivery.attempts}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(delivery.createdAt).toLocaleString()}
                </TableCell>
                {isOwner ? (
                  <TableCell>
                    {delivery.status === "failed" ? (
                      <Button
                        disabled={isPending}
                        onClick={() => handleReplay(delivery.id)}
                        size="sm"
                        type="button"
                        variant="outline"
                      >
                        Replay
                      </Button>
                    ) : null}
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
