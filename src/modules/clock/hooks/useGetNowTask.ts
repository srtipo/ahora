import { useQuery } from "@tanstack/react-query";
import { getNowTask } from "@/core";

/**
 * The task of the block.
 *
 * The screen asks for it by id: the id comes in the route, from the card
 * that was tapped in Ahora, and the name comes from the base. Without an id
 * there is no task to ask for, so the query does not run.
 *
 * The id is part of the key of the query, so each task has its own entry in
 * the cache: a task that is written later is a different key and does not
 * have to invalidate anything of the others.
 */
export function useGetNowTask(id: string | undefined) {
  return useQuery({
    queryKey: ["nowTask", id],
    queryFn: () => getNowTask(id ?? ""),
    enabled: !!id,
  });
}
