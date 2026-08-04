import { join } from "node:path";
import PDFDocument from "pdfkit";
import { formatHumanDateTime } from "@/lib/calendar/time";
import { SITE } from "@/lib/site";
import { getRegionLabel, type BodyRegionSelection } from "./regions";
import type { ContraindicationId, ParsedIntake } from "./schema";

function pressureLabel(value: string, locale: "en" | "fr"): string {
  const labels: Record<string, { en: string; fr: string }> = {
    light: { en: "Light", fr: "Légère" },
    medium: { en: "Medium", fr: "Moyenne" },
    firm: { en: "Firm", fr: "Ferme" },
  };
  return labels[value]?.[locale] ?? value;
}

function contraindicationLabel(
  id: ContraindicationId,
  locale: "en" | "fr",
): string {
  const labels: Record<ContraindicationId, { en: string; fr: string }> = {
    highBloodPressure: {
      en: "High blood pressure",
      fr: "Tension artérielle élevée",
    },
    bloodClot: { en: "Blood clot / phlebitis", fr: "Caillot / phlébite" },
    skinInfection: {
      en: "Skin infection or open wound",
      fr: "Infection cutanée ou plaie ouverte",
    },
    fever: {
      en: "Fever or contagious illness",
      fr: "Fièvre ou maladie contagieuse",
    },
    cancerTreatment: {
      en: "Cancer treatment (current)",
      fr: "Traitement du cancer (en cours)",
    },
  };
  return labels[id][locale];
}

const LOGO_PATH = join(process.cwd(), "public/images/kalm-touch-logo.png");
const LOGO_SIZE = 56;

function field(
  doc: PDFKit.PDFDocument,
  label: string,
  value: string,
  emptyLabel: string,
) {
  doc.font("Helvetica-Bold").fontSize(10).fillColor("#1c1917").text(label);
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#44403c")
    .text(value.trim() ? value : emptyLabel, { width: 480 });
  doc.moveDown(0.6);
}

function writeBodySelections(
  doc: PDFKit.PDFDocument,
  regions: BodyRegionSelection[],
  locale: "en" | "fr",
) {
  const focusLabels = regions
    .filter((r) => r.intent === "focus")
    .map((r) => getRegionLabel(r.regionId, locale));
  const avoidLabels = regions
    .filter((r) => r.intent === "avoid")
    .map((r) => getRegionLabel(r.regionId, locale));

  field(
    doc,
    locale === "fr" ? "Muscles à insister" : "Focus muscles",
    focusLabels.join(", "),
    locale === "fr" ? "Aucun" : "None",
  );
  field(
    doc,
    locale === "fr" ? "Muscles à éviter" : "Muscles to avoid",
    avoidLabels.join(", "),
    locale === "fr" ? "Aucun" : "None",
  );
}

