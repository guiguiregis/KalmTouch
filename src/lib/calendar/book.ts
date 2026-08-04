import {
  BOOKING_TIMEZONE,
  type BookingMode,
  getServiceById,
  ON_DEMAND_WEEKDAYS,
  REGULAR_WEEKDAYS,
  SESSION_MINUTES,
} from "./config";
import { getCalendarClient, getCalendarId } from "./client";
import { isSlotFree } from "./availability";
import { addMinutes, weekdayInZone } from "./time";

export type BookAppointmentInput = {
  mode: BookingMode;
  serviceId: string;
  start: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  notes?: string;
};

export type BookAppointmentResult = {
  eventId: string;
  htmlLink?: string | null;
  start: string;
  end: string;
  serviceName: string;
  mode: BookingMode;
};

export async function bookAppointment(
  input: BookAppointmentInput,
): Promise<BookAppointmentResult> {
  const mode = input.mode === "on-demand" ? "on-demand" : "regular";
  const service = getServiceById(input.serviceId);
  if (!service) {
    throw new BookingError("Unknown service.", 400);
  }

  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const address = input.address.trim();
  const phone = input.phone.trim();
  if (!name || !email || !address || !phone) {
    throw new BookingError(
      "Name, email, address, and phone are required.",
      400,
    );
  }
  if (address.length < 8) {
    throw new BookingError(
      "Enter a full street address in the Ottawa/Gatineau area.",
      400,
    );
  }
  if (phone.replace(/\D/g, "").length < 10) {
    throw new BookingError("Enter a valid phone number.", 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new BookingError("Enter a valid email address.", 400);
  }

  const start = new Date(input.start);
  if (Number.isNaN(start.getTime())) {
    throw new BookingError("Invalid appointment time.", 400);
  }
  if (start.getTime() <= Date.now()) {
    throw new BookingError("That time has already passed.", 400);
  }

  const weekday = weekdayInZone(start);
  if (mode === "regular" && !REGULAR_WEEKDAYS.has(weekday)) {
    throw new BookingError(
      "Confirmed online booking is Mon–Thu only. Use weekend on-demand for Sat–Sun.",
      400,
    );
  }
  if (mode === "on-demand" && !ON_DEMAND_WEEKDAYS.has(weekday)) {
    throw new BookingError(
      "On-demand requests are for Saturday and Sunday (6:30am–9:30pm).",
      400,
    );
  }

  const end = addMinutes(start, SESSION_MINUTES);
  const free = await isSlotFree(start.toISOString(), end.toISOString());
  if (!free) {
    throw new BookingError(
      mode === "on-demand"
        ? "That preferred time looks busy. Please choose another."
        : "That slot was just taken. Please choose another time.",
      409,
    );
  }

  const notes = input.notes?.trim();
  const isRequest = mode === "on-demand";
  const description = [
    isRequest ? "Type: Weekend on-demand request (needs confirmation)" : "Type: Confirmed booking",
    `Service: ${service.name}`,
    `Price: $${service.priceCad} CAD`,
    `Client: ${name}`,
    `Email: ${email}`,
    `Address: ${address}`,
    `Phone: ${phone}`,
    notes ? `Notes: ${notes}` : null,
    "On-site · Ottawa/Gatineau area · Submitted via KalmTouch website",
  ]
    .filter(Boolean)
    .join("\n");

  const cal = getCalendarClient();
  const calendarId = getCalendarId();

  const response = await cal.events.insert({
    calendarId,
    sendUpdates: "all",
    requestBody: {
      summary: isRequest
        ? `Weekend request: ${service.name} — ${name}`
        : `${service.name} — ${name}`,
      description,
      location: address,
      status: isRequest ? "tentative" : "confirmed",
      start: {
        dateTime: start.toISOString(),
        timeZone: BOOKING_TIMEZONE,
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: BOOKING_TIMEZONE,
      },
      attendees: [{ email, displayName: name }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 60 },
        ],
      },
      extendedProperties: {
        private: {
          source: "kalmtouch-web",
          serviceId: service.id,
          mode,
        },
      },
    },
  });

  const eventId = response.data.id;
  if (!eventId) {
    throw new BookingError("Google Calendar did not return an event id.", 502);
  }

  return {
    eventId,
    htmlLink: response.data.htmlLink,
    start: start.toISOString(),
    end: end.toISOString(),
    serviceName: service.name,
    mode,
  };
}

export class BookingError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "BookingError";
    this.status = status;
  }
}
