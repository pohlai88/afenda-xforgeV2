"use client";

import type {
  WebhookDeliveryRecord,
  WebhookDeliveryStatus,
  WebhookEndpointPublic,
} from "@repo/webhooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { getWebhookDeliveries } from "@/app/actions/webhooks/endpoints";
import { DeliveriesTable } from "./deliveries-table";

interface DeliveriesPanelProperties {
  deliveries: WebhookDeliveryRecord[];
  endpointFilter: string;
  endpoints: WebhookEndpointPublic[];
  initialNextCursor: string | null;
  isOwner: boolean;
  statusFilter: WebhookDeliveryStatus | "all";
}

export const DeliveriesPanel = ({
  deliveries,
  endpoints,
  initialNextCursor,
  isOwner,
  statusFilter,
  endpointFilter,
}: DeliveriesPanelProperties) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rows, setRows] = useState(deliveries);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [isLoadingMore, startLoadMore] = useTransition();

  useEffect(() => {
    setRows(deliveries);
    setNextCursor(initialNextCursor);
    setLoadMoreError(null);
  }, [deliveries, initialNextCursor]);

  const pushFilters = (updates: {
    status?: WebhookDeliveryStatus | "all";
    endpointId?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.status !== undefined) {
      if (updates.status === "all") {
        params.delete("status");
      } else {
        params.set("status", updates.status);
      }
    }

    if (updates.endpointId !== undefined) {
      if (updates.endpointId === "all") {
        params.delete("endpointId");
      } else {
        params.set("endpointId", updates.endpointId);
      }
    }

    const query = params.toString();
    router.push(query ? `/webhooks?${query}` : "/webhooks");
  };

  const handleStatusFilterChange = (status: WebhookDeliveryStatus | "all") => {
    pushFilters({ status });
  };

  const handleEndpointFilterChange = (endpointId: string) => {
    pushFilters({ endpointId });
  };

  const handleLoadMore = () => {
    if (!nextCursor) {
      return;
    }

    startLoadMore(async () => {
      setLoadMoreError(null);

      const result = await getWebhookDeliveries({
        limit: 50,
        cursor: nextCursor,
        ...(statusFilter !== "all" ? { status: statusFilter } : {}),
        ...(endpointFilter !== "all" ? { endpointId: endpointFilter } : {}),
      });

      if (!result.ok) {
        setLoadMoreError(result.error ?? "Failed to load more deliveries");
        return;
      }

      setRows((previous) => [...previous, ...result.data.deliveries]);
      setNextCursor(result.data.nextCursor);
    });
  };

  return (
    <DeliveriesTable
      deliveries={rows}
      endpointFilter={endpointFilter}
      endpoints={endpoints}
      isLoadingMore={isLoadingMore}
      isOwner={isOwner}
      loadMoreError={loadMoreError}
      nextCursor={nextCursor}
      onEndpointFilterChange={handleEndpointFilterChange}
      onLoadMore={handleLoadMore}
      onStatusFilterChange={handleStatusFilterChange}
      statusFilter={statusFilter}
    />
  );
};
