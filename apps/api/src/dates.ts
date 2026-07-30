/** Date helpers using UTC calendar days to keep seed/day keys stable. */

export function toDateOnly(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function parseDateOnly(isoDate: string): Date {
  const [y, m, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, day));
}

export function formatDateOnly(d: Date): string {
  return toDateOnly(d).toISOString().slice(0, 10);
}

export function addDays(d: Date, days: number): Date {
  const base = toDateOnly(d);
  return new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
}

export function todayUtc(): Date {
  return toDateOnly(new Date());
}

/** Monday=0 ... Sunday=6 relative to ISO weekday where Monday is start of Week 1 pattern. */
export function weekdayIndexMon0(d: Date): number {
  const js = toDateOnly(d).getUTCDay(); // Sun=0..Sat=6
  return js === 0 ? 6 : js - 1;
}
