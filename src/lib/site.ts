function formatContactPhone(raw: string | undefined) {
  const digits = (raw ?? "").replace(/\D/g, "");
  const national =
    digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  if (national.length !== 10) {
    return { phoneDisplay: "", phoneE164: "" };
  }

  return {
    phoneDisplay: `(${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6)}`,
    phoneE164: `+1${national}`,
  };
}

const contactPhone = formatContactPhone(
  process.env.NEXT_PUBLIC_CONTACT_PHONE,
);

export const SITE = {
  name: "KalmTouch",
  legalName: "KalmTouch Massage",
  tagline: "Massage & Restorative Bodywork",
  description:
    "KalmTouch offers restorative on-site massage in the Ottawa/Gatineau area. Book Swedish, deep tissue, and prenatal sessions.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "kalmtouch18@gmail.com",
  phoneDisplay: contactPhone.phoneDisplay,
  phoneE164: contactPhone.phoneE164,
  areaServed: "Ottawa/Gatineau Area",
  serviceType: "On-site massage",
  instagramUrl: "https://www.instagram.com/kalmtouch_/",
  instagramHandle: "@kalmtouch_",
  hours: [
    { days: "Mon–Thu", detail: "6:30pm–9:30pm" },
    { days: "Sat–Sun", detail: "Evenings on demand" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification" as const,
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "18:30",
      closes: "21:30",
    },
    {
      "@type": "OpeningHoursSpecification" as const,
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "18:00",
      closes: "21:30",
    },
  ],
} as const;

export function getLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MassageTherapist",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    email: SITE.email,
    telephone: SITE.phoneE164,
    image: `${SITE.url}/opengraph-image`,
    areaServed: [
      { "@type": "City", name: "Ottawa" },
      { "@type": "City", name: "Gatineau" },
    ],
    serviceType: [
      "Swedish massage",
      "Deep tissue massage",
      "Prenatal massage",
      "On-site massage",
    ],
    sameAs: [SITE.instagramUrl],
    openingHoursSpecification: SITE.openingHoursSpecification,
  };
}
