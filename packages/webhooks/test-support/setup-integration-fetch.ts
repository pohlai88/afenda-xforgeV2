import { afterEach, beforeEach, vi } from "vitest";

type FetchHandler = (
  input: RequestInfo | URL,
  init?: RequestInit
) => Response | Promise<Response>;

let fetchHandler: FetchHandler = async () =>
  new Response("ok", { status: 200 });

/** Override the integration fetch mock for the current test file. */
export const setIntegrationFetchHandler = (handler: FetchHandler): void => {
  fetchHandler = handler;
};

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn((input: RequestInfo | URL, init?: RequestInit) =>
      fetchHandler(input, init)
    )
  );
});

afterEach(() => {
  fetchHandler = async () => new Response("ok", { status: 200 });
  vi.unstubAllGlobals();
});
