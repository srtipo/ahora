import { withDb } from "@/core/db";
import {
  getStackTaskById,
  markStackTaskById,
  unmarkStackTaskById,
} from "./repository";

/**
 * Marks a task of the stack, or takes the mark away if it already had it.
 *
 * The mark belongs to the task: this only touches the one with that id, and
 * the tasks around keep the marks they have. So the long press of the inbox
 * is a switch: the task is marked, and pressing it again takes the mark
 * away.
 *
 * If the task is not waiting in the stack there is nothing to mark: the id
 * is old, the task left, and the marks that are there stay as they are.
 */
export async function markStackTask(id: string): Promise<void> {
  await withDb(async (db) => {
    const task = await getStackTaskById(db, id);

    if (!task) return;

    if (task.marked) {
      await unmarkStackTaskById(db, id);
      return;
    }

    await markStackTaskById(db, id);
  });
}
