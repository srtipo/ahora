import { withDb } from "@/core/db";
import {
  getNowTaskById,
  markNowTaskById,
  unmarkNowTaskById,
} from "./repository";

/**
 * Marks a task of now, or takes the mark away if it already had it.
 *
 * The mark belongs to the task: this only touches the one with that id, and
 * the tasks around keep the marks they have. So the long press of a card is
 * a switch: the task is marked, and pressing it again takes the mark away.
 *
 * If there is no task with that id there is nothing to mark: the id is old
 * or the task is not one of ours.
 */
export async function markNowTask(id: string): Promise<void> {
  await withDb(async (db) => {
    const task = await getNowTaskById(db, id);

    if (!task) return;

    if (task.marked) {
      await unmarkNowTaskById(db, id);
      return;
    }

    await markNowTaskById(db, id);
  });
}
