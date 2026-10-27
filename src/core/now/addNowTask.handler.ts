import { withTransaction } from "@/core/db";
import type { NowTaskStatus } from "@/core/types";
import {
  deleteNowTask,
  insertNowTask,
  listNowTasks,
  type NewNowTask,
} from "./repository";

/**
 * A task that is written in now.
 *
 * The name and the mark are what the user wrote: they come from the caller.
 * The moment is not asked for: the handler says when the task was written.
 */
export type NowTaskToAdd = {
  /** What the user wrote. */
  name: string;
  /** It is drawn highlighted. */
  marked: boolean;
};

/**
 * How many tasks can be open at the same time.
 *
 * There are always three: when a fourth one comes, the least priority one
 * leaves to make room for it.
 */
const MAX_OPEN_TASKS = 3;

/**
 * The statuses of the tasks that are open: every one but the done.
 *
 * A task that is done is not in now anymore, so it is not one of the three.
 */
const OPEN: NowTaskStatus[] = ["todo", "inProgress"];

/**
 * Adds a task to now.
 *
 * Now holds three open tasks, always. If there is room, the task goes in
 * and nothing else happens. If the three are taken, the one that matters
 * the least leaves to make room for the new one: the last of the order,
 * which is the unmarked one and, among those, the newest.
 */
export async function addNowTask(task: NowTaskToAdd): Promise<void> {
  // The moment is taken before the transaction: the task has the age it
  // had when it was written, not the age it has when the base is free.
  const createdAt = Date.now();

  await withTransaction(async (db) => {
    const open = await listNowTasks(db, OPEN);

    // How many have to leave so that the new one fits: one for each place
    // over the three.
    const leaving = open.length - (MAX_OPEN_TASKS - 1);

    if (leaving > 0) {
      // The list comes with the marked one first and the oldest after it,
      // so the last ones are the ones that matter the least: those are the
      // ones that leave.
      const out = open.slice(open.length - leaving);

      for (const going of out) {
        // The task leaves now. The inbox does not exist yet, so there is
        // nowhere else for it to go and it is deleted. When the inbox
        // arrives, this is where it is written to the stack (`stack_task`)
        // instead of being deleted, in the same transaction.
        await deleteNowTask(db, going.id);
      }
    }

    const written: NewNowTask = { ...task, createdAt };

    await insertNowTask(db, written);
  });
}
