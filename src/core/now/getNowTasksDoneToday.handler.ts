import { withDb } from "@/core/db";
import { startOfDay, startOfNextDay } from "@/core/dates";
import { listNowTasksDoneToday } from "./repository";
import type { NowTask } from "@/core/types";

/**
 * How many of the tasks completed today are returned: the three most
 * recent.
 *
 * The completed ones are drawn above the three open ones, so they are the
 * record of the day and not a list to browse: only the last three are
 * brought back, and the ones that fall out of them are the oldest.
 */
export const MAX_DONE_TASKS = 3;

/**
 * The tasks of now that were completed today, the most recent first.
 *
 * A task that is done is not in now anymore, but the ones completed today
 * are still of the day, so they can be told apart from the older ones.
 */
export async function getNowTasksDoneToday(): Promise<NowTask[]> {
  const now = Date.now();

  return withDb((db) =>
    listNowTasksDoneToday(
      db,
      startOfDay(now),
      startOfNextDay(now),
      MAX_DONE_TASKS,
    ),
  );
}
