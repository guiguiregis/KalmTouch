import { gmail } from "@googleapis/gmail";
import { getOAuth2Client, isGoogleConfigured } from "@/lib/google/auth";

export type ContactMessageInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function isEmailConfigured(): boolean {
  return isGoogleConfigured();
}

function getContactToEmail(): string {
  return (
    process.env.CONTACT_TO_EMAIL?.trim() ||
    process.env.GOOGLE_SENDER_EMAIL?.trim() ||
    "kalmtouch18@gmail.com"
  );
}

function encodeSubject(subject: string): string {
  // RFC 2047 for non-ASCII subjects
  if (/^[\x20-\x7E]*$/.test(subject)) return subject;
  return `=?UTF-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`;
}

function buildRawMessage(input: {
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  text: string;
}): string {
  const lines = [
    `To: ${input.to}`,
    `From: ${input.from}`,
    `Reply-To: ${input.replyTo}`,
    `Subject: ${encodeSubject(input.subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 7bit",
    "",
    input.text,
  ];

  return Buffer.from(lines.join("\r\n"), "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function sendContactEmail(
  input: ContactMessageInput,
): Promise<void> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const subject = input.subject.trim();
  const message = input.message.trim();

  if (!name || !email || !subject || !message) {
    throw new ContactError("Name, email, subject, and message are required.", 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ContactError("Enter a valid email address.", 400);
  }
  if (subject.length > 200) {
    throw new ContactError("Subject is too long.", 400);
  }
  if (message.length > 5000) {
    throw new ContactError("Message is too long.", 400);
  }

  const to = getContactToEmail();
  const from = process.env.GOOGLE_SENDER_EMAIL?.trim() || to;
  const text = [
    `New message from the KalmTouch website`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    ``,
    message,
  ].join("\n");

  const client = gmail({ version: "v1", auth: getOAuth2Client() });
  await client.users.messages.send({
    userId: "me",
    requestBody: {
      raw: buildRawMessage({
        to,
        from,
        replyTo: `${name} <${email}>`,
        subject: `[KalmTouch] ${subject}`,
        text,
      }),
    },
  });
}

export class ContactError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ContactError";
    this.status = status;
  }
}
