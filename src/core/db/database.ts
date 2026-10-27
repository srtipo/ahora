import * as SQLite from "expo-sqlite";
import { CURRENT_VERSION, MIGRATIONS } from "./migrations";

/**
 * The name of the database file.
 *
 * It has a name of its own and not the default one, because in Expo Go the
 * databases of every project live in the same folder.
 *
 * The version is in the name because the form of the data changed: the
 * database of the previous shape is a different file, so the new one starts
 * from nothing and no old table is left behind.
 */
export const DATABASE_NAME = "ahora-v2.db";

/**
 * The open database.
 *
 * It is opened once and kept for the life of the app: opening it again for
 * every query would pay the price of the connection on every read.
 */
let opening: Promise<SQLite.SQLiteDatabase> | null = null;

async function open(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

  // The journal in WAL mode: a write does not block a read.
  await db.execAsync("PRAGMA journal_mode = WAL;");

  await migrate(db);

  // The statistics of the tables. Without them the planner does not know how
  // many rows there are and it can pick the wrong way to read them. `optimize`
  // only analyzes what changed enough to be worth it, so it is cheap to run.
  await db.execAsync("PRAGMA optimize;");

  return db;
}

/**
 * Moves the database to the version of the app.
 *
 * The version lives in the database itself (`PRAGMA user_version`), so it
 * travels with the data and not with the code. A database that is already at
 * the current version is left alone.
 *
 * The migration and the version that says it ran are one transaction: if the
 * app dies in the middle of one, the database stays in the version it was in
 * and the migration runs again from the beginning, which is what the
 * migrations have to be able to do.
 */
async function migrate(db: SQLite.SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  const version = row?.user_version ?? 0;

  for (let from = version; from < CURRENT_VERSION; from++) {
    await db.withTransactionAsync(async () => {
      await MIGRATIONS[from](db);
      await db.execAsync(`PRAGMA user_version = ${from + 1};`);
    });
  }
}

/**
 * The database, opened once.
 *
 * If the opening fails, the failure is not remembered: the next call tries
 * again, because a database that did not open may open the next time.
 */
export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!opening) {
    opening = open().catch((error: unknown) => {
      opening = null;
      throw error;
    });
  }

  return opening;
}
