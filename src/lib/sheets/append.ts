import { sheets } from "@googleapis/sheets";
import { getOAuth2Client, isGoogleConfigured } from "@/lib/google/auth";

export function isSheetsConfigured(): boolean {
  return (
    isGoogleConfigured() &&
    Boolean(process.env.GOOGLE_SHEETS_CLIENTS_ID?.trim())
  );
}

export function getSheetsClientsId(): string {
  const id = process.env.GOOGLE_SHEETS_CLIENTS_ID?.trim();
  if (!id) {
    throw new Error(
      "Missing GOOGLE_SHEETS_CLIENTS_ID. Create a Google Sheet and paste its ID into .env.local.",
    );
  }
  return id;
}

export function getSheetsRange(): string {
  return process.env.GOOGLE_SHEETS_RANGE?.trim() || "Clients!A:H";
}

export function getSheetsClient() {
  return sheets({ version: "v4", auth: getOAuth2Client() });
}

export type ClientSheetRow = {
  submittedAt: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  eventId: string;
  driveLink: string;
  formStatus: "filled" | "empty";
};

export async function appendClientRow(row: ClientSheetRow): Promise<void> {
  const client = getSheetsClient();
  const spreadsheetId = getSheetsClientsId();
  const range = getSheetsRange();

  await client.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          row.submittedAt,
          row.name,
          row.phone,
          row.address,
          row.email,
          row.eventId,
          row.driveLink,
          row.formStatus,
        ],
      ],
    },
  });
}
