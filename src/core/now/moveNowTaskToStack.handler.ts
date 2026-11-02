import { withTransaction } from "@/core/db";
import { deleteStackTask, insertStackTask, listStackTasks } from "@/core/stack";
import { OPEN_STATUSES } from "./addNowTask.handler";
import { deleteNowTask, getNowTaskById, insertNowTask } from "./repository";

/**
 * Takes a task out of now and sends it to the stack.
 *
 * The task that leaves keeps its id, its name, its mark and its age: it is
 * the same task and not a copy of it. The mark belongs to the task, so
 * changing of table does not take it away: the one that waits in the stack
 * can be the marked one.
 *
 * The place that is left free is taken by the task that has been waiting the
 * longest, or by the marked one if there is one: the order of the stack, the
 * marked one first and the oldest after it.
 *
 * The task that leaves is not the one that comes back: the replacement is
 * chosen before the moved task is written in the stack, so a task that goes
 * out of now does not come back to now in the same move.
 *
 * The four writes are in the same transaction: the one that leaves and the
 * one that comes up are a single fact, so there is no moment in which a task
 * is in both tables or in neither.
 *
 * A task that is already done does not move: it stays in now with the moment
 * it was completed, because that row is the record of the day.
 */
export async function moveNowTaskToStack(id: string): Promise<void> {
  await withTransaction(async (db) => {
    const task = await getNowTaskById(db, id);

    // There is no task with that id: the id is old or the task is not one of
    // ours. A done task does not move either: it is the record of the day,
    // not one of the three.
    if (!task) return;
    if (!OPEN_STATUSES.includes(task.status)) return;

    // The replacement is read before the moved task is written in the stack:
    // otherwise the task that leaves could be the one that comes back, and
    // the move would undo itself.
    const next = (await listStackTasks(db)).find((t) => t.id !== id);

    // The write to the stack comes first: if it fails, the transaction rolls
    // back and the task stays in now instead of being nowhere.
    await insertStackTask(db, {
      id: task.id,
      name: task.name,
      marked: task.marked,
      createdAt: task.createdAt,
    });

    await deleteNowTask(db, id);

    // If there was nobody waiting there is nobody to call up and the list
    // stays with less rows.
    if (!next) return;

    // The task moves: it keeps its id, its name, its mark and its age, so it
    // is the same task and not a copy of it.
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
