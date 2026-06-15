import { getOrganizationRole } from "@repo/auth/cms";
import { requireOrg } from "@repo/auth/server";
import type { WebhookDeliveryStatus } from "@repo/webhooks";
import {
  getWebhookDeliveries,
  getWebhookEndpoints,
} from "@/app/actions/webhooks/endpoints";
import { CreateEndpointForm } from "./components/create-endpoint-form";
import { DeliveriesPanel } from "./components/deliveries-panel";
import { EndpointsTable } from "./components/endpoints-table";
import { SubscriberDocsPanel } from "./components/subscriber-docs-panel";

export const metadata = {
  title: "Webhooks",
  description: "Manage outbound CMS webhook endpoints and delivery history.",
};

type WebhooksPageProperties = {
  searchParams: Promise<{
    status?: WebhookDeliveryStatus;
    endpointId?: string;
  }>;
};

const WebhooksPage = async ({ searchParams }: WebhooksPageProperties) => {
  const { userId, orgId } = await requireOrg();
  const role = await getOrganizationRole(userId, orgId);
  const isOwner = role === "owner";
  const params = await searchParams;
  const statusFilter = params.status;
  const endpointFilter = params.endpointId;

  const [endpointsResult, deliveriesResult] = await Promise.all([
    getWebhookEndpoints(),
    getWebhookDeliveries({
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(endpointFilter ? { endpointId: endpointFilter } : {}),
      limit: 50,
    }),
  ]);

  const endpoints = endpointsResult.ok ? endpointsResult.data : [];
  const deliveries = deliveriesResult.ok ? deliveriesResult.data : [];
  const selectedEndpointId =
    endpointFilter &&
    endpoints.some((endpoint) => endpoint.id === endpointFilter)
      ? endpointFilter
      : "all";

  return (
    <div className="flex flex-col gap-8 p-6">
      <div>
        <h1 className="font-semibold text-2xl">Webhooks</h1>
        <p className="text-muted-foreground text-sm">
          CMS publish events are enqueued and delivered asynchronously with
          Standard Webhooks signing.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-medium text-lg">Endpoints</h2>
        {isOwner ? <CreateEndpointForm /> : null}
        <EndpointsTable endpoints={endpoints} isOwner={isOwner} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-medium text-lg">Recent deliveries</h2>
        <DeliveriesPanel
          deliveries={deliveries}
          endpointFilter={selectedEndpointId}
          endpoints={endpoints}
          isOwner={isOwner}
          statusFilter={statusFilter ?? "all"}
        />
      </section>

      <SubscriberDocsPanel />
    </div>
  );
};

export default WebhooksPage;
