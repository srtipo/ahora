import type { Executor } from "@/core/db";
import { newId } from "@/core/ids";
import type { NowTask, NowTaskStatus } from "@/core/types";

/**
 * The row of a task of now, as the database gives it back.
 *
 * The names are the ones of the table and not the ones of the code: the
 * translation happens here, in one place. The status comes as it is because
 * the table does not accept any other value.
 */
type NowTaskRow = {
  id: string;
  name: string;
  status: NowTaskStatus;
  marked: number;
  created_at: number;
  completed_at: number | null;
};

/** The row as the code knows it. */
function toNowTask(row: NowTaskRow): NowTask {
  const task: NowTask = {
    id: row.id,
    name: row.name,
    status: row.status,
    marked: row.marked === 1,
    createdAt: row.created_at,
  };

  if (row.completed_at !== null) task.completedAt = row.completed_at;

  return task;
}

/**
 * A task that is added to the table.
 *
 * The name, the mark and the moment come from the caller: the repository
 * does not decide them, it only writes them. The id is asked for only when
 * the task comes from another table: a task that moves keeps the one it
 * had, because it is the same task and not a copy of it. A new task does not
 * bring one: the repository gives it, so two tasks written in the same
 * millisecond do not share it. The status is not asked for either: a task
 * that is added is a task to do.
 */
export type NewNowTask = {
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
 * The tasks with one of the given statuses, the marked one first.
 *
 * The statuses are the ones the caller asks for: the table knows all of
 * them and the repository does not decide which ones are wanted. The order
 * is the one of the priority: the marked one goes first, even if it is the
 * newest, and the rest go by age, the oldest first. The last of the list
 * is the one that matters the least.
 */
export async function listNowTasks(
  db: Executor,
  statuses: NowTaskStatus[],
): Promise<NowTask[]> {
  if (statuses.length === 0) return [];

  const placeholders = statuses.map(() => "?").join(", ");

  const rows = await db.getAllAsync<NowTaskRow>(
    `SELECT id, name, status, marked, created_at, completed_at
     FROM now_tasks
     WHERE status IN (${placeholders})
     ORDER BY marked DESC, created_at ASC`,
    statuses,
  );

  return rows.map(toNowTask);
}

/**
 * The task with the given id.
 *
 * It is the one task that the block screen asks for: the one that was tapped
 * in Ahora. If there is no task with that id there is nothing: the task left
 * the table, or the id is not one of ours.
 */
export async function getNowTaskById(
  db: Executor,
  id: string,
): Promise<NowTask | null> {
  const row = await db.getFirstAsync<NowTaskRow>(
    `SELECT id, name, status, marked, created_at, completed_at
     FROM now_tasks
     WHERE id = ?`,
    [id],
  );

  return row ? toNowTask(row) : null;
}

/**
 * The tasks that were completed in a day, the most recent first.
 *
 * The day is the one of the clock of the phone: from its first minute to
 * the first minute of the next one. A task that is done but was completed
 * another day is not in it.
 */
export async function listNowTasksDoneToday(
  db: Executor,
  since: number,
  until: number,
): Promise<NowTask[]> {
  const rows = await db.getAllAsync<NowTaskRow>(
    `SELECT id, name, status, marked, created_at, completed_at
     FROM now_tasks
     WHERE status = 'done' AND completed_at >= ? AND completed_at < ?
     ORDER BY completed_at DESC`,
    [since, until],
  );

  return rows.map(toNowTask);
}

/**
 * Adds a task to the table of the tasks of now.
 *
 * The task is written as a task to do and without a moment of completion:
 * the ones that are in progress and the ones that are done come later, with
 * the actions that move them. The id is given here when the task brings
 * one, and made up here when it does not: two tasks written in the same
 * millisecond do not share it.
 */
export async function insertNowTask(
  db: Executor,
  task: NewNowTask,
): Promise<void> {
  await db.runAsync(
    `INSERT INTO now_tasks (id, name, status, marked, created_at, completed_at)
     VALUES (?, ?, 'todo', ?, ?, NULL)`,
    [task.id ?? newId(), task.name, task.marked ? 1 : 0, task.createdAt],
  );
}

/**
 * Marks a task of now as done.
 *
 * The task stays in the table: a done task is not deleted, it is kept with
 * the moment it was completed, so that the row of the completed ones of the
 * day can be drawn above the three.
 *
 * The moment of completion comes from the caller: the repository does not
 * decide when the task was done, it only writes it. If the task was already
 * done, the moment is replaced by the new one.
 */
export async function completeNowTaskById(
  db: Executor,
  id: string,
  completedAt: number,
): Promise<void> {
  await db.runAsync(
    `UPDATE now_tasks
     SET status = 'done', completed_at = ?
     WHERE id = ?`,
    [completedAt, id],
  );
}

/**
 * Removes a task from the table of the tasks of now.
 *
 * It is the way out of now: the task that leaves the three does not stay
 * in the table.
 */
export async function deleteNowTask(
  db: Executor,
  id: string,
): Promise<void> {
  await db.runAsync("DELETE FROM now_tasks WHERE id = ?", [id]);
}
