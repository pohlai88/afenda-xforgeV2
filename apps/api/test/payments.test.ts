import { beforeEach, expect, test, vi } from "vitest";

const headersMock = vi.hoisted(() => vi.fn());
const constructEvent = vi.hoisted(() => vi.fn());
const capture = vi.hoisted(() => vi.fn());
const shutdown = vi.hoisted(() => vi.fn(async () => undefined));

vi.mock("next/headers", () => ({
  headers: headersMock,
}));

vi.mock("@repo/observability/error", () => ({
  parseError: (error: unknown) =>
    error instanceof Error ? error.message : String(error),
}));

vi.mock("@repo/observability/log", () => ({
  log: {
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

vi.mock("@/env", () => ({
  env: {
    STRIPE_WEBHOOK_SECRET: "whsec_test",
  },
}));

vi.mock("@repo/analytics/server", () => ({
  analytics: {
    capture,
    shutdown,
  },
}));

vi.mock("@repo/auth/server", () => ({
  createAdminClient: () => ({
    auth: {
      admin: {
        listUsers: vi.fn(async () => ({ data: { users: [] } })),
      },
    },
  }),
}));

vi.mock("@repo/payments", () => ({
  stripe: {
    webhooks: {
      constructEvent,
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  headersMock.mockResolvedValue(new Headers());
});

test("Stripe webhook rejects missing signature", async () => {
  const { POST } = await import("../app/webhooks/payments/route");

  const response = await POST(
    new Request("https://api.test/webhooks/payments", {
      body: "{}",
      method: "POST",
    })
  );

  expect(response.status).toBe(400);
  expect(response.headers.get("cache-control")).toBe("no-store");
  expect(response.headers.get("x-content-type-options")).toBe("nosniff");
  expect(await response.json()).toEqual({
    ok: false,
    error: {
      code: "missing_signature",
      message: "Missing stripe-signature header",
    },
  });
});

test("Stripe webhook rejects unsupported GET with Allow header", async () => {
  const { GET } = await import("../app/webhooks/payments/route");

  const response = GET();

  expect(response.status).toBe(405);
  expect(response.headers.get("allow")).toBe("POST");
  expect(await response.json()).toMatchObject({
    error: {
      code: "method_not_allowed",
    },
    ok: false,
  });
});

test("Stripe webhook rejects invalid signature", async () => {
  headersMock.mockResolvedValue(
    new Headers({
      "stripe-signature": "invalid",
    })
  );
  constructEvent.mockImplementation(() => {
    throw new Error("signature mismatch");
  });

  const { POST } = await import("../app/webhooks/payments/route");

  const response = await POST(
    new Request("https://api.test/webhooks/payments", {
      body: "{}",
      method: "POST",
    })
  );

  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({
    ok: false,
    error: {
      code: "invalid_signature",
      message: "Invalid webhook signature",
    },
  });
});

test("Stripe webhook returns receipt metadata without leaking event object", async () => {
  headersMock.mockResolvedValue(
    new Headers({
      "stripe-signature": "valid",
    })
  );
  constructEvent.mockReturnValue({
    data: {
      object: {},
    },
    id: "evt_test",
    type: "unknown.event",
  });

  const { POST } = await import("../app/webhooks/payments/route");

  const response = await POST(
    new Request("https://api.test/webhooks/payments", {
      body: "{}",
      method: "POST",
    })
  );

  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    ok: true,
    data: {
      received: true,
      type: "unknown.event",
    },
  });
  expect(shutdown).toHaveBeenCalledOnce();
});
