import { TicketItem } from "@/features/tickets/types";

export interface CategoryStat {
  category: string;
  count: number;
  percentage: number;
}

export interface LocationStat {
  location: string;
  count: number;
}

export interface AnalyticsData {
  kpis: {
    totalTickets: number;
    resolvedRate: number; // e.g. 95.0%
    averageRating: number; // e.g. 4.8 / 5
    totalFeedbacks: number;
    activePendingCount: number;
  };
  categories: CategoryStat[];
  topLocations: LocationStat[];
  userTypeRatio: {
    student: number;
    staff: number;
    studentPercentage: number;
    staffPercentage: number;
  };
  statusBreakdown: {
    new: number;
    inProgress: number;
    pending: number;
    resolved: number;
  };
  recentPendingTickets: TicketItem[];
}

export type AnalyticsActionResult =
  | { success: true; data: AnalyticsData }
  | { success: false; error: string };
