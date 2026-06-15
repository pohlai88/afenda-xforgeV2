import { beforeEach, expect, test, vi } from "vitest";

const exchangeCodeForSession = vi.hoisted(() => vi.fn());
const getAuthSession = vi.hoisted(() => vi.fn());
const authenticate = vi.hoisted(() => vi.fn());

vi.mock("@repo/auth/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      exchangeCodeForSession,
    },
  })),
  getAuthSession,
}));

vi.mock("@repo/collaboration/auth", () => ({
  authenticate,
}));

vi.mock("@repo/observability/error", () => ({
  parseError: (error: unknown) =>
    error instanceof Error ? error.message : String(error),
}));

vi.mock("@repo/observability/log", () => ({
  log: {
    error: vi.fn(),
  },
}));

vi.mock("next/server", () => ({
  NextResponse: {
    redirect: (url: string) =>
      new Response(null, {
        headers: {
          location: url,
        },
        status: 307,
      }),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

test("Auth callback rejects external next redirects", async () => {
  exchangeCodeForSession.mockResolvedValue({ error: null });
  const { GET } = await import("../app/api/auth/callback/route");

  const response = await GET(
    new Request(
      "https://app.test/api/auth/callback?code=abc&next=https://evil.test"
    )
  );

  expect(response.status).toBe(307);
  expect(response.headers.get("location")).toBe("https://app.test/");
});

test("Collaboration auth returns envelope for unauthorized requests", async () => {
  getAuthSession.mockResolvedValue(null);
  const { POST } = await import("../app/api/collaboration/auth/route");

  const response = await POST(
    new Request("https://app.test/api/collaboration/auth", {
      method: "POST",
    })
  );

  expect(response.status).toBe(401);
  expect(await response.json()).toEqual({
    ok: false,
    error: {
      code: "unauthorized",
      message: "Unauthorized",
    },
  });
  expect(authenticate).not.toHaveBeenCalled();
});

test("Collaboration auth rejects unsupported GET with Allow header", async () => {
  const { GET } = await import("../app/api/collaboration/auth/route");

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