export async function generateIntakePdf(
  intake: ParsedIntake,
): Promise<Buffer> {
  const locale = intake.locale ?? "en";
  const empty = locale === "fr" ? "Non renseigné" : "Not provided";
  const title =
    locale === "fr"
      ? "Fiche santé — séance de massage"
      : "Health intake — massage session";

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "LETTER" });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const headerTop = doc.y;
    try {
      doc.image(LOGO_PATH, 50, headerTop, {
        width: LOGO_SIZE,
        height: LOGO_SIZE,
      });
    } catch {
      // Fall back to text-only header if the logo file is unavailable.
    }

    const textX = 50 + LOGO_SIZE + 14;
    doc
      .font("Helvetica-Bold")
      .fontSize(18)
      .fillColor("#1c1917")
      .text(SITE.name, textX, headerTop + 10, { width: 420 });
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#78716c")
      .text(title, textX, headerTop + 34, { width: 420 });
    doc.y = Math.max(doc.y, headerTop + LOGO_SIZE) + 16;

    field(doc, locale === "fr" ? "Client" : "Client", intake.name, empty);
    field(doc, "Email", intake.email, empty);
    field(doc, locale === "fr" ? "Téléphone" : "Phone", intake.phone, empty);
    field(doc, locale === "fr" ? "Adresse" : "Address", intake.address, empty);
    field(
      doc,
      locale === "fr" ? "Soumis le" : "Submitted",
      formatHumanDateTime(new Date(), locale),
      empty,
    );
    if (intake.serviceName) {
      field(
        doc,
        locale === "fr" ? "Service" : "Service",
        intake.serviceName,
        empty,
      );
    }
    if (intake.appointmentStart) {
      field(
        doc,
        locale === "fr" ? "Rendez-vous" : "Appointment",
        formatHumanDateTime(intake.appointmentStart, locale),
        empty,
      );
    }
    field(
      doc,
      locale === "fr" ? "Statut du formulaire" : "Form status",
      intake.formStatus === "empty"
        ? locale === "fr"
          ? "Non rempli / passé"
          : "Empty / skipped"
        : locale === "fr"
          ? "Rempli"
          : "Filled",
      empty,
    );

    doc.moveDown(0.4);
    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .fillColor("#1c1917")
      .text(locale === "fr" ? "Groupes musculaires" : "Muscle groups");
    doc.moveDown(0.4);
    writeBodySelections(doc, intake.bodyRegions, locale);

    if (intake.bodyMapImage) {
      try {
        const base64 = intake.bodyMapImage.replace(
          /^data:image\/png;base64,/,
          "",
        );
        const imageBuffer = Buffer.from(base64, "base64");
        if (doc.y > 420) doc.addPage();
        doc.moveDown(0.3);
        doc.image(imageBuffer, {
          fit: [480, 360],
          align: "center",
        });
        doc.moveDown(0.6);
        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor("#78716c")
          .text(
            locale === "fr"
              ? "Ambre = insister · Bleu = éviter"
              : "Amber = focus · Blue = avoid",
            { align: "center" },
          );
        doc.moveDown(0.8);
      } catch {
        // Keep the text legend if the schematic image cannot be embedded.
      }
    }

    if (doc.y > 640) doc.addPage();

    field(
      doc,
      locale === "fr" ? "Pression préférée" : "Preferred pressure",
      pressureLabel(intake.preferredPressure, locale),
      empty,
    );
    field(
      doc,
      locale === "fr" ? "Points de douleur" : "Pain points",
      intake.painPoints,
      empty,
    );
    field(
      doc,
      locale === "fr"
        ? "Douleur, engourdissement ou picotements"
        : "Pain, numbness, or tingling",
      intake.nerveSymptoms,
      empty,
    );
    field(
      doc,
      locale === "fr" ? "Problèmes de santé" : "Health concerns",
      intake.healthIssues,
      empty,
    );
    field(
      doc,
      locale === "fr" ? "Allergies" : "Allergies",
      intake.allergies,
      empty,
    );
    field(
      doc,
      locale === "fr" ? "Tolérance aux odeurs" : "Scent tolerance",
      intake.scentTolerance,
      empty,
    );
    field(
      doc,
      locale === "fr" ? "Occupation" : "Occupation",
      intake.occupation,
      empty,
    );
    field(
      doc,
      locale === "fr" ? "Sport pratiqué" : "Sports / activity",
      intake.sports,
      empty,
    );
    field(
      doc,
      locale === "fr" ? "Blessure ou accident récent" : "Recent injury/accident",
      intake.recentInjury,
      empty,
    );
    field(
      doc,
      locale === "fr" ? "Détails de la blessure" : "Injury details",
      intake.recentInjuryDetails,
      empty,
    );
    field(
      doc,
      locale === "fr" ? "Chirurgie récente" : "Recent surgery",
      intake.recentSurgery,
      empty,
    );
    field(
      doc,
      locale === "fr" ? "Détails chirurgie" : "Surgery details",
      intake.surgeryDetails,
      empty,
    );
    field(
      doc,
      locale === "fr" ? "Grossesse" : "Pregnancy",
      intake.pregnancy,
      empty,
    );
    field(
      doc,
      locale === "fr" ? "Durée de grossesse" : "Pregnancy duration",
      intake.pregnancyDuration,
      empty,
    );
    field(
      doc,
      locale === "fr" ? "Massage récent" : "Recent massage",
      intake.recentMassage,
      empty,
    );
    field(
      doc,
      locale === "fr" ? "Quand" : "When",
      intake.recentMassageWhen,
      empty,
    );
    field(
      doc,
      locale === "fr" ? "Parties du corps" : "Body areas",
      intake.recentMassageAreas,
      empty,
    );
    field(
      doc,
      locale === "fr" ? "Médication" : "Medication",
      intake.medication,
      empty,
    );
    field(
      doc,
      locale === "fr" ? "Contre-indications" : "Contraindications",
      intake.contraindications
        .map((id) => contraindicationLabel(id, locale))
        .join(", "),
      empty,
    );
    field(
      doc,
      locale === "fr" ? "Préférences de drapage" : "Draping preferences",
      intake.drapingPreferences,
      empty,
    );
    field(
      doc,
      locale === "fr" ? "Accès au domicile" : "Home access",
      intake.homeAccess,
      empty,
    );
    field(
      doc,
      locale === "fr" ? "Contact d’urgence — nom" : "Emergency contact name",
      intake.emergencyContactName,
      empty,
    );
    field(
      doc,
      locale === "fr"
        ? "Contact d’urgence — téléphone"
        : "Emergency contact phone",
      intake.emergencyContactPhone,
      empty,
    );
    field(
      doc,
      locale === "fr" ? "Autre" : "Other notes",
      intake.other,
      empty,
    );
    field(
      doc,
      locale === "fr" ? "Consentement éclairé" : "Informed consent",
      intake.informedConsent
        ? locale === "fr"
          ? "Accepté"
          : "Accepted"
        : locale === "fr"
          ? "Non fourni"
          : "Not provided",
      empty,
    );

    doc.moveDown(1);
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#a8a29e")
      .text(
        locale === "fr"
          ? "Document généré automatiquement via kalmtouch.ca — à usage interne du studio."
          : "Generated automatically via kalmtouch.ca — for studio use only.",
      );

    doc.end();
  });
}

export function intakePdfFilename(intake: ParsedIntake): string {
  const safeName = intake.name
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 40)
    .toLowerCase();
  const stamp = new Date().toISOString().slice(0, 10);
  return `intake-${safeName || "client"}-${stamp}-${intake.eventId.slice(0, 8)}.pdf`;
}
