import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveNowTaskToStack } from "@/core/now";

/**
 * Takes a task out of now and sends it to the stack.
 *
 * The write goes through the core, which is the one that knows what the move
 * means: the task that leaves keeps its mark and its age, and the place it
 * leaves free is taken by the task that has been waiting the longest.
 *
 * The cache of the two lists is invalidated: the task leaves one list and
 * another one comes up in its place, so both of them changed.
 */
export function useMoveNowTaskToStack() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => moveNowTaskToStack(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nowTasks"] });
      queryClient.invalidateQueries({ queryKey: ["stackTasks"] });
    },
  });
}
