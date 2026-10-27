import { withDb } from "@/core/db";

/**
 * The tasks of the sample.
 *
 * They are the pending ones of a day in use: one marked and two that are
 * not. The minutes are when each one was written, and they are what puts
 * them in order: the oldest first.
 */
const SAMPLE: {
  name: string;
  marked: boolean;
  minutesAgo: number;
}[] = [
  { name: "Reservar la cita del dentista", marked: true, minutesAgo: 55 },
  { name: "Contestar el correo de la aseguradora", marked: false, minutesAgo: 30 },
  { name: "Buscar el cargador del auto", marked: false, minutesAgo: 10 },
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
 * Fills the table of the tasks of the stack with the sample, if it is empty.
 *
 * It is a scaffold of development: the screen has nothing to draw until
 * there is something in the base, and the only way to have something is to
 * write it. The sample only goes in when the table is empty, so a real use
 * is never touched.
 */
export function seedStackTasks(): Promise<void> {
  if (!seeding) seeding = seed();

  return seeding;
}

/** Writes the sample, if the table is empty. */
async function seed(): Promise<void> {
  await withDb(async (db) => {
    const row = await db.getFirstAsync<{ total: number }>(
      "SELECT COUNT(*) AS total FROM stack_task",
    );

    if ((row?.total ?? 0) > 0) return;

    const now = Date.now();

    for (const [index, task] of SAMPLE.entries()) {
      const createdAt = now - task.minutesAgo * 60_000;

      await db.runAsync(
        `INSERT INTO stack_task (id, name, marked, created_at)
         VALUES (?, ?, ?, ?)`,
        [`seed-${index}`, task.name, task.marked ? 1 : 0, createdAt],
      );
    }
  });
}
