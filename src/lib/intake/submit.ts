import { getCalendarClient, getCalendarId } from "@/lib/calendar/client";
import { formatHumanDateTime } from "@/lib/calendar/time";
import { uploadPdfToDrive, isDriveConfigured } from "@/lib/drive/upload";
import { isEmailConfigured } from "@/lib/email/send";
import { appendClientRow, isSheetsConfigured } from "@/lib/sheets/append";
import { sendIntakeCopyToClient } from "./email-copy";
import { generateIntakePdf, intakePdfFilename } from "./pdf";
import { IntakeError, type ParsedIntake } from "./schema";

export function isIntakeConfigured(): boolean {
  return isDriveConfigured() && isSheetsConfigured();
}

async function attachDriveLinkToCalendarEvent(
  eventId: string,
  driveLink: string,
  formStatus: "filled" | "empty",
) {
  const cal = getCalendarClient();
  const calendarId = getCalendarId();

  const existing = await cal.events.get({ calendarId, eventId });
  const description = existing.data.description ?? "";
  const statusLine =
    formStatus === "empty"
      ? "Intake form: empty / skipped"
      : "Intake form: filled";
  const linkLine = `Intake PDF: ${driveLink}`;

  const nextDescription = [description, "", statusLine, linkLine]
    .filter((line, index, arr) => {
      if (index === 0) return true;
      return !(line === "" && arr[index - 1] === "");
    })
    .join("\n")
    .trim();

  await cal.events.patch({
    calendarId,
    eventId,
    requestBody: {
      description: nextDescription,
      extendedProperties: {
        private: {
          ...(existing.data.extendedProperties?.private ?? {}),
          intakeDriveLink: driveLink,
          intakeFormStatus: formStatus,
        },
      },
    },
  });
}

export type IntakeSubmitResult = {
  driveLink: string;
  formStatus: "filled" | "empty";
  emailedCopy: boolean;
};

export async function submitIntake(
  intake: ParsedIntake,
): Promise<IntakeSubmitResult> {
  if (!isIntakeConfigured()) {
    throw new IntakeError(
      "Intake storage is not configured. Add Drive folder and Sheets IDs, then re-run Google auth.",
      503,
    );
  }

  const pdfBuffer = await generateIntakePdf(intake);
  const filename = intakePdfFilename(intake);

  const uploaded = await uploadPdfToDrive({
    filename,
    buffer: pdfBuffer,
  });

  await appendClientRow({
    submittedAt: formatHumanDateTime(new Date(), intake.locale ?? "en"),
    name: intake.name,
    phone: intake.phone,
    address: intake.address,
    email: intake.email,
    eventId: intake.eventId,
    driveLink: uploaded.webViewLink,
    formStatus: intake.formStatus,
  });

  try {
    await attachDriveLinkToCalendarEvent(
      intake.eventId,
      uploaded.webViewLink,
      intake.formStatus,
    );
  } catch (error) {
    console.error("intake calendar patch failed", error);
  }

  let emailedCopy = false;
  if (isEmailConfigured()) {
    try {
      await sendIntakeCopyToClient({
        intake,
        filename,
        pdf: pdfBuffer,
      });
      emailedCopy = true;
    } catch (error) {
      console.error("intake client copy email failed", error);
    }
  }

  return {
    driveLink: uploaded.webViewLink,
    formStatus: intake.formStatus,
    emailedCopy,
  };
}
