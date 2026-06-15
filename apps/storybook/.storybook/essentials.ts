import type { Parameters } from "@storybook/react"

/** Disable canvas dev tools that clash with matrix / audit stories. */
export const matrixStoryParameters = {
  highlight: { disable: true },
  measure: { disable: true },
  outline: { disable: true },
  controls: { disable: true },
} satisfies Parameters

/** Layout-heavy stories: disable actions noise and dev-tool overlays. */
export const layoutStoryParameters = {
  ...matrixStoryParameters,
  actions: { disable: true },
} satisfies Parameters

/** Mobile-first overlays (drawer, sheet). */
export const mobileViewportParameters = {
  viewport: { defaultViewport: "mobile" },
} satisfies Parameters

/**
 * Interaction / play-function stories: disable addon-a11y during play (avoids axe
 * races with test-runner) and hide noisy devtools. Test-runner skips postVisit axe
 * when the `interaction` tag is present.
 */
export const interactionStoryParameters = {
  highlight: { disable: true },
  measure: { disable: true },
  outline: { disable: true },
  actions: { disable: true },
  a11y: { disable: true },
} satisfies Parameters
