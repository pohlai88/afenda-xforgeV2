import { expect, test } from "vitest";
import { GET, POST } from "../app/health/route";

test("Health Check", async () => {
  const response = await GET();
  expect(response.status).toBe(200);
  expect(response.headers.get("cache-control")).toBe("no-store");
  expect(response.headers.get("x-content-type-options")).toBe("nosniff");
  expect(await response.json()).toEqual({
    ok: true,
    data: {
      status: "ok",
    },
  });
});

test("Health rejects unsupported methods with REST envelope", async () => {
  const response = await POST();

  expect(response.status).toBe(405);
  expect(response.headers.get("allow")).toBe("GET");
  expect(await response.json()).toEqual({
    ok: false,
    error: {
      code: "method_not_allowed",
      details: {
        allowedMethods: ["GET"],
      },
      message: "Method not allowed",
    },
  });
});
