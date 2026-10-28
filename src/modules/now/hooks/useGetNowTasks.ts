import { useQuery } from "@tanstack/react-query";
import { getNowTasks } from "@/core/now";

/**
 * The tasks of now, the oldest first.
 *
 * The screen draws what comes back and nothing more: what is stored and how
 * it is ordered is the core's business.
 */
export function useGetNowTasks() {
  return useQuery({
    queryKey: ["nowTasks"],
    queryFn: () => getNowTasks(),
  });
}
