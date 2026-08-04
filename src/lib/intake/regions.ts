export type BodyIntent = "focus" | "avoid";

/** Muscle ids from vue-muscle-group-selector / Ryan M. Poe diagram. */
export type BodyRegionSelection = {
  regionId: string;
  intent: BodyIntent;
};

export type BodyRegionDef = {
  id: string;
  labelEn: string;
  labelFr: string;
};

/** Shared catalogue for UI, validation, and PDF legend. */
export const BODY_REGIONS: BodyRegionDef[] = [
  { id: "biceps", labelEn: "Biceps", labelFr: "Biceps" },
  { id: "deltoids", labelEn: "Deltoids", labelFr: "Deltoïdes" },
  { id: "forearms", labelEn: "Forearms", labelFr: "Avant-bras" },
  { id: "triceps", labelEn: "Triceps", labelFr: "Triceps" },
  { id: "trapezius", labelEn: "Trapezius", labelFr: "Trapèzes" },
  { id: "lats", labelEn: "Lats", labelFr: "Dorsaux" },
  { id: "abs", labelEn: "Abs", labelFr: "Abdominaux" },
  { id: "obliques", labelEn: "Obliques", labelFr: "Obliques" },
  { id: "pectorals", labelEn: "Pectorals", labelFr: "Pectoraux" },
  { id: "adductors", labelEn: "Adductors", labelFr: "Adducteurs" },
  { id: "calves", labelEn: "Calves", labelFr: "Mollets" },
  { id: "hamstrings", labelEn: "Hamstrings", labelFr: "Ischio-jambiers" },
  { id: "glutes", labelEn: "Glutes", labelFr: "Fessiers" },
  { id: "quads", labelEn: "Quads", labelFr: "Quadriceps" },
];

const REGION_IDS = new Set(BODY_REGIONS.map((region) => region.id));

export function isKnownRegionId(regionId: string): boolean {
  return REGION_IDS.has(regionId);
}

export function getRegionLabel(
  regionId: string,
  locale: "en" | "fr" = "en",
): string {
  const region = BODY_REGIONS.find((item) => item.id === regionId);
  if (!region) return regionId;
  return locale === "fr" ? region.labelFr : region.labelEn;
}

export function muscleTranslations(locale: "en" | "fr") {
  if (locale === "fr") {
    return {
      arms: {
        arms: "Bras",
        bicpes: "Biceps",
        deltoids: "Deltoïdes",
        forearms: "Avant-bras",
        triceps: "Triceps",
      },
      back: {
        back: "Dos",
        trapezius: "Trapèzes",
        lats: "Dorsaux",
      },
      core: {
        core: "Centre",
        abs: "Abdominaux",
        obliques: "Obliques",
        pectorals: "Pectoraux",
      },
      legs: {
        legs: "Jambes",
        adductors: "Adducteurs",
        calves: "Mollets",
        hamstrings: "Ischio-jambiers",
        glutes: "Fessiers",
        quads: "Quadriceps",
      },
    };
  }

  return {
    arms: {
      arms: "Arms",
      bicpes: "Biceps",
      deltoids: "Deltoids",
      forearms: "Forearms",
      triceps: "Triceps",
    },
    back: {
      back: "Back",
      trapezius: "Trapezius",
      lats: "Lats",
    },
    core: {
      core: "Core",
      abs: "Abs",
      obliques: "Obliques",
      pectorals: "Pectorals",
    },
    legs: {
      legs: "Legs",
      adductors: "Adductors",
      calves: "Calves",
      hamstrings: "Hamstrings",
      glutes: "Glutes",
      quads: "Quads",
    },
  };
}
