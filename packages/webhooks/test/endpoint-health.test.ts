import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => {
  const { createRequire } = require("node:module") as typeof import("node:module");
  const req = createRequire(import.meta.url);
  const { createUpdateDatabaseMock } =
    req("../../../test-support/mock-database.ts") as typeof import("../../../test-support/mock-database.ts");
  return createUpdateDatabaseMock(vi.fn);
});

vi.mock("@repo/database", () => ({
  database: db.database,
}));

import { FIRST_PARTY_ENDPOINT_KIND } from "../lib/outbound/endpoint-kinds";
import { recordEndpointDeliveryFailure } from "../lib/outbound/endpoints";

describe("recordEndpointDeliveryFailure", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not penalize first-party endpoint health", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    await recordEndpointDeliveryFailure(
      "fp-web-org_test",
      "client",
      3,
      FIRST_PARTY_ENDPOINT_KIND
    );

    expect(warn).toHaveBeenCalledWith(
      "[webhooks] first-party delivery failure (health not penalized)",
      expect.objectContaining({
        endpointId: "fp-web-org_test",
        failureClass: "client",
      })
    );

    warn.mockRestore();
  });
});
