"use client";

import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/design-system";
import {
  WEBHOOK_DELIVERY_STATUSES,
  type WebhookDeliveryRecord,
  type WebhookDeliveryStatus,
  type WebhookEndpointPublic,
} from "@repo/webhooks";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { replayDelivery } from "@/app/actions/webhooks/endpoints";

interface DeliveriesTableProperties {
  deliveries: WebhookDeliveryRecord[];
  endpointFilter: string;
  endpoints: WebhookEndpointPublic[];
  isLoadingMore: boolean;
  isOwner: boolean;
  loadMoreError: string | null;
  nextCursor: string | null;
  onEndpointFilterChange: (endpointId: string) => void;
  onLoadMore: () => void;
  onStatusFilterChange: (status: WebhookDeliveryStatus | "all") => void;
  statusFilter: WebhookDeliveryStatus | "all";
}

const statusVariant = (
  status: WebhookDeliveryStatus
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

const truncateUrl = (url: string, maxLength = 48): string =>
  url.length > maxLength ? `${url.slice(0, maxLength - 1)}…` : url;

export const DeliveriesTable = ({
  deliveries,
  endpoints,
  isOwner,
  statusFilter,
  endpointFilter,
  nextCursor,
  isLoadingMore,
  loadMoreError,
  onStatusFilterChange,
  onEndpointFilterChange,
  onLoadMore,
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
            {WEBHOOK_DELIVERY_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
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
        <output className="text-muted-foreground text-sm">{notice}</output>
      ) : null}
      {loadMoreError ? (
        <p className="text-destructive text-sm" role="alert">
          {loadMoreError}
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
                  <Badge {...statusVariant(delivery.status)}>
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
                        variant="secondary"
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
      {nextCursor ? (
        <div className="flex justify-center">
          <Button
            disabled={isLoadingMore || isPending}
            onClick={onLoadMore}
            type="button"
            variant="secondary"
          >
            {isLoadingMore ? "Loading…" : "Load more"}
          </Button>
        </div>
      ) : null}
    </div>
  );
};
