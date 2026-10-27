import { useQuery } from "@tanstack/react-query";
import { getStackTasks, seedStackTasks } from "@/core/stack";

/**
 * The tasks of the stack, the oldest first.
 *
 * The screen draws what comes back and nothing more: what is stored and how
 * it is ordered is the core's business.
 */
export function useGetStackTasks() {
  return useQuery({
    queryKey: ["stackTasks"],
    queryFn: async () => {
      // Temporary, for development only: the sample data and the file that
      // writes it go away together.
      if (__DEV__) await seedStackTasks();

      return getStackTasks();
    },
  });
}
