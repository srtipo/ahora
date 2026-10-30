import { useQuery } from "@tanstack/react-query";
import { getNowTasksDoneToday } from "@/core/now";

/**
 * The tasks of now that were completed today, the most recent first.
 *
 * The screen draws what comes back and nothing more: what is stored and how
 * it is ordered is the core's business.
 */
export function useGetNowTasksDoneToday() {
  return useQuery({
    queryKey: ["nowTasksDoneToday"],
    queryFn: () => getNowTasksDoneToday(),
  });
}
