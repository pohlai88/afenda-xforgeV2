import type {
  DashboardSectionCardItem,
  DashboardSectionCardTrend,
} from "../dashboard-contracts";

export type { DashboardSectionCardItem, DashboardSectionCardTrend };

export interface SectionCardsProps {
  readonly className?: string;
  readonly items?: readonly DashboardSectionCardItem[];
}
