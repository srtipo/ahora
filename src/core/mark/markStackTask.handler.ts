import { withTransaction } from "@/core/db";
import { unmarkNowTasks } from "@/core/now";
import {
  getStackTaskById,
  markStackTaskById,
  unmarkStackTasks,
} from "@/core/stack";

/**
 * Marks a task of the stack as the priority one.
 *
 * The mark is one in the whole app: the task that is marked now is the only
 * one that keeps it, and the ones that were marked before —in the stack or
 * in now— lose it. That is the rule that the long press of the inbox
 * applies, and it is also the one that keeps the lists sorted by themselves:
 * the marked task goes first, even when it is the newest.
 *
 * If the task is not waiting in the stack there is nothing to mark: the id
 * is old, the task left, and the marks that are there stay as they are.
 *
 * The writes are in the same transaction: there is no moment in which two
 * tasks are marked and none in which there is none.
 */
export async function markStackTask(id: string): Promise<void> {
  await withTransaction(async (db) => {
    const task = await getStackTaskById(db, id);

    if (!task) return;

    await unmarkNowTasks(db);
    await unmarkStackTasks(db, id);
    await markStackTaskById(db, id);
  });
}
