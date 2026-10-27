import { useQuery } from "@tanstack/react-query";
import { getNowTasksDoneToday, seedNowTasks } from "@/core/now";

/**
 * The tasks of now that were completed today, the most recent first.
 *
 * The screen draws what comes back and nothing more: what is stored and how
 * it is ordered is the core's business.
 */
export function useGetNowTasksDoneToday() {
  return useQuery({
    queryKey: ["app", "nowTasksDoneToday"],
    queryFn: async () => {
      // Temporary, for development only: the sample data and the file that
      // writes it go away together.
      if (__DEV__) await seedNowTasks();

      return getNowTasksDoneToday();
    },
  });
}
