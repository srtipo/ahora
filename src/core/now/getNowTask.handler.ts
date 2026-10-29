import { withDb } from "@/core/db";
import { getNowTaskById } from "./repository";
import type { NowTask } from "@/core/types";

/**
 * The task with the given id.
 *
 * It is what the block screen asks for: the task that was tapped in Ahora,
 * the one the block is about. If the task is not in the table anymore there
 * is none, and the screen is left without a name to show.
 */
export async function getNowTask(id: string): Promise<NowTask | null> {
  return withDb((db) => getNowTaskById(db, id));
}
