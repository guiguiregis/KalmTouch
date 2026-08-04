import { Readable } from "node:stream";
import { drive } from "@googleapis/drive";
import { getOAuth2Client, isGoogleConfigured } from "@/lib/google/auth";

export function isDriveConfigured(): boolean {
  return (
    isGoogleConfigured() &&
    Boolean(process.env.GOOGLE_DRIVE_INTAKE_FOLDER_ID?.trim())
  );
}

export function getDriveIntakeFolderId(): string {
  const folderId = process.env.GOOGLE_DRIVE_INTAKE_FOLDER_ID?.trim();
  if (!folderId) {
    throw new Error(
      "Missing GOOGLE_DRIVE_INTAKE_FOLDER_ID. Create a Drive folder and paste its ID into .env.local.",
    );
  }
  return folderId;
}

export function getDriveClient() {
  return drive({ version: "v3", auth: getOAuth2Client() });
}

export type UploadedPdf = {
  fileId: string;
  webViewLink: string;
};

export async function uploadPdfToDrive(input: {
  filename: string;
  buffer: Buffer;
}): Promise<UploadedPdf> {
  const client = getDriveClient();
  const folderId = getDriveIntakeFolderId();

  const response = await client.files.create({
    requestBody: {
      name: input.filename,
      parents: [folderId],
      mimeType: "application/pdf",
    },
    media: {
      mimeType: "application/pdf",
      body: Readable.from(input.buffer),
    },
    fields: "id, webViewLink",
  });

  const fileId = response.data.id;
  if (!fileId) {
    throw new Error("Google Drive did not return a file id.");
  }

  let webViewLink = response.data.webViewLink ?? "";
  if (!webViewLink) {
    webViewLink = `https://drive.google.com/file/d/${fileId}/view`;
  }

  return { fileId, webViewLink };
}
