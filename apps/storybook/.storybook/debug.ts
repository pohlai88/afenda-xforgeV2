export { STORYBOOK_DEV_URL } from "./constants.ts";

import { STORYBOOK_DEV_URL as DEFAULT_STORYBOOK_DEV_URL } from "./constants.ts";

export type StorybookDebugPanel =
  | "actions"
  | "a11y"
  | "interactions"
  | "overflow";

const DEBUG_PANELS: Record<StorybookDebugPanel, string> = {
  interactions: "storybook/interactions/panel",
  a11y: "storybook/a11y/panel",
  actions: "storybook/actions/panel",
  overflow: "storybook/actions/panel",
};

/** Storybook iframe path segment, e.g. `/story/afenda-ui-button--default`. */
export function storybookStoryPath(storyId: string) {
  return `/story/${storyId}`;
}

/**
 * Deep-link into Storybook with an addon panel open — matches test-runner error URLs.
 * Use story IDs from MCP `list-all-documentation` (withStoryIds) or `preview-stories`.
 */
export function storybookDebugUrl(
  storyId: string,
  panel: StorybookDebugPanel = "interactions",
  baseUrl: string = DEFAULT_STORYBOOK_DEV_URL
) {
  const params = new URLSearchParams({
    path: storybookStoryPath(storyId),
    addonPanel: DEBUG_PANELS[panel],
  });

  return `${baseUrl}/?${params.toString()}`;
}

/** Pick the most useful addon panel for a failed test lane. */
export function storybookDebugPanelForFailure(options: {
  hasPlayFunction?: boolean;
  isAccessibilityFailure?: boolean;
}): StorybookDebugPanel {
  if (options.isAccessibilityFailure) {
    return "a11y";
  }

  if (options.hasPlayFunction) {
    return "interactions";
  }

  return "actions";
}

export function formatStorybookDebugMessage(
  storyId: string,
  summary: string,
  panel: StorybookDebugPanel = "interactions"
) {
  return `${summary}\n\nDebug in Storybook:\n${storybookDebugUrl(storyId, panel)}`;
}
