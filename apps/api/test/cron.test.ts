import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";

const db = vi.hoisted(() => {
  const returning = vi.fn(async () => [{ id: 1 }]);
  const values = vi.fn(() => ({ returning }));
  const insert = vi.fn(() => ({ values }));
  const where = vi.fn(async () => undefined);
  const deleteMock = vi.fn(() => ({ where }));

  return {
    database: {
      delete: deleteMock,
      insert,
    },
    deleteMock,
    insert,
  };
});

vi.mock("@repo/database", () => ({
  database: db.database,
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

let GET: typeof import("../app/cron/keep-alive/route").GET;

beforeAll(async () => {
  ({ GET } = await import("../app/cron/keep-alive/route"));
});

beforeEach(() => {
  process.env.CRON_SECRET = "cron-secret";
  vi.clearAllMocks();
});

afterEach(() => {
  process.env.CRON_SECRET = undefined;
});

test("Cron keep-alive rejects missing authorization", async () => {
  const response = await GET(new Request("https://api.test/cron/keep-alive"));

  expect(response.status).toBe(401);
  expect(await response.json()).toEqual({
    ok: false,
    error: {
      code: "unauthorized",
      message: "Unauthorized",
    },
  });
  expect(db.insert).not.toHaveBeenCalled();
});

test("Cron keep-alive rejects invalid authorization", async () => {
  const response = await GET(
    new Request("https://api.test/cron/keep-alive", {
      headers: {
        authorization: "Bearer wrong",
      },
    })
  );

  expect(response.status).toBe(401);
  expect(db.insert).not.toHaveBeenCalled();
});

test("Cron keep-alive accepts valid authorization", async () => {
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
  expect(db.insert).toHaveBeenCalledOnce();
  expect(db.deleteMock).toHaveBeenCalledOnce();
});
