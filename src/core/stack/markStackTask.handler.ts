import { withDb } from "@/core/db";
import { markStackTaskById } from "./repository";

/**
 * Marks a task of the stack as the priority one.
 *
 * The mark belongs to the task: marking one does not take the mark away
 * from the others, and the list is ordered by itself with the marked ones
 * first.
 *
 * There is no transaction because the write is a single statement: the
 * database is the one that makes it atomic.
 */
export async function markStackTask(id: string): Promise<void> {
  await withDb((db) => markStackTaskById(db, id));
}
