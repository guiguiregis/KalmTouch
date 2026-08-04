import { formatHumanDateTime } from "@/lib/calendar/time";
import { sendPdfEmail } from "@/lib/email/send";
import { SITE } from "@/lib/site";
import type { ParsedIntake } from "./schema";

export async function sendIntakeCopyToClient(input: {
  intake: ParsedIntake;
  filename: string;
  pdf: Buffer;
}): Promise<void> {
  const { intake, filename, pdf } = input;
  const locale = intake.locale ?? "en";
  const appointment = intake.appointmentStart
    ? formatHumanDateTime(intake.appointmentStart, locale)
    : null;

  if (locale === "fr") {
    await sendPdfEmail({
      to: intake.email,
      subject: `[KalmTouch] Copie de votre fiche santé`,
      text: [
        `Bonjour ${intake.name},`,
        ``,
        `Voici une copie de la fiche santé associée à votre réservation KalmTouch.`,
        intake.serviceName ? `Service : ${intake.serviceName}` : null,
        appointment ? `Rendez-vous : ${appointment}` : null,
        ``,
        `Le PDF est joint à ce courriel.`,
        ``,
        `KalmTouch Massage`,
        SITE.email,
        SITE.phoneDisplay,
      ]
        .filter((line) => line !== null)
        .join("\n"),
      filename,
      pdf,
    });
    return;
  }

  await sendPdfEmail({
    to: intake.email,
    subject: `[KalmTouch] Copy of your health intake`,
    text: [
      `Hi ${intake.name},`,
      ``,
      `Here is a copy of the health intake form linked to your KalmTouch booking.`,
      intake.serviceName ? `Service: ${intake.serviceName}` : null,
      appointment ? `Appointment: ${appointment}` : null,
      ``,
      `The PDF is attached to this email.`,
      ``,
      `KalmTouch Massage`,
      SITE.email,
      SITE.phoneDisplay,
    ]
      .filter((line) => line !== null)
      .join("\n"),
    filename,
    pdf,
  });
}
