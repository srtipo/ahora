import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addStackTask, type StackTaskToAdd } from "@/core/stack";

/**
 * Adds a task to the stack.
 *
 * The write goes through the core, which is the one that knows how the
 * stack is written. When it is done the cache of the list is invalidated, so
 * the screen draws what is stored and not what it had.
 */
export function useAddStackTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: StackTaskToAdd) => addStackTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stackTasks"] });
    },
  });
}
