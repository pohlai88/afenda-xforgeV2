import type { ChartConfig } from "@repo/design-system/components/afenda-ui/chart";
import type { ReactNode } from "react";
import type { ChartAreaDataPoint } from "../dashboard-contracts";

export interface ChartAreaInteractiveProps {
  readonly className?: string;
  readonly config?: ChartConfig;
  readonly data?: readonly ChartAreaDataPoint[];
  readonly description?: ReactNode;
  readonly mobileDescription?: ReactNode;
  readonly referenceDate?: string;
  readonly title?: string;
}
