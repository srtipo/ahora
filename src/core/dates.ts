/**
 * The first minute of the day of a moment.
 *
 * It is the clock of the phone: the day starts when the phone says that it
 * starts.
 */
export function startOfDay(now: number): number {
  const date = new Date(now);
  date.setHours(0, 0, 0, 0);

  return date.getTime();
}

/**
 * The first minute of the day after a moment.
 *
 * It is the day of the phone and not the day of 24 hours: the days with
 * daylight saving time are not all the same length.
 */
export function startOfNextDay(now: number): number {
  const date = new Date(now);
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);

  return date.getTime();
}
