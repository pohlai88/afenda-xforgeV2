import {
  dashboardBlockCardSurfaceClass,
  dashboardKpiCardTintClass,
} from "../dashboard-block-recipes";

const sectionCardsGridClass = [
  "grid grid-cols-1 gap-4",
  "@xl/main:grid-cols-2 @5xl/main:grid-cols-4",
].join(" ");

const sectionCardsCardClass = [
  "@container/card",
  dashboardBlockCardSurfaceClass,
  dashboardKpiCardTintClass,
].join(" ");

const sectionCardsTitleClass =
  "text-2xl font-semibold tabular-nums @[250px]/card:text-3xl";

const sectionCardsBadgeClass = "px-1.5 text-text-secondary";

const sectionCardsFooterClass =
  "flex-col items-start gap-1.5 text-[12px]";

const sectionCardsFooterTitleClass =
  "line-clamp-1 flex gap-2 font-medium";

const sectionCardsFooterDescriptionClass = "text-text-secondary";

export {
  sectionCardsBadgeClass,
  sectionCardsCardClass,
  sectionCardsFooterClass,
  sectionCardsFooterDescriptionClass,
  sectionCardsFooterTitleClass,
  sectionCardsGridClass,
  sectionCardsTitleClass,
};
