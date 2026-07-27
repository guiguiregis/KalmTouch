import { NextResponse } from "next/server";
import {
  ContactError,
  isEmailConfigured,
  sendContactEmail,
} from "@/lib/email/send";

type ContactBody = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export async function POST(request: Request) {
  if (!isEmailConfigured()) {
    return NextResponse.json(
      {
        error:
          "Email is not configured. Add Google credentials to .env.local, enable Gmail API, and run npm run google:auth.",
      },
      { status: 503 },
    );
  }

  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    await sendContactEmail({
      name: body.name ?? "",
      email: body.email ?? "",
      subject: body.subject ?? "",
      message: body.message ?? "",
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ContactError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("contact email error", error);
    return NextResponse.json(
      { error: "Could not send your message. Please try again or call us." },
      { status: 502 },
    );
  }
}
