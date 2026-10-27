import { withDb } from "@/core/db";
import { listNowTasks } from "./repository";
import type { NowTask, NowTaskStatus } from "@/core/types";

/**
 * The statuses of the tasks of now: every one but the done.
 *
 * A task that is done is not in now anymore, so it is not asked for.
 */
const IN_NOW: NowTaskStatus[] = ["todo", "inProgress"];

/**
 * The tasks of now, read from the database.
 *
 * This is the action the screen asks for: it goes to the storage and comes
 * back with the list ready to draw, the marked one first and the oldest
 * after it. The ones that are already done are not part of it, unless they
 * are the ones being asked for.
 */
export async function getNowTasks(
  statuses: NowTaskStatus[] = IN_NOW,
): Promise<NowTask[]> {
  return withDb((db) => listNowTasks(db, statuses));
}
