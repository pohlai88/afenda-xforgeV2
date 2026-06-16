import { dashboardBlockCardSurfaceClass } from "../dashboard-block-recipes";

const chartAreaInteractiveCardClass = [
  "@container/card",
  dashboardBlockCardSurfaceClass,
].join(" ");

const chartAreaInteractiveDescriptionWideClass = "hidden @[540px]/card:block";

const chartAreaInteractiveDescriptionNarrowClass = "@[540px]/card:hidden";

const chartAreaInteractiveToggleGroupClass =
  "hidden *:data-[slot=toggle-group-item]:px-4 @[767px]/card:flex";

const chartAreaInteractiveSelectTriggerClass =
  "flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden";

const chartAreaInteractiveContentClass = "px-2 pt-4 sm:px-6 sm:pt-6";

const chartAreaInteractiveContainerClass = "aspect-auto h-[250px] w-full";

export {
  chartAreaInteractiveCardClass,
  chartAreaInteractiveContainerClass,
  chartAreaInteractiveContentClass,
  chartAreaInteractiveDescriptionNarrowClass,
  chartAreaInteractiveDescriptionWideClass,
  chartAreaInteractiveSelectTriggerClass,
  chartAreaInteractiveToggleGroupClass,
};
