import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNowTask } from "@/core/now";

/**
 * Marks a task of now as the priority one.
 *
 * The write goes through the core, which is the one that knows what the
 * mark means: it is of the task, and marking one does not take the mark
 * away from the others.
 *
 * The cache of the list is invalidated because the list changed: the marked
 * task goes first.
 */
export function useMarkNowTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNowTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nowTasks"] });
    },
  });
}
