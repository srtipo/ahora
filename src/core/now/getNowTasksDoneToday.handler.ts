import { withDb } from "@/core/db";
import { startOfDay, startOfNextDay } from "@/core/dates";
import { listNowTasksDoneToday } from "./repository";
import type { NowTask } from "@/core/types";

/**
 * The tasks of now that were completed today, the most recent first.
 *
 * A task that is done is not in now anymore, but the ones completed today
 * are still of the day, so they can be told apart from the older ones.
 */
export async function getNowTasksDoneToday(): Promise<NowTask[]> {
  const now = Date.now();

  return withDb((db) =>
    listNowTasksDoneToday(db, startOfDay(now), startOfNextDay(now)),
  );
}
