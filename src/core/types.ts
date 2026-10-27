/**
 * The data of the app.
 *
 * The state lives in a SQLite database: the tasks of now and the stack of
 * the tasks that are not in now yet.
 */

export type NowTaskStatus = "todo" | "inProgress" | "done";

export type NowTask = {
  /** Short id: the epoch in base36 plus a couple of random characters. */
  id: string;
  /** What the user wrote. */
  name: string;
  /** Where the task is: to do, in progress or done. "done" is the one that was already completed. */
  status: NowTaskStatus;
  /** It is drawn highlighted. */
  marked: boolean;
  /** Epoch in milliseconds. It orders the tasks by age. */
  createdAt: number;
  /** Epoch in milliseconds. Only the done tasks have it. */
  completedAt?: number;
};
