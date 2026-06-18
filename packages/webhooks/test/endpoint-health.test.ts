import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => {
  const where = vi.fn();
  const set = vi.fn(() => ({ where }));
  const update = vi.fn(() => ({ set }));

  return {
    database: {
      update,
    },
  };
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
