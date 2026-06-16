import { afterEach, describe, expect, it } from "vitest";
import {
  clearPushDestinations,
  registerPushDestination,
  resolvePushDestinations,
} from "../lib/registry/push-destination-registry";

afterEach(() => {
  clearPushDestinations();
});

describe("push destination registry", () => {
  it("returns only destinations visible to role with required capabilities", () => {
    registerPushDestination({
      id: "budget",
      label: "Budget Request",
      templateId: "budget-template",
      requiredCapabilities: ["budget"],
      visibleToRoles: ["owner", "editor"],
    });

    registerPushDestination({
      id: "meeting",
      label: "Meeting",
      templateId: "meeting-template",
      requiredCapabilities: ["meeting"],
      visibleToRoles: ["owner", "editor", "member"],
    });

    const financeEditor = resolvePushDestinations({
      orgId: "org_1",
      userId: "user_1",
      role: "editor",
      userCapabilities: ["budget", "meeting"],
    });

    expect(financeEditor.map((destination) => destination.id).sort()).toEqual([
      "budget",
      "meeting",
    ]);

    const juniorMember = resolvePushDestinations({
      orgId: "org_1",
      userId: "user_2",
      role: "member",
      userCapabilities: ["meeting"],
    });

    expect(juniorMember.map((destination) => destination.id)).toEqual([
      "meeting",
    ]);
  });

  it("never returns unregistered destinations", () => {
    const resolved = resolvePushDestinations({
      orgId: "org_1",
      userId: "user_1",
      role: "owner",
      userCapabilities: ["budget", "approval"],
    });

    expect(resolved).toEqual([]);
  });
});
