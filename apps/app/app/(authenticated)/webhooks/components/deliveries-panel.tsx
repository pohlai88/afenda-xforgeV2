"use client";

import type {
  WebhookDeliveryRecord,
  WebhookDeliveryStatus,
  WebhookEndpointPublic,
} from "@repo/webhooks";
import { useRouter, useSearchParams } from "next/navigation";
import { DeliveriesTable } from "./deliveries-table";

type DeliveriesPanelProperties = {
  deliveries: WebhookDeliveryRecord[];
  endpoints: WebhookEndpointPublic[];
  isOwner: boolean;
  statusFilter: WebhookDeliveryStatus | "all";
  endpointFilter: string;
};

export const DeliveriesPanel = ({
  deliveries,
  endpoints,
  isOwner,
  statusFilter,
  endpointFilter,
}: DeliveriesPanelProperties) => {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  return (
    <DeliveriesTable
      deliveries={deliveries}
      endpointFilter={endpointFilter}
      endpoints={endpoints}
      isOwner={isOwner}
      onEndpointFilterChange={handleEndpointFilterChange}
      onStatusFilterChange={handleStatusFilterChange}
      statusFilter={statusFilter}
    />
  );
};
