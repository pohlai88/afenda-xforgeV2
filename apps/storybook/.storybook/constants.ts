/** Local Storybook dev server port (see `package.json` `dev` script). */
export const STORYBOOK_PORT = 6006;

/** Override in CI with `STORYBOOK_URL`. */
export const STORYBOOK_DEV_URL =
  process.env.STORYBOOK_URL ?? `http://127.0.0.1:${STORYBOOK_PORT}`;

/** Omit MCP addon on static builds and when explicitly disabled. */
export const STORYBOOK_MCP_ENABLED =
  process.env.STORYBOOK_DISABLE_MCP !== "1" &&
  process.env.npm_lifecycle_event !== "build";
