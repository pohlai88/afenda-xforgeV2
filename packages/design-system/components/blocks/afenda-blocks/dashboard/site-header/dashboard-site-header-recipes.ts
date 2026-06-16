/** shadcn dashboard-01 site-header — no sticky/radius/bg overrides on the shell */
const siteHeaderShellClass = [
  "flex h-[var(--header-height,var(--dashboard-site-header-height))] shrink-0 items-center gap-2 border-b",
  "transition-[width,height] ease-linear motion-reduce:transition-none",
  "group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height,var(--dashboard-site-header-height))]",
].join(" ");

const siteHeaderInnerClass =
  "flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6";

const siteHeaderTriggerClass = "-ml-1";

const siteHeaderSeparatorClass = "mx-2 data-[orientation=vertical]:h-4";

const siteHeaderTitleClass = "text-base font-medium text-text-primary";

const siteHeaderActionsClass = "ml-auto flex items-center gap-2";

const siteHeaderGithubButtonClass = "hidden sm:flex";

export {
  siteHeaderActionsClass,
  siteHeaderGithubButtonClass,
  siteHeaderInnerClass,
  siteHeaderSeparatorClass,
  siteHeaderShellClass,
  siteHeaderTitleClass,
  siteHeaderTriggerClass,
};
