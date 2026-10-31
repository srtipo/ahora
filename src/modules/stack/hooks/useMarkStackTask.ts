import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markStackTask } from "@/core/mark";

/**
 * Marks a task of the stack as the priority one.
 *
 * The write goes through the core, which is the one that knows the rule of
 * the mark: it is one in the whole app, so the task that was marked before
 * loses it.
 *
 * The cache of the inbox is invalidated because the list changed, and the
 * one of Ahora too: the task that was marked there loses the mark and its
 * card stops being tinted.
 */
export function useMarkStackTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markStackTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stackTasks"] });
      queryClient.invalidateQueries({ queryKey: ["nowTasks"] });
    },
  });
}
