import type { ChartConfig } from "@repo/design-system/components/afenda-ui/chart";
import type { ReactNode } from "react";
import type { ChartAreaTimeRange } from "./dashboard-chart-constants";

export type { ChartAreaTimeRange };

export interface ChartAreaDataPoint {
  readonly date: string;
  readonly desktop: number;
  readonly mobile: number;
}

export interface ChartAreaInteractiveProps {
  readonly className?: string;
  readonly config?: ChartConfig;
  readonly data?: readonly ChartAreaDataPoint[];
  readonly description?: ReactNode;
  readonly mobileDescription?: ReactNode;
  readonly referenceDate?: string;
  readonly title?: string;
}
