import * as Crypto from "expo-crypto";

/**
 * A new id for a task.
 *
 * It is a UUID v4: the standard one, with the random part taken from the
 * system and not from `Math.random`, so two tasks written in the same
 * millisecond do not share the id.
 */
export function newId(): string {
  return Crypto.randomUUID();
}
