import type { Executor } from "@/core/db";
import { newId } from "@/core/ids";
import type { StackTask } from "@/core/types";

/**
 * The row of a task of the stack, as the database gives it back.
 *
 * The names are the ones of the table and not the ones of the code: the
 * translation happens here, in one place.
 */
type StackTaskRow = {
  id: string;
  name: string;
  marked: number;
  created_at: number;
};

/** The row as the code knows it. */
function toStackTask(row: StackTaskRow): StackTask {
  return {
    id: row.id,
    name: row.name,
    marked: row.marked === 1,
    createdAt: row.created_at,
  };
}

/**
 * A task that is added to the table.
 *
 * The name, the mark and the moment come from the caller: the repository
 * does not decide them, it only writes them. The id is not asked for
 * either: the repository gives one to the task.
 */
export type NewStackTask = {
  /** What the user wrote. */
  name: string;
  /** It is drawn highlighted. */
  marked: boolean;
  /** Epoch in milliseconds. It orders the tasks by age. */
  createdAt: number;
};

/**
 * The tasks of the stack, the marked one first.
 *
 * The order is the one of the priority: the marked one goes first, even if
 * it is the newest, and the rest go by age, the oldest first. It is the same
 * order the tasks of now have.
 */
export async function listStackTasks(db: Executor): Promise<StackTask[]> {
  const rows = await db.getAllAsync<StackTaskRow>(
    `SELECT id, name, marked, created_at
     FROM stack_task
     ORDER BY marked DESC, created_at ASC`,
  );

  return rows.map(toStackTask);
}

/**
 * Adds a task to the table of the tasks of the stack.
 *
 * The id is given here, not asked for: two tasks written in the same
 * millisecond do not share it.
 */
export async function insertStackTask(
  db: Executor,
  task: NewStackTask,
): Promise<void> {
  await db.runAsync(
    `INSERT INTO stack_task (id, name, marked, created_at)
     VALUES (?, ?, ?, ?)`,
    [newId(), task.name, task.marked ? 1 : 0, task.createdAt],
  );
}

/**
 * Removes a task from the table of the tasks of the stack.
 *
 * It is the way out of the stack: the task that goes to now does not stay
 * waiting here.
 */
export async function deleteStackTask(db: Executor, id: string): Promise<void> {
  await db.runAsync("DELETE FROM stack_task WHERE id = ?", [id]);
}
