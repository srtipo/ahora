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
 * does not decide them, it only writes them. The id is asked for only when
 * the task comes from another table: a task that moves keeps the one it
 * had, because it is the same task and not a copy of it. A new task does
 * not bring one: the repository gives it, so two tasks written in the same
 * millisecond do not share it.
 */
export type NewStackTask = {
  /** Its own id, when the task comes from another table. */
  id?: string;
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
 * The id is given here when the task brings one, and made up here when it
 * does not: two tasks written in the same millisecond do not share it.
 */
export async function insertStackTask(
  db: Executor,
  task: NewStackTask,
): Promise<void> {
  await db.runAsync(
    `INSERT INTO stack_task (id, name, marked, created_at)
     VALUES (?, ?, ?, ?)`,
    [task.id ?? newId(), task.name, task.marked ? 1 : 0, task.createdAt],
  );
}

/**
 * The task of the stack with the given id.
 *
 * If there is no task with that id there is nothing: the id is not one of
 * ours, or the task is not waiting anymore.
 */
export async function getStackTaskById(
  db: Executor,
  id: string,
): Promise<StackTask | null> {
  const row = await db.getFirstAsync<StackTaskRow>(
    `SELECT id, name, marked, created_at
     FROM stack_task
     WHERE id = ?`,
    [id],
  );

  return row ? toStackTask(row) : null;
}

/**
 * Marks a task of the stack as the priority one.
 *
 * The mark is written and nothing else is decided here: who else is marked
 * is not this function's business, because the mark belongs to the task.
 */
export async function markStackTaskById(
  db: Executor,
  id: string,
): Promise<void> {
  await db.runAsync("UPDATE stack_task SET marked = 1 WHERE id = ?", [id]);
}

/**
 * Takes the mark away from a task of the stack.
 *
 * Only that task: the ones around keep the marks they have.
 */
export async function unmarkStackTaskById(
  db: Executor,
  id: string,
): Promise<void> {
  await db.runAsync("UPDATE stack_task SET marked = 0 WHERE id = ?", [id]);
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
