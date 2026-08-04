import {
  isKnownRegionId,
  type BodyIntent,
  type BodyRegionSelection,
} from "./regions";

const MAX_TEXT = 2000;
const MAX_SHORT = 200;

export const PRESSURE_OPTIONS = ["light", "medium", "firm"] as const;
export type PressureOption = (typeof PRESSURE_OPTIONS)[number];

export const CONTRAINDICATION_IDS = [
  "highBloodPressure",
  "bloodClot",
  "skinInfection",
  "fever",
  "cancerTreatment",
] as const;

export type ContraindicationId = (typeof CONTRAINDICATION_IDS)[number];

export type IntakeFormFields = {
  preferredPressure: string;
  painPoints: string;
  nerveSymptoms: string;
  healthIssues: string;
  allergies: string;
  scentTolerance: string;
  occupation: string;
  sports: string;
  recentInjury: string;
  recentInjuryDetails: string;
  recentSurgery: string;
  surgeryDetails: string;
  pregnancy: string;
  pregnancyDuration: string;
  recentMassage: string;
  recentMassageWhen: string;
  recentMassageAreas: string;
  medication: string;
  contraindications: ContraindicationId[];
  drapingPreferences: string;
  homeAccess: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  other: string;
  informedConsent: boolean;
};

export type IntakePayload = IntakeFormFields & {
  eventId: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  serviceName?: string;
  appointmentStart?: string;
  locale?: "en" | "fr";
  bodyRegions: BodyRegionSelection[];
  /** PNG data URL of the colored muscle schematic (optional). */
  bodyMapImage?: string;
  skipped?: boolean;
};

export type ParsedIntake = IntakePayload & {
  formStatus: "filled" | "empty";
};

const MAX_BODY_MAP_IMAGE = 1_500_000;
const CONTRAINDICATION_SET = new Set<string>(CONTRAINDICATION_IDS);

function parseBodyMapImage(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed.startsWith("data:image/png;base64,")) return undefined;
  if (trimmed.length > MAX_BODY_MAP_IMAGE) return undefined;
  return trimmed;
}

export class IntakeError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "IntakeError";
    this.status = status;
  }
}

function asString(value: unknown, max = MAX_TEXT): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function parsePressure(value: unknown): string {
  const pressure = asString(value, 16);
  return PRESSURE_OPTIONS.includes(pressure as PressureOption) ? pressure : "";
}

function parseContraindications(value: unknown): ContraindicationId[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<ContraindicationId>();
  for (const item of value) {
    const id = asString(item, 40);
    if (CONTRAINDICATION_SET.has(id)) {
      seen.add(id as ContraindicationId);
    }
  }
  return [...seen];
}

function parseBodyRegions(value: unknown): BodyRegionSelection[] {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const regions: BodyRegionSelection[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const regionId = asString(record.regionId, 80);
    const intent = asString(record.intent, 16) as BodyIntent;

    if (!isKnownRegionId(regionId)) continue;
    if (intent !== "focus" && intent !== "avoid") continue;

    const key = `${regionId}:${intent}`;
    if (seen.has(key)) continue;
    seen.add(key);
    regions.push({ regionId, intent });
  }

  return regions.slice(0, 64);
}

function hasAnyContent(
  fields: IntakeFormFields,
  regions: BodyRegionSelection[],
) {
  if (regions.length > 0) return true;
  if (fields.contraindications.length > 0) return true;
  if (fields.preferredPressure) return true;
  if (fields.informedConsent) return true;

  const {
    contraindications: _c,
    informedConsent: _i,
    preferredPressure: _p,
    ...textFields
  } = fields;

  return Object.values(textFields).some((value) => value.length > 0);
}

export function parseIntakePayload(body: unknown): ParsedIntake {
  if (!body || typeof body !== "object") {
    throw new IntakeError("Invalid JSON body.", 400);
  }

  const raw = body as Record<string, unknown>;
  const eventId = asString(raw.eventId, 128);
  const name = asString(raw.name, MAX_SHORT);
  const email = asString(raw.email, MAX_SHORT).toLowerCase();
  const address = asString(raw.address, 500);
  const phone = asString(raw.phone, MAX_SHORT);

  if (!eventId) {
    throw new IntakeError("Missing booking event id.", 400);
  }
  if (!name || !email || !address || !phone) {
    throw new IntakeError(
      "Name, email, address, and phone are required.",
      400,
    );
  }

  const fields: IntakeFormFields = {
    preferredPressure: parsePressure(raw.preferredPressure),
    painPoints: asString(raw.painPoints),
    nerveSymptoms: asString(raw.nerveSymptoms),
    healthIssues: asString(raw.healthIssues),
    allergies: asString(raw.allergies),
    scentTolerance: asString(raw.scentTolerance),
    occupation: asString(raw.occupation, MAX_SHORT),
    sports: asString(raw.sports, MAX_SHORT),
    recentInjury: asString(raw.recentInjury, MAX_SHORT),
    recentInjuryDetails: asString(raw.recentInjuryDetails),
    recentSurgery: asString(raw.recentSurgery, MAX_SHORT),
    surgeryDetails: asString(raw.surgeryDetails),
    pregnancy: asString(raw.pregnancy, MAX_SHORT),
    pregnancyDuration: asString(raw.pregnancyDuration, MAX_SHORT),
    recentMassage: asString(raw.recentMassage, MAX_SHORT),
    recentMassageWhen: asString(raw.recentMassageWhen, MAX_SHORT),
    recentMassageAreas: asString(raw.recentMassageAreas),
    medication: asString(raw.medication),
    contraindications: parseContraindications(raw.contraindications),
    drapingPreferences: asString(raw.drapingPreferences),
    homeAccess: asString(raw.homeAccess),
    emergencyContactName: asString(raw.emergencyContactName, MAX_SHORT),
    emergencyContactPhone: asString(raw.emergencyContactPhone, MAX_SHORT),
    other: asString(raw.other),
    informedConsent: raw.informedConsent === true,
  };

  const bodyRegions = parseBodyRegions(raw.bodyRegions);
  const skipped = raw.skipped === true;
  const formStatus =
    skipped || !hasAnyContent(fields, bodyRegions) ? "empty" : "filled";

  if (!skipped && formStatus === "filled" && !fields.informedConsent) {
    throw new IntakeError(
      "Please confirm the informed consent checkbox before submitting.",
      400,
    );
  }

  const locale = raw.locale === "fr" ? "fr" : "en";
  const bodyMapImage = parseBodyMapImage(raw.bodyMapImage);

  return {
    eventId,
    name,
    email,
    address,
    phone,
    serviceName: asString(raw.serviceName, MAX_SHORT) || undefined,
    appointmentStart: asString(raw.appointmentStart, 64) || undefined,
    locale,
    bodyRegions,
    bodyMapImage,
    skipped,
    formStatus,
    ...fields,
  };
}
