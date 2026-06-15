import { CMS_EVENT_PUBLISHED } from "@repo/webhooks";
import { signStandardWebhookHeader } from "@repo/webhooks";
import { revalidatePath, revalidateTag } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";

const TEST_SECRET =
  "whsec_dGVzdC1sb2NhbC13ZWJob29rLXNlY3JldC1kZXYxMjM=";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock("@repo/webhooks/keys", () => ({
  keys: vi.fn(() => ({
    WEBHOOK_FIRST_PARTY_WEB_SECRET: TEST_SECRET,
  })),
}));

const buildSignedRequest = (body: string): Request => {
  const webhookId = "evt_cms_cache_test";
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = signStandardWebhookHeader(
    [TEST_SECRET],
    { id: webhookId, timestamp, body }
  );

  return new Request("http://localhost:3001/api/webhooks/cms-cache", {
    method: "POST",
    body,
    headers: {
      "webhook-id": webhookId,
      "webhook-timestamp": timestamp,
      "webhook-signature": signature,
    },
  });
};

describe("POST /api/webhooks/cms-cache", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 503 when the receiver secret is not configured", async () => {
    const { keys } = await import("@repo/webhooks/keys");
    vi.mocked(keys).mockReturnValueOnce({
      WEBHOOK_FIRST_PARTY_WEB_SECRET: undefined,
    } as ReturnType<typeof keys>);

    const { POST } = await import("../app/api/webhooks/cms-cache/route");
    const response = await POST(
      new Request("http://localhost:3001/api/webhooks/cms-cache", {
        method: "POST",
        body: "{}",
      })
    );

    expect(response.status).toBe(503);
  });

  it("returns 401 for invalid signatures", async () => {
    const { POST } = await import("../app/api/webhooks/cms-cache/route");
    const response = await POST(
      new Request("http://localhost:3001/api/webhooks/cms-cache", {
        method: "POST",
        body: "{}",
        headers: {
          "webhook-id": "evt_bad",
          "webhook-timestamp": String(Math.floor(Date.now() / 1000)),
          "webhook-signature": "v1,invalid",
        },
      })
    );

    expect(response.status).toBe(401);
  });

  it("revalidates cache tags and paths for a signed CMS payload", async () => {
    const body = JSON.stringify({
      type: CMS_EVENT_PUBLISHED,
      timestamp: new Date().toISOString(),
      organizationId: "org_test",
      data: {
        collection: "blog",
        locale: "en",
        slug: "welcome",
        title: "Welcome",
        status: "published",
      },
    });

    const { POST } = await import("../app/api/webhooks/cms-cache/route");
    const response = await POST(buildSignedRequest(body));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.revalidated).toBe(true);
    expect(json.type).toBe(CMS_EVENT_PUBLISHED);
    expect(json.tags).toContain("cms:blog:en:welcome");
    // Default locale (en) has no URL prefix — see localePathPrefix in @repo/cms
    expect(json.paths).toContain("/blog");
    expect(json.paths).toContain("/blog/welcome");

    expect(revalidateTag).toHaveBeenCalledWith("cms:blog:en:welcome", "max");
    expect(revalidatePath).toHaveBeenCalledWith("/blog");
    expect(revalidatePath).toHaveBeenCalledWith("/blog/welcome");
  });
});
