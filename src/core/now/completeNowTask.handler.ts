import { withTransaction } from "@/core/db";
import { deleteStackTask, listStackTasks } from "@/core/stack";
import { MAX_OPEN_TASKS, OPEN_STATUSES } from "./addNowTask.handler";
import {
  completeNowTaskById,
  insertNowTask,
  listNowTasks,
} from "./repository";

/**
 * Marks a task of now as done and fills the place it leaves free.
 *
 * The task stays in the table with the moment it was completed, so that the
 * row of the completed ones of the day can be drawn above the three.
 *
 * The place that is left free is taken by the task that has been waiting
 * the longest, or by the marked one if there is one. If the stack is empty
 * there is nobody to call up and the list stays with less rows.
 *
 * The moment is taken here and not asked for: the repository only writes
 * what it is given, and the moment a task was completed is the one of the
 * tap, not the one of the moment the base was free.
 *
 * The three writes are in the same transaction: the completed task, the one
 * that goes up and the one that leaves the stack are one single fact, so
 * there is no moment in which a task is in both tables or in neither.
 */
export async function completeNowTask(id: string): Promise<void> {
  const completedAt = Date.now();

  await withTransaction(async (db) => {
    await completeNowTaskById(db, id, completedAt);

    // The rule of the three: now holds three open tasks, always. If the
    // three are taken there is no place to fill.
    const open = await listNowTasks(db, OPEN_STATUSES);

    if (open.length >= MAX_OPEN_TASKS) return;

    // The stack is read in the order of the priority: the marked one first,
    // even if it is the newest, and the oldest after it.
    const [next] = await listStackTasks(db);

    if (!next) return;

    // The task moves: it keeps its id, its name, its mark and its age, so
    // it is the same task and not a copy of it.
    //
    // The write to now comes first: if it fails, the transaction rolls back
    // and the task stays in the stack instead of being nowhere.
    await insertNowTask(db, {
      id: next.id,
      name: next.name,
      marked: next.marked,
      createdAt: next.createdAt,
    });

    await deleteStackTask(db, next.id);
  });
}
