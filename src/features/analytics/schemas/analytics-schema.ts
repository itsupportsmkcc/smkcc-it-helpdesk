import { z } from "zod";

export const timeRangeFilterSchema = z.enum([
  "all",
  "this_month",
  "last_30_days",
  "this_year",
]);

export type TimeRangeFilter = z.infer<typeof timeRangeFilterSchema>;
