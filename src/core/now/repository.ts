import type { Executor } from "@/core/db";
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
 * The tasks with one of the given statuses, the oldest first.
 *
 * The statuses are the ones the caller asks for: the table knows all of
 * them and the repository does not decide which ones are wanted.
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
     ORDER BY created_at ASC`,
    statuses,
  );

  return rows.map(toNowTask);
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
