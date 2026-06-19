"use client";

import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { Badge } from "../../../afenda-ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../afenda-ui/card";
import { blockRecipe } from "../../block-recipes";
import { dashboardSectionCardsGridClass } from "./dashboard-recipes";

export function SectionCards() {
  return (
    <div
      className={cn(blockRecipe("blockShell"), dashboardSectionCardsGridClass)}
      data-slot="section-cards"
    >
      <Card className={cn()}>
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className={cn()}>$1,250.00</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className={cn()}>
          <div className={cn()}>
            Trending up this month <TrendingUpIcon className={cn()} />
          </div>
          <div className={cn()}>Visitors for the last 6 months</div>
        </CardFooter>
      </Card>
      <Card className={cn()}>
        <CardHeader>
          <CardDescription>New Customers</CardDescription>
          <CardTitle className={cn()}>1,234</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingDownIcon />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className={cn()}>
          <div className={cn()}>
            Down 20% this period <TrendingDownIcon className={cn()} />
          </div>
          <div className={cn()}>Acquisition needs attention</div>
        </CardFooter>
      </Card>
      <Card className={cn()}>
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className={cn()}>45,678</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className={cn()}>
          <div className={cn()}>
            Strong user retention <TrendingUpIcon className={cn()} />
          </div>
          <div className={cn()}>Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className={cn()}>
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className={cn()}>4.5%</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className={cn()}>
          <div className={cn()}>
            Steady performance increase <TrendingUpIcon className={cn()} />
          </div>
          <div className={cn()}>Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  );
}
