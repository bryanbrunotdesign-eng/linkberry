/**
 * Shared "now" date for the entire app — uses the real current date and time.
 */
export function getAppNow(): Date {
  return new Date();
}

export function getAppToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
