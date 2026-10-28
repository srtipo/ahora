import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNowTask, type NowTaskToAdd } from "@/core/now";

/**
 * Adds a task to now.
 *
 * The write goes through the core, which is the one that knows the rule of
 * the three. When it is done the cache of the list is invalidated, so the
 * screen draws what is stored and not what it had.
 *
 * The cache of the inbox is invalidated too: the task that does not fit in
 * the three goes there to wait, and the list of the inbox changed.
 */
export function useAddNowTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: NowTaskToAdd) => addNowTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nowTasks"] });
      queryClient.invalidateQueries({ queryKey: ["stackTasks"] });
    },
  });
}
