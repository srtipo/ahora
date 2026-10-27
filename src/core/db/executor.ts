import type { SQLiteDatabase } from "expo-sqlite";
import { getDb } from "./database";

/**
 * What can run a query: the database, or a transaction on it.
 *
 * The two have the same methods, so every function of the core takes one of
 * these and does not have to know which one it got.
 */
export type Executor = Pick<
  SQLiteDatabase,
  "execAsync" | "getAllAsync" | "getFirstAsync" | "runAsync"
>;

/**
 * Runs something against the database.
 *
 * The function gets the open database and returns what it computes.
 */
export async function withDb<T>(fn: (db: Executor) => Promise<T>): Promise<T> {
  return fn(await getDb());
}

/**
 * Runs something against the database, inside a transaction.
 *
 * The transaction is exclusive: it does not run at the same time as
 * another one, so two writes that happen one after the other are two
 * writes and not a write and an error. The function gets the transaction
 * and returns what it computes.
 */
export async function withTransaction<T>(
  fn: (db: Executor) => Promise<T>,
): Promise<T> {
  const db = await getDb();
  let result!: T;

  await db.withExclusiveTransactionAsync(async (txn) => {
    result = await fn(txn);
  });

  return result;
}
