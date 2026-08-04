import { BOOKING_TIMEZONE } from "./config";

/** Convert a wall-clock date/time in `timeZone` to a UTC Date. */
export function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string = BOOKING_TIMEZONE,
): Date {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0);
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = Object.fromEntries(
    dtf
      .formatToParts(new Date(utcGuess))
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  ) as Record<string, string>;

  const asLocalMs = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    parts.hour === "24" ? 0 : Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );

  return new Date(utcGuess - (asLocalMs - utcGuess));
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

/** YYYY-MM-DD for a UTC instant as seen in `timeZone`. */
export function formatDateInZone(
  date: Date,
  timeZone: string = BOOKING_TIMEZONE,
): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function formatTimeInZone(
  date: Date,
  timeZone: string = BOOKING_TIMEZONE,
): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/** Human-readable date + time in the booking timezone, e.g. "Aug 3, 2026, 6:30 PM". */
export function formatHumanDateTime(
  date: Date | string,
  locale: "en" | "fr" = "en",
  timeZone: string = BOOKING_TIMEZONE,
): string {
  const value = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(value.getTime())) {
    return typeof date === "string" ? date : "";
  }

  return new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-US", {
    timeZone,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(value);
}

export function weekdayInZone(
  date: Date,
  timeZone: string = BOOKING_TIMEZONE,
): number {
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
  }).format(date);

  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return map[day] ?? date.getUTCDay();
}

export function parseSlotTime(slot: string): { hour: number; minute: number } {
  const [hour, minute] = slot.split(":").map(Number);
  return { hour, minute };
}

export function rangesOverlap(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date,
): boolean {
  return startA < endB && startB < endA;
}
