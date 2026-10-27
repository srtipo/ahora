import type { Executor } from "@/core/db";
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
