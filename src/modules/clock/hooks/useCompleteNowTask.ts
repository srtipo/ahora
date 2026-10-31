import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeNowTask } from "@/core/now";

/**
 * Completes a task of now.
 *
 * The write goes through the core, which is the one that knows the rule of
 * the three: the task is done and the place it leaves is taken by the one
 * that has been waiting the longest in the inbox.
 *
 * The caches are invalidated because the three of Ahora changed, the list of
 * the inbox changed too (the task that went up was waiting there) and the
 * completed ones of the day are a new row.
 *
 * The task by id is not invalidated: the screen that asks for it is the one
 * of the block, and it goes away as soon as the task is done.
 */
export function useCompleteNowTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => completeNowTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nowTasks"] });
      queryClient.invalidateQueries({ queryKey: ["nowTasksDoneToday"] });
      queryClient.invalidateQueries({ queryKey: ["stackTasks"] });
    },
  });
}
