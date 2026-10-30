import { withDb } from "@/core/db";
import { insertStackTask, type NewStackTask } from "./repository";

/**
 * A task that is written in the stack.
 *
 * The name and the mark are what the user wrote: they come from the caller.
 * The moment is not asked for: the handler says when the task was written.
 */
export type StackTaskToAdd = {
  /** What the user wrote. */
  name: string;
  /** It is drawn highlighted. */
  marked: boolean;
};

/**
 * Adds a task to the stack.
 *
 * The stack has no limit: whatever is written goes in, and the list orders
 * itself. There is no transaction because the write is a single statement:
 * the database is the one that makes it atomic.
 */
export async function addStackTask(task: StackTaskToAdd): Promise<void> {
  // The moment is taken before the write: the task has the age it had when
  // it was written, not the age it has when the base is free.
  const createdAt = Date.now();
  const written: NewStackTask = { ...task, createdAt };

  await withDb((db) => insertStackTask(db, written));
}
