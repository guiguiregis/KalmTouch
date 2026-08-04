export const BOOKING_TIMEZONE = "America/Toronto";

/** Fixed evening slots (local time) for Mon–Thu confirmed bookings. */
export const SLOT_TIMES = ["18:30", "20:00", "21:30"] as const;

/** Session length in minutes. */
export const SESSION_MINUTES = 60;

/** How far ahead clients can book or request. */
export const BOOKING_WINDOW_DAYS = 42;

/** 0 = Sun … 6 = Sat — instant booking. */
export const REGULAR_WEEKDAYS = new Set([1, 2, 3, 4]);

/** Sat–Sun — on-demand (request only). */
export const ON_DEMAND_WEEKDAYS = new Set([0, 6]);

/** Sat–Sun preferred times: 6:30 AM–9:30 PM, every hour. */
export const ON_DEMAND_SLOT_TIMES = buildHourlySlots("06:30", "21:30");

function buildHourlySlots(from: string, to: string): readonly string[] {
  const [fromH, fromM] = from.split(":").map(Number);
  const [toH, toM] = to.split(":").map(Number);
  const start = fromH * 60 + fromM;
  const end = toH * 60 + toM;
  const times: string[] = [];

  for (let minutes = start; minutes <= end; minutes += 60) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    times.push(
      `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    );
  }

  return times;
}

export type BookingMode = "regular" | "on-demand";

export const BOOKING_SERVICES = [
  {
    id: "swedish",
    name: "Swedish Massage",
    duration: SESSION_MINUTES,
    priceCad: 100,
    description:
      "Long, flowing strokes to ease everyday tension and quiet the nervous system.",
  },
  {
    id: "deep-tissue",
    name: "Deep Tissue",
    duration: SESSION_MINUTES,
    priceCad: 120,
    description:
      "Slower pressure for stubborn knots, posture strain, and lasting tightness.",
  },
] as const;

export type BookingServiceId = (typeof BOOKING_SERVICES)[number]["id"];

export function getServiceById(id: string) {
  return BOOKING_SERVICES.find((service) => service.id === id);
}
