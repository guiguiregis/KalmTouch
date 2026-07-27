export type Locale = "en" | "fr";

export const LOCALES: Locale[] = ["en", "fr"];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_STORAGE_KEY = "kalmtouch-locale";

export type Messages = {
  nav: {
    services: string;
    approach: string;
    visit: string;
    contact: string;
    book: string;
    menu: string;
    openMenu: string;
    closeMenu: string;
  };
  language: {
    label: string;
    en: string;
    fr: string;
  };
  hero: {
    headline: string;
    support: string;
    book: string;
    viewServices: string;
  };
  services: {
    title: string;
    intro: string;
    questions: string;
    getInTouch: string;
    bookNow: string;
    duration: string;
  };
  serviceDetails: Record<
    string,
    {
      name: string;
      detail: string;
    }
  >;
  approach: {
    title: string;
    body: string;
    imageAlt: string;
  };
  visit: {
    title: string;
    intro: string;
    location: string;
    locationValue: string;
    onSite: string;
    hours: string;
    weekdayHours: string;
    weekendHours: string;
  };
  contact: {
    title: string;
    intro: string;
    email: string;
    phone: string;
    socials: string;
  };
  footer: {
    blurb: string;
    backToTop: string;
    explore: string;
    book: string;
    visit: string;
    social: string;
    contact: string;
    rights: string;
    hours: Array<{ days: string; detail: string }>;
  };
  booking: {
    loading: string;
    notConfigured: string;
    schedule: string;
    regular: string;
    onDemand: string;
    regularHint: string;
    onDemandHint: string;
    service: string;
    serviceMore: string;
    date: string;
    noDates: string;
    or: string;
    enterDate: string;
    unavailable: string;
    time: string;
    preferredTime: string;
    noWeekendTimes: string;
    noSlots: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    address: string;
    addressPlaceholder: string;
    addressHint: string;
    phone: string;
    phonePlaceholder: string;
    notes: string;
    notesOptional: string;
    notesPlaceholder: string;
    choosePreferredTime: string;
    chooseAvailableTime: string;
    bookingFailed: string;
    loadTimesFailed: string;
    bookingFailedRetry: string;
    requestSent: string;
    requestSentFor: string;
    confirmEmail: string;
    booked: string;
    bookedYourSession: string;
    inviteOnWay: string;
    sendingRequest: string;
    booking: string;
    requestWeekend: string;
    bookAppointment: string;
    reset: string;
    orCall: string;
  };
  contactForm: {
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    subject: string;
    subjectPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    sendFailed: string;
    sendFailedRetry: string;
    sent: string;
    sending: string;
    send: string;
  };
};

