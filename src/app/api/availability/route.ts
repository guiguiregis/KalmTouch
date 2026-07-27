import { NextResponse } from "next/server";
import {
  getAvailableSlots,
  getOnDemandOptions,
} from "@/lib/calendar/availability";
import { isCalendarConfigured } from "@/lib/calendar/client";

export async function GET() {
  if (!isCalendarConfigured()) {
    return NextResponse.json(
      {
        error:
          "Google Calendar is not configured. Add credentials to .env.local and run npm run calendar:auth.",
        configured: false,
        slots: [],
        onDemand: [],
      },
      { status: 503 },
    );
  }

  try {
    const [slots, onDemand] = await Promise.all([
      getAvailableSlots(),
      getOnDemandOptions(),
    ]);
    return NextResponse.json({ configured: true, slots, onDemand });
  } catch (error) {
    console.error("availability error", error);
    return NextResponse.json(
      {
        error: "Could not load availability from Google Calendar.",
        configured: true,
        slots: [],
        onDemand: [],
      },
      { status: 502 },
    );
  }
}
