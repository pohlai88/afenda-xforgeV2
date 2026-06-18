"use client";

import { Badge } from "../../../../afenda-ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../afenda-ui/card";
import { cn } from "../../../../../lib/utils";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { memo } from "react";
import { DEMO_DASHBOARD_SECTION_CARDS } from "./dashboard-section-cards-demo-data";
import {
  sectionCardsBadgeClass,
  sectionCardsCardClass,
  sectionCardsFooterClass,
  sectionCardsFooterDescriptionClass,
  sectionCardsFooterTitleClass,
  sectionCardsGridClass,
  sectionCardsTitleClass,
} from "./dashboard-section-cards-recipes";
import type {
  DashboardSectionCardItem,
  SectionCardsProps,
} from "./dashboard-section-cards-types";

const TREND_ICONS = {
  down: TrendingDownIcon,
  up: TrendingUpIcon,
} as const;

const SectionCard = memo(function SectionCard({
  item,
}: {
  readonly item: DashboardSectionCardItem;
}) {
  const TrendIcon = TREND_ICONS[item.trend];

  return (
    <Card
      className={sectionCardsCardClass}
      data-slot={`section-card-${item.id}`}
    >
      <CardHeader>
        <CardDescription>{item.label}</CardDescription>
        <CardTitle className={sectionCardsTitleClass}>{item.value}</CardTitle>
        <CardAction>
          <Badge
            className={sectionCardsBadgeClass}
            tone="neutral"
            variant="outline"
          >
            <TrendIcon aria-hidden="true" className="size-3" />
            {item.change}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className={sectionCardsFooterClass}>
        <div className={sectionCardsFooterTitleClass}>
          {item.footerTitle}
          <TrendIcon aria-hidden="true" className="size-4" />
        </div>
        <div className={sectionCardsFooterDescriptionClass}>
          {item.footerDescription}
        </div>
      </CardFooter>
    </Card>
  );
});

export const SectionCards = memo(function SectionCards({
  className,
  items = DEMO_DASHBOARD_SECTION_CARDS,
}: SectionCardsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(sectionCardsGridClass, className)}
      data-slot="section-cards"
    >
      {items.map((item) => (
        <SectionCard item={item} key={item.id} />
      ))}
    </div>
  );
});
