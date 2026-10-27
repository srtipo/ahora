import { useQuery } from "@tanstack/react-query";
import { getNowTasks, seedNowTasks } from "@/core/now";

/**
 * The tasks of now, the oldest first.
 *
 * The screen draws what comes back and nothing more: what is stored and how
 * it is ordered is the core's business.
 */
export function useGetNowTasks() {
  return useQuery({
    queryKey: ["app", "nowTasks"],
    queryFn: async () => {
      // Temporary, for development only: the sample data and the file that
      // writes it go away together.
      if (__DEV__) await seedNowTasks();

      return getNowTasks();
    },
  });
}
