import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markStackTask } from "@/core/stack";

/**
 * Marks a task of the stack, or takes the mark away if it already had it.
 *
 * The write goes through the core, which is the one that knows what the
 * mark means: it is of the task, so marking one does not take the mark away
 * from the others.
 *
 * When it is done the cache of the list is invalidated, so the screen draws
 * what is stored and not what it had.
 */
export function useMarkStackTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markStackTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stackTasks"] });
    },
  });
}
