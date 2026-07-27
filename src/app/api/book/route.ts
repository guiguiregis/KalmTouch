import { NextResponse } from "next/server";
import { bookAppointment, BookingError } from "@/lib/calendar/book";
import { isCalendarConfigured } from "@/lib/calendar/client";
import type { BookingMode } from "@/lib/calendar/config";

type BookBody = {
  mode?: BookingMode;
  serviceId?: string;
  start?: string;
  name?: string;
  email?: string;
  address?: string;
  phone?: string;
  notes?: string;
};

export async function POST(request: Request) {
  if (!isCalendarConfigured()) {
    return NextResponse.json(
      {
        error:
          "Google Calendar is not configured. Add credentials to .env.local and run npm run calendar:auth.",
      },
      { status: 503 },
    );
  }

  let body: BookBody;
  try {
    body = (await request.json()) as BookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const result = await bookAppointment({
      mode: body.mode === "on-demand" ? "on-demand" : "regular",
      serviceId: body.serviceId ?? "",
      start: body.start ?? "",
      name: body.name ?? "",
      email: body.email ?? "",
      address: body.address ?? "",
      phone: body.phone ?? "",
      notes: body.notes,
    });

    return NextResponse.json({ ok: true, booking: result });
  } catch (error) {
    if (error instanceof BookingError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("book error", error);
    return NextResponse.json(
      { error: "Could not create the calendar event." },
      { status: 502 },
    );
  }
}
