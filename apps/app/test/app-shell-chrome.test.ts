import { describe, expect, it } from "vitest";
import {
  resolveAuthenticatedAppShellChrome,
  resolveAuthenticatedAppShellUserSummary,
} from "../lib/app-shell/app-shell-chrome";
import { mapAuthenticatedAppShellOrganizations } from "../lib/app-shell/organizations";

describe("resolveAuthenticatedAppShellUserSummary", () => {
  it("prefers metadata display name over email", () => {
    const summary = resolveAuthenticatedAppShellUserSummary({
      email: "operator@afenda.app",
      userMetadata: { name: "Orbit Operator" },
    });

    expect(summary).toEqual({
      avatar: "",
      email: "operator@afenda.app",
      name: "Orbit Operator",
    });
  });

  it("falls back to email when metadata name is missing", () => {
    const summary = resolveAuthenticatedAppShellUserSummary({
      email: "operator@afenda.app",
      userMetadata: {},
    });

    expect(summary.name).toBe("operator@afenda.app");
  });

  it("uses a neutral label when name and email are missing", () => {
    const summary = resolveAuthenticatedAppShellUserSummary({
      email: null,
      userMetadata: undefined,
    });

    expect(summary).toEqual({
      avatar: "",
      email: "",
      name: "Signed-in user",
    });
  });

  it("maps avatar_url from user metadata", () => {
    const summary = resolveAuthenticatedAppShellUserSummary({
      email: "operator@afenda.app",
      userMetadata: {
        avatar_url: "https://cdn.afenda.app/avatars/operator.png",
        name: "Orbit Operator",
      },
    });

    expect(summary.avatar).toBe("https://cdn.afenda.app/avatars/operator.png");
  });
});

describe("resolveAuthenticatedAppShellChrome", () => {
  it("maps organizations and active org into serializable chrome", () => {
    const chrome = resolveAuthenticatedAppShellChrome({
      activeOrganizationId: "org_1",
      defaultSidebarBehaviorMode: "expanded",
      email: "operator@afenda.app",
      organizations: [
        { id: "org_1", name: "Acme" },
        { id: "org_2", name: "Beta" },
      ],
      orgId: "org_1",
      userId: "user_1",
      userMetadata: { name: "Orbit Operator" },
    });

    expect(chrome.organizations).toEqual(
      mapAuthenticatedAppShellOrganizations([
        { id: "org_1", name: "Acme" },
        { id: "org_2", name: "Beta" },
      ])
    );
    expect(chrome.activeOrganizationId).toBe("org_1");
    expect(chrome.tenantId).toBe("org_1");
    expect(chrome.user.name).toBe("Orbit Operator");
  });
});
