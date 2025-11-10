const pad = (n: number) => n.toString().padStart(2, "0");

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseISODate(s: string): Date {
  return new Date(s);
}

export function addDays(d: Date, days: number): Date {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + days);
  return nd;
}

export function nightsBetween(from: Date, to: Date): number {
  const ms =
    parseISODate(toISODate(to)).getTime() -
    parseISODate(toISODate(from)).getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

export function formatDate(
  d: Date,
  opts?: Intl.DateTimeFormatOptions,
  locale?: string,
) {
  return new Intl.DateTimeFormat(
    locale,
    opts ?? { day: "numeric", month: "short", year: "numeric" },
  ).format(d);
}

export function formatDateRange(from: Date, to: Date, locale?: string) {
  const sameYear = from.getFullYear() === to.getFullYear();
  const sameMonth = sameYear && from.getMonth() === to.getMonth();

  if (sameMonth) {
    const a = new Intl.DateTimeFormat(locale, { day: "numeric" }).format(from);
    const b = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(to);
    return `${a}–${b}`;
  }

  const A = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(from);
  const B = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(to);
  return `${A} – ${B}`;
}

export function expandRangeDays(start: Date, end: Date): string[] {
  const out: string[] = [];
  let cur = parseISODate(toISODate(start));
  const stop = parseISODate(toISODate(end));
  while (cur < stop) {
    out.push(toISODate(cur));
    cur = addDays(cur, 1);
  }
  return out;
}

export function rangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function buildDisabledDates(
  bookings: Array<{ dateFrom: string; dateTo: string }>,
): Set<string> {
  const set = new Set<string>();
  for (const b of bookings) {
    const from = parseISODate(b.dateFrom);
    const to = parseISODate(b.dateTo);
    for (const iso of expandRangeDays(from, to)) set.add(iso);
  }
  return set;
}

export function isRangeAvailable(
  from: Date,
  to: Date,
  bookings: Array<{ dateFrom: string; dateTo: string }>,
): boolean {
  if (nightsBetween(from, to) <= 0) return false;
  for (const b of bookings) {
    const bs = parseISODate(b.dateFrom);
    const be = parseISODate(b.dateTo);
    if (rangesOverlap(from, to, bs, be)) return false;
  }
  return true;
}
