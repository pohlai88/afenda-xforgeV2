export type DashboardSectionCardTrend = "down" | "up";

export interface DashboardSectionCardItem {
  readonly change: string;
  readonly description?: string;
  readonly footerDescription: string;
  readonly footerTitle: string;
  readonly id: string;
  readonly label: string;
  readonly trend: DashboardSectionCardTrend;
  readonly value: string;
}

export interface SectionCardsProps {
  readonly className?: string;
  readonly items?: readonly DashboardSectionCardItem[];
}
