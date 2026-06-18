import { appShellChromeSurfaceClass } from "../app-shell-recipes";

const appSidebarShellClass = [
  "flex h-full min-h-0 flex-col overflow-hidden [grid-area:sidebar] px-3 py-4",
  appShellChromeSurfaceClass,
  "data-[collapsible=icon]:px-1",
  "data-[collapsible=icon]:py-2",
].join(" ");

export { appSidebarShellClass };
