import { withDb } from "@/core/db";
import type { NowTaskStatus } from "@/core/types";

/**
 * The tasks of the sample.
 *
 * They are a day in use: two marked, one of them in progress and the other
 * one still to do, and one already done. The minutes are when each one was
 * written, and they are what puts them in order: the oldest first.
 */
const SAMPLE: {
  name: string;
  status: NowTaskStatus;
  marked: boolean;
  minutesAgo: number;
}[] = [
  { name: "Renovar el carnet", status: "inProgress", marked: true, minutesAgo: 40 },
  { name: "Llamar al taller", status: "todo", marked: true, minutesAgo: 25 },
  { name: "Comprar pan", status: "done", marked: false, minutesAgo: 5 },
];

/**
 * The seeding of the sample, once.
 *
 * The sample is written by every hook that reads the base, and they all ask
 * for it at the same time: without this, two of them would see the table
 * empty and write the sample twice.
 */
let seeding: Promise<void> | null = null;

/**
 * Fills the table of the tasks of now with the sample, if it is empty.
 *
 * It is a scaffold of development: the screen has nothing to draw until
 * there is something in the base, and the only way to have something is to
 * write it. The sample only goes in when the table is empty, so a real use
 * is never touched.
 */
export function seedNowTasks(): Promise<void> {
  if (!seeding) seeding = seed();

  return seeding;
}

/** Writes the sample, if the table is empty. */
async function seed(): Promise<void> {
  await withDb(async (db) => {
    const row = await db.getFirstAsync<{ total: number }>(
      "SELECT COUNT(*) AS total FROM now_tasks",
    );

    if ((row?.total ?? 0) > 0) return;

    const now = Date.now();

    for (const [index, task] of SAMPLE.entries()) {
      const createdAt = now - task.minutesAgo * 60_000;

      await db.runAsync(
        `INSERT INTO now_tasks (id, name, status, marked, created_at, completed_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          `seed-${index}`,
          task.name,
          task.status,
          task.marked ? 1 : 0,
          createdAt,
          task.status === "done" ? now : null,
        ],
      );
    }
  });
}
