import { CMS_WEBHOOK_EVENTS } from "@repo/webhooks";

export const SubscriberDocsPanel = () => (
  <section className="flex flex-col gap-4 rounded-lg border p-4">
    <div>
      <h2 className="font-medium text-lg">Subscriber verification</h2>
      <p className="text-muted-foreground text-sm">
        Verify deliveries with Standard Webhooks v1 headers and the signing
        secret shown when you create or rotate an endpoint.
      </p>
    </div>

    <div className="grid gap-2 text-sm">
      <p className="font-medium">Headers</p>
      <ul className="list-inside list-disc text-muted-foreground">
        <li>
          <code className="text-foreground">webhook-id</code> — event id
          (idempotency key)
        </li>
        <li>
          <code className="text-foreground">webhook-timestamp</code> — Unix
          seconds
        </li>
        <li>
          <code className="text-foreground">webhook-signature</code> —
          space-delimited <code>v1,base64</code> HMAC-SHA256 signatures
        </li>
      </ul>
      <p className="font-medium">Signed content</p>
      <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
        {"{webhook-id}.{webhook-timestamp}.{raw_body}"}
      </pre>
      <p className="font-medium">Payload shape</p>
      <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
        {`{
  "type": "cms.document.published",
  "timestamp": "2026-06-15T08:00:00.000Z",
  "organizationId": "org_…",
  "data": { "collection": "blog", "locale": "en", "slug": "…", … }
}`}
      </pre>
      <p className="font-medium">Events</p>
      <ul className="list-inside list-disc text-muted-foreground">
        {CMS_WEBHOOK_EVENTS.map((eventType) => (
          <li key={eventType}>
            <code className="text-foreground">{eventType}</code>
          </li>
        ))}
      </ul>
      <p className="font-medium">Node.js verify snippet</p>
      <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
        {`import { verifyStandardWebhook } from "@repo/webhooks";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const result = verifyStandardWebhook({
    secret: process.env.WEBHOOK_SECRET!,
    rawBody,
    headers: request.headers,
  });

  if (!result.ok) {
    return new Response(result.error, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  // handle payload.type / payload.data
  return new Response("ok");
}`}
      </pre>
    </div>
  </section>
);
