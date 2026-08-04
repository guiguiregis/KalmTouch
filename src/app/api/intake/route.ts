import { NextResponse } from "next/server";
import { isIntakeConfigured, submitIntake } from "@/lib/intake/submit";
import { IntakeError, parseIntakePayload } from "@/lib/intake/schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isIntakeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Health intake storage is not configured. Add GOOGLE_DRIVE_INTAKE_FOLDER_ID and GOOGLE_SHEETS_CLIENTS_ID, enable Drive + Sheets APIs, then run npm run google:auth.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const intake = parseIntakePayload(body);
    const result = await submitIntake(intake);
    return NextResponse.json({ ok: true, intake: result });
  } catch (error) {
    if (error instanceof IntakeError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("intake error", error);
    return NextResponse.json(
      {
        error:
          "Your booking is saved, but we could not store the health form. Please contact the studio.",
      },
      { status: 502 },
    );
  }
}
