import { withDb } from "@/core/db";
import { listStackTasks } from "./repository";
import type { StackTask } from "@/core/types";

/**
 * The tasks of the stack, read from the database.
 *
 * This is the action the screen asks for: it goes to the storage and comes
 * back with the list ready to draw, the marked one first and the oldest
 * after it.
 */
export async function getStackTasks(): Promise<StackTask[]> {
  return withDb((db) => listStackTasks(db));
}
