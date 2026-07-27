import { calendar, type calendar_v3 } from "@googleapis/calendar";
import { getOAuth2Client, isGoogleConfigured } from "@/lib/google/auth";

export type CalendarClient = calendar_v3.Calendar;

export function isCalendarConfigured(): boolean {
  return isGoogleConfigured();
}

export function getCalendarId(): string {
  return process.env.GOOGLE_CALENDAR_ID?.trim() || "primary";
}

export function getCalendarClient(): CalendarClient {
  return calendar({ version: "v3", auth: getOAuth2Client() });
}
