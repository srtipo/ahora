import { useQuery } from "@tanstack/react-query";
import { getStackTasks } from "@/core/stack";

/**
 * The tasks of the stack, the oldest first.
 *
 * The screen draws what comes back and nothing more: what is stored and how
 * it is ordered is the core's business.
 */
export function useGetStackTasks() {
  return useQuery({
    queryKey: ["stackTasks"],
    queryFn: () => getStackTasks(),
  });
}
