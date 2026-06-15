import { afterEach, beforeEach, expect, test, vi } from "vitest";

const returning = vi.fn(async () => [{ id: 1 }]);
const values = vi.fn(() => ({ returning }));
const insert = vi.fn(() => ({ values }));
const where = vi.fn(async () => undefined);
const deleteMock = vi.fn(() => ({ where }));

vi.mock("@repo/database", () => ({
  database: {
    delete: deleteMock,
    insert,
  },
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

beforeEach(() => {
  process.env.CRON_SECRET = "cron-secret";
  vi.clearAllMocks();
});

afterEach(() => {
  process.env.CRON_SECRET = undefined;
});

test("Cron keep-alive rejects missing authorization", async () => {
  const { GET } = await import("../app/cron/keep-alive/route");

  const response = await GET(new Request("https://api.test/cron/keep-alive"));

  expect(response.status).toBe(401);
  expect(await response.json()).toEqual({
    ok: false,
    error: {
      code: "unauthorized",
      message: "Unauthorized",
    },
  });
  expect(insert).not.toHaveBeenCalled();
});

test("Cron keep-alive rejects invalid authorization", async () => {
  const { GET } = await import("../app/cron/keep-alive/route");

  const response = await GET(
    new Request("https://api.test/cron/keep-alive", {
      headers: {
        authorization: "Bearer wrong",
      },
    })
  );

  expect(response.status).toBe(401);
  expect(insert).not.toHaveBeenCalled();
});

test("Cron keep-alive accepts valid authorization", async () => {
  const { GET } = await import("../app/cron/keep-alive/route");

  const response = await GET(
    new Request("https://api.test/cron/keep-alive", {
      headers: {
        authorization: "Bearer cron-secret",
      },
    })
  );

  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    ok: true,
    data: {
      status: "ok",
    },
  });
  expect(insert).toHaveBeenCalledOnce();
  expect(deleteMock).toHaveBeenCalledOnce();
});
