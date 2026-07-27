import {
  BOOKING_TIMEZONE,
  BOOKING_WINDOW_DAYS,
  ON_DEMAND_SLOT_TIMES,
  ON_DEMAND_WEEKDAYS,
  REGULAR_WEEKDAYS,
  SESSION_MINUTES,
  SLOT_TIMES,
} from "./config";
import { getCalendarClient, getCalendarId } from "./client";
import {
  addMinutes,
  formatDateInZone,
  parseSlotTime,
  rangesOverlap,
  weekdayInZone,
  zonedTimeToUtc,
} from "./time";

export type AvailableSlot = {
  start: string;
  end: string;
  date: string;
  time: string;
  label: string;
};

type BusyPeriod = { start: Date; end: Date };

function buildCandidateSlots(
  from: Date,
  days: number,
  weekdays: Set<number>,
  times: readonly string[],
): AvailableSlot[] {
  const slots: AvailableSlot[] = [];
  const today = formatDateInZone(from);
  const [startYear, startMonth, startDay] = today.split("-").map(Number);

  for (let offset = 0; offset < days; offset += 1) {
    const noon = addMinutes(
      zonedTimeToUtc(startYear, startMonth, startDay, 12, 0),
      offset * 24 * 60,
    );
    const dateStr = formatDateInZone(noon);
    const [year, month, day] = dateStr.split("-").map(Number);
    const weekday = weekdayInZone(zonedTimeToUtc(year, month, day, 12, 0));

    if (!weekdays.has(weekday)) continue;

    for (const slot of times) {
      const { hour, minute } = parseSlotTime(slot);
      const start = zonedTimeToUtc(year, month, day, hour, minute);
      if (start <= from) continue;

      const end = addMinutes(start, SESSION_MINUTES);
      const timeLabel = new Intl.DateTimeFormat("en-US", {
        timeZone: BOOKING_TIMEZONE,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(start);

      const dateLabel = new Intl.DateTimeFormat("en-US", {
        timeZone: BOOKING_TIMEZONE,
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(start);

      slots.push({
        start: start.toISOString(),
        end: end.toISOString(),
        date: dateStr,
        time: slot,
        label: `${dateLabel} · ${timeLabel}`,
      });
    }
  }

  return slots;
}

async function fetchBusyPeriods(
  timeMin: Date,
  timeMax: Date,
): Promise<BusyPeriod[]> {
  const cal = getCalendarClient();
  const calendarId = getCalendarId();

  const response = await cal.freebusy.query({
    requestBody: {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      timeZone: BOOKING_TIMEZONE,
      items: [{ id: calendarId }],
    },
  });

  const busy = response.data.calendars?.[calendarId]?.busy ?? [];
  return busy
    .filter((period): period is { start: string; end: string } =>
      Boolean(period.start && period.end),
    )
    .map((period) => ({
      start: new Date(period.start),
      end: new Date(period.end),
    }));
}

/** Mon–Thu confirmed booking slots (busy calendar filtered). */
export async function getAvailableSlots(
  days: number = BOOKING_WINDOW_DAYS,
): Promise<AvailableSlot[]> {
  const now = new Date();
  const candidates = buildCandidateSlots(
    now,
    days,
    REGULAR_WEEKDAYS,
    SLOT_TIMES,
  );
  if (candidates.length === 0) return [];

  const timeMin = new Date(candidates[0].start);
  const timeMax = new Date(candidates[candidates.length - 1].end);
  const busy = await fetchBusyPeriods(timeMin, timeMax);

  return candidates.filter((slot) => {
    const start = new Date(slot.start);
    const end = new Date(slot.end);
    return !busy.some((period) =>
      rangesOverlap(start, end, period.start, period.end),
    );
  });
}

/**
 * Sat–Sun preferred times for on-demand requests.
 * Still hides times that already look busy, but booking stays tentative.
 */
export async function getOnDemandOptions(
  days: number = BOOKING_WINDOW_DAYS,
): Promise<AvailableSlot[]> {
  const now = new Date();
  const candidates = buildCandidateSlots(
    now,
    days,
    ON_DEMAND_WEEKDAYS,
    ON_DEMAND_SLOT_TIMES,
  );
  if (candidates.length === 0) return [];

  const timeMin = new Date(candidates[0].start);
  const timeMax = new Date(candidates[candidates.length - 1].end);
  const busy = await fetchBusyPeriods(timeMin, timeMax);

  return candidates.filter((slot) => {
    const start = new Date(slot.start);
    const end = new Date(slot.end);
    return !busy.some((period) =>
      rangesOverlap(start, end, period.start, period.end),
    );
  });
}

export async function isSlotFree(
  startIso: string,
  endIso: string,
): Promise<boolean> {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const busy = await fetchBusyPeriods(start, end);
  return !busy.some((period) =>
    rangesOverlap(start, end, period.start, period.end),
  );
}