export const messages: Record<Locale, Messages> = {
  en: {
    nav: {
      services: "Services",
      approach: "Approach",
      visit: "Visit",
      contact: "Contact",
      book: "Book a session",
      menu: "",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    language: {
      label: "Language",
      en: "EN",
      fr: "FR",
    },
    hero: {
      headline: "Massage that restores what the day takes away.",
      support:
        "An unhurried studio for Swedish, deep tissue, and prenatal bodywork — quiet rooms, skilled hands, lasting calm.",
      book: "Book a session",
      viewServices: "View services",
    },
    services: {
      title: "Services",
      intro:
        "Each session is tailored in the moment — pressure, pace, and focus shaped around what your body needs today.",
      questions: "Any questions?",
      getInTouch: "Get in touch",
      bookNow: "Book now",
      duration: "{minutes} min",
    },
    serviceDetails: {
      swedish: {
        name: "Swedish Massage",
        detail:
          "Long, flowing strokes to ease everyday tension and quiet the nervous system.",
      },
      "deep-tissue": {
        name: "Deep Tissue",
        detail:
          "Slower pressure for stubborn knots, posture strain, and lasting tightness.",
      },
    },
    approach: {
      title: "Soft light. Steady hands. No rush.",
      body: "KalmTouch was built for people who carry their week in their shoulders. We keep sessions simple: a warm room, attentive listening, and bodywork that leaves you clearer — not just temporarily soothed.",
      imageAlt: "Light-skinned African male hands preparing warm massage oils",
    },
    visit: {
      title: "Prepare for our visit",
      intro: "Leave enough space for us to work our magic.",
      location: "Location",
      locationValue: "Ottawa/Gatineau Area",
      onSite: "On-Site",
      hours: "Hours",
      weekdayHours: "Mon–Thu · 6:30pm–9:30pm",
      weekendHours: "Sat-Sun · Evenings On-Demand",
    },
    contact: {
      title: "Get in touch",
      intro:
        "Questions about a session, gift certificates, or anything else — write to us.",
      email: "Email",
      phone: "Phone",
      socials: "Socials",
    },
    footer: {
      blurb:
        "KalmTouch — on-site Swedish, deep tissue, and prenatal massage in the Ottawa/Gatineau Area.",
      backToTop: "Back to top",
      explore: "Explore",
      book: "Book",
      visit: "Visit",
      social: "Social",
      contact: "Contact",
      rights: "All rights reserved.",
      hours: [
        { days: "Mon–Thu", detail: "6:30pm–9:30pm" },
        { days: "Sat–Sun", detail: "Evenings on demand" },
      ],
    },
    booking: {
      loading: "Loading available times…",
      notConfigured:
        "Online booking is being connected to Google Calendar. In the meantime, email {email} or call {phone}.",
      schedule: "Schedule",
      regular: "Mon–Thu",
      onDemand: "Sat–Sun on-demand",
      regularHint:
        "Book a confirmed evening slot. No account needed — we'll send a calendar invite.",
      onDemandHint:
        "Request a weekend time between 6:30am and 9:30pm. We'll confirm by email if that works.",
      service: "Service",
      serviceMore: "if you want to know more.",
      date: "Date",
      noDates: "No dates available.",
      or: "or",
      enterDate: "Enter a specific date",
      unavailable: "Unavailable",
      time: "Time",
      preferredTime: "Preferred time",
      noWeekendTimes: "No weekend times open in the next few weeks.",
      noSlots: "No open slots on this day.",
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@email.com",
      address: "Address",
      addressPlaceholder: "Street, city (Ottawa/Gatineau area)",
      addressHint: "Sessions are on-site — include unit number if needed.",
      phone: "Phone",
      phonePlaceholder: "(555) 555-5555",
      notes: "Notes",
      notesOptional: "(optional)",
      notesPlaceholder: "Building access, parking, preferences…",
      choosePreferredTime: "Choose a preferred time.",
      chooseAvailableTime: "Choose an available time.",
      bookingFailed: "Booking failed.",
      loadTimesFailed: "Could not load available times.",
      bookingFailedRetry: "Booking failed. Please try again or call us.",
      requestSent: "Weekend request sent",
      requestSentFor: "Weekend request sent for {label}",
      confirmEmail: "We'll email {email} to confirm.",
      booked: "Booked {service}",
      bookedYourSession: "your session",
      inviteOnWay: "A calendar invite is on its way to {email}.",
      sendingRequest: "Sending request…",
      booking: "Booking…",
      requestWeekend: "Request weekend time",
      bookAppointment: "Book appointment",
      reset: "Reset",
      orCall: "Or call",
    },
    contactForm: {
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@email.com",
      subject: "Subject",
      subjectPlaceholder: "How can we help?",
      message: "Message",
      messagePlaceholder: "Write your message...",
      sendFailed: "Could not send your message.",
      sendFailedRetry:
        "Could not send your message. Please try again or call us.",
      sent: "Message sent.",
      sending: "Sending…",
      send: "Send email",
    },
  },
  fr: {
    nav: {
      services: "Services",
      approach: "Approche",
      visit: "Visite",
      contact: "Contact",
      book: "Réserver",
      menu: "Menu",
      openMenu: "Ouvrir le menu",
      closeMenu: "Fermer le menu",
    },
    language: {
      label: "Langue",
      en: "EN",
      fr: "FR",
    },
    hero: {
      headline: "Un massage qui rend ce que la journée vous enlève.",
      support:
        "Un espace sans précipitation pour le suédois, le tissus profonds et le prénatal — pièces calmes, mains attentives, détente durable.",
      book: "Réserver une séance",
      viewServices: "Voir les services",
    },
    services: {
      title: "Services",
      intro:
        "Chaque séance s’adapte sur le moment — pression, rythme et focus selon ce dont votre corps a besoin aujourd’hui.",
      questions: "Des questions?",
      getInTouch: "Écrivez-nous",
      bookNow: "Réserver",
      duration: "{minutes} min",
    },
    serviceDetails: {
      swedish: {
        name: "Massage suédois",
        detail:
          "Des mouvements longs et fluides pour relâcher les tensions quotidiennes et calmer le système nerveux.",
      },
      "deep-tissue": {
        name: "Tissus profonds",
        detail:
          "Une pression plus lente pour les nœuds tenaces, les tensions posturales et les raideurs persistantes.",
      },
    },
    approach: {
      title: "Lumière douce. Mains sûres. Sans précipitation.",
      body: "KalmTouch a été pensé pour celles et ceux qui portent leur semaine dans les épaules. Des séances simples : une pièce chaude, une écoute attentive, et un travail corporel qui vous laisse plus clair — pas seulement apaisé un instant.",
      imageAlt:
        "Mains d’un homme afro-descendant à la peau claire préparant des huiles de massage chaudes",
    },
    visit: {
      title: "Préparez notre visite",
      intro: "Laissez-nous assez d’espace pour faire notre magie.",
      location: "Lieu",
      locationValue: "Région d’Ottawa/Gatineau",
      onSite: "Sur place",
      hours: "Heures",
      weekdayHours: "Lun–Jeu · 18 h 30–21 h 30",
      weekendHours: "Sam–Dim · Soirées sur demande",
    },
    contact: {
      title: "Nous joindre",
      intro:
        "Questions sur une séance, des certificats-cadeaux ou autre chose — écrivez-nous.",
      email: "Courriel",
      phone: "Téléphone",
      socials: "Réseaux",
    },
    footer: {
      blurb:
        "KalmTouch — massage suédois, tissus profonds et prénatal à domicile dans la région d’Ottawa/Gatineau.",
      backToTop: "Retour en haut",
      explore: "Explorer",
      book: "Réserver",
      visit: "Visite",
      social: "Réseaux",
      contact: "Contact",
      rights: "Tous droits réservés.",
      hours: [
        { days: "Lun–Jeu", detail: "18 h 30–21 h 30" },
        { days: "Sam–Dim", detail: "Soirées sur demande" },
      ],
    },
    booking: {
      loading: "Chargement des plages disponibles…",
      notConfigured:
        "La réservation en ligne se connecte à Google Calendar. En attendant, écrivez à {email} ou appelez le {phone}.",
      schedule: "Horaire",
      regular: "Lun–Jeu",
      onDemand: "Sam–Dim sur demande",
      regularHint:
        "Réservez une plage confirmée en soirée. Aucun compte requis — nous enverrons une invitation calendrier.",
      onDemandHint:
        "Demandez une plage de fin de semaine entre 6 h 30 et 21 h 30. Nous confirmerons par courriel si c’est possible.",
      service: "Service",
      serviceMore: "si vous souhaitez en savoir plus.",
      date: "Date",
      noDates: "Aucune date disponible.",
      or: "ou",
      enterDate: "Entrer une date précise",
      unavailable: "Indisponible",
      time: "Heure",
      preferredTime: "Heure préférée",
      noWeekendTimes:
        "Aucune plage de fin de semaine ouverte dans les prochaines semaines.",
      noSlots: "Aucune plage ouverte ce jour-là.",
      name: "Nom",
      namePlaceholder: "Votre nom",
      email: "Courriel",
      emailPlaceholder: "vous@courriel.com",
      address: "Adresse",
      addressPlaceholder: "Rue, ville (région d’Ottawa/Gatineau)",
      addressHint:
        "Les séances sont à domicile — indiquez le numéro d’unité au besoin.",
      phone: "Téléphone",
      phonePlaceholder: "(555) 555-5555",
      notes: "Notes",
      notesOptional: "(facultatif)",
      notesPlaceholder: "Accès à l’immeuble, stationnement, préférences…",
      choosePreferredTime: "Choisissez une heure préférée.",
      chooseAvailableTime: "Choisissez une plage disponible.",
      bookingFailed: "La réservation a échoué.",
      loadTimesFailed: "Impossible de charger les plages disponibles.",
      bookingFailedRetry:
        "La réservation a échoué. Réessayez ou appelez-nous.",
      requestSent: "Demande de fin de semaine envoyée",
      requestSentFor: "Demande de fin de semaine envoyée pour {label}",
      confirmEmail: "Nous écrirons à {email} pour confirmer.",
      booked: "Réservé : {service}",
      bookedYourSession: "votre séance",
      inviteOnWay: "Une invitation calendrier est en route vers {email}.",
      sendingRequest: "Envoi de la demande…",
      booking: "Réservation…",
      requestWeekend: "Demander une plage de fin de semaine",
      bookAppointment: "Réserver le rendez-vous",
      reset: "Réinitialiser",
      orCall: "Ou appelez",
    },
    contactForm: {
      name: "Nom",
      namePlaceholder: "Votre nom",
      email: "Courriel",
      emailPlaceholder: "vous@courriel.com",
      subject: "Objet",
      subjectPlaceholder: "Comment pouvons-nous vous aider?",
      message: "Message",
      messagePlaceholder: "Écrivez votre message...",
      sendFailed: "Impossible d’envoyer votre message.",
      sendFailedRetry:
        "Impossible d’envoyer votre message. Réessayez ou appelez-nous.",
      sent: "Message envoyé.",
      sending: "Envoi…",
      send: "Envoyer le courriel",
    },
  },
};

export function formatMessage(
  template: string,
  values: Record<string, string | number>,
) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "fr";
}
