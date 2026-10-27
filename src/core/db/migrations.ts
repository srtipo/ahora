import type { SQLiteDatabase } from "expo-sqlite";
import { SCHEMA } from "./schema";

/**
 * The migrations, in order.
 *
 * The position of a migration is the version it leaves behind: the first one
 * takes the database from nothing to version 1. A migration is never edited
 * once it is out, because it has already run on somebody's phone; a change to
 * the form of the data is a new migration, at the end.
 */
const MIGRATIONS: ((db: SQLiteDatabase) => Promise<void>)[] = [
  async (db) => {
    await db.execAsync(SCHEMA);
  },
];

/** The version the database has when every migration has run. */
export const CURRENT_VERSION = MIGRATIONS.length;

/** The migrations, in order. */
export { MIGRATIONS };
