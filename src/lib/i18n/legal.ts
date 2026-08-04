import type { Locale } from "./messages";

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalDocument = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

export type LegalCopy = {
  backHome: string;
  privacy: LegalDocument;
  terms: LegalDocument;
};

export const legalCopy: Record<Locale, LegalCopy> = {
  en: {
    backHome: "Back to home",
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: August 3, 2026",
      intro:
        "KalmTouch Massage (“KalmTouch,” “we,” “us,” or “our”) respects your privacy. This policy explains what personal information we collect through www.kalmtouch.ca (the “Site”), how we use it, and the choices you have. We operate as an on-site massage service in the Ottawa/Gatineau area.",
      sections: [
        {
          title: "Information we collect",
          paragraphs: [
            "We collect information you choose to give us when you book a session or send a message:",
          ],
          bullets: [
            "Booking: name, email address, phone number, service address, appointment details, and any notes you provide (for example building access or preferences).",
            "Health intake (optional, after booking): pain areas, health concerns, allergies, scent tolerance, occupation, sports, recent surgery, pregnancy details, recent massage history, medication, and other notes you choose to share, including selections on a body map. You may submit an empty form.",
            "Contact form: name, email address, subject, and message.",
            "Language preference: stored in your browser’s local storage so the Site can remember English or French.",
          ],
        },
        {
          title: "How we use your information",
          paragraphs: ["We use your information to:"],
          bullets: [
            "Schedule, confirm, and deliver on-site massage appointments.",
            "Prepare a safe, tailored massage using health intake details you provide.",
            "Send calendar invites and booking-related emails.",
            "Respond to inquiries and provide customer support.",
            "Operate and improve the Site’s language experience.",
          ],
        },
        {
          title: "How we share information",
          paragraphs: [
            "We do not sell your personal information. We share it only as needed to run the service:",
          ],
          bullets: [
            "Google Calendar and Gmail: booking details and contact messages may be processed through Google services we use to manage appointments and email.",
            "Google Drive, Google Sheets, and Gmail: optional health intake forms are stored as PDF files in the studio Drive, summarized (name, phone, address, email, booking id, and Drive link) in a studio Google Sheet for session preparation, and a PDF copy is emailed to the address you provide.",
            "Service providers who help us host or operate the Site, under obligations to protect your information.",
            "When required by law, or to protect the safety, rights, or property of KalmTouch, our clients, or others.",
          ],
        },
        {
          title: "Cookies and similar technologies",
          paragraphs: [
            "The Site does not use advertising or analytics cookies. We store your language preference locally in your browser. You can clear this at any time through your browser settings.",
          ],
        },
        {
          title: "Retention",
          paragraphs: [
            "We keep booking, contact, and health intake information for as long as needed to provide services, follow up on appointments, meet legal or accounting needs, and resolve disputes. You may ask us to delete information we no longer need to keep.",
          ],
        },
        {
          title: "Your choices and rights",
          paragraphs: [
            "Depending on applicable Canadian privacy law (including PIPEDA and, where relevant, provincial rules), you may request access to, correction of, or deletion of personal information we hold about you. To make a request, email us at the address below. We may need to verify your identity before responding. Completing the health intake is optional; skipping it does not cancel your booking.",
          ],
        },
        {
          title: "Security",
          paragraphs: [
            "We take reasonable administrative and technical steps to protect personal information, including limiting health intake files to the studio Google account. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.",
          ],
        },
        {
          title: "Children",
          paragraphs: [
            "The Site is not directed to children under 16. We do not knowingly collect personal information from children under 16. If you believe we have, please contact us so we can delete it.",
          ],
        },
        {
          title: "Third-party links",
          paragraphs: [
            "The Site may link to third-party sites (for example Instagram). Their privacy practices are their own; this policy does not cover them.",
          ],
        },
        {
          title: "Changes",
          paragraphs: [
            "We may update this policy from time to time. The “Last updated” date at the top will change when we do. Continued use of the Site after an update means you accept the revised policy.",
          ],
        },
        {
          title: "Contact",
          paragraphs: [
            "Questions about this policy or your personal information: {email}. KalmTouch Massage — Ottawa/Gatineau Area.",
          ],
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      lastUpdated: "Last updated: July 27, 2026",
      intro:
        "These Terms of Service (“Terms”) govern your use of the KalmTouch Massage website and booking services (“Services”). By using the Site or booking a session, you agree to these Terms. If you do not agree, please do not use the Services.",
      sections: [
        {
          title: "Who we are",
          paragraphs: [
            "KalmTouch Massage provides on-site Swedish, deep tissue, and related massage services in the Ottawa/Gatineau area. Contact: {email}.",
          ],
        },
        {
          title: "Eligibility",
          paragraphs: [
            "You must be able to enter a binding agreement under applicable law to book a session. By booking, you confirm that the information you provide is accurate and that you (or the person receiving the massage) are an appropriate candidate for massage therapy as described below.",
          ],
        },
        {
          title: "Services and bookings",
          paragraphs: [
            "Online booking lets you request or confirm appointment times subject to availability. Weekday (Mon–Thu) bookings may be confirmed automatically when a slot is free. Weekend on-demand requests are requests only until we confirm by email.",
            "A booking is not a guarantee of treatment if we cannot safely or appropriately provide the service (for example due to health contraindications, unsafe conditions at the location, or scheduling conflicts). We will contact you to reschedule or cancel in those cases.",
          ],
        },
        {
          title: "On-site visits",
          paragraphs: [
            "Sessions take place at the address you provide. You agree to:",
          ],
          bullets: [
            "Provide a complete, accurate address in our service area, including unit number if applicable.",
            "Ensure reasonable access, a suitable space for massage, and a safe environment for the therapist.",
            "Be present and ready at the scheduled start time.",
          ],
        },
        {
          title: "Health and suitability",
          paragraphs: [
            "Massage is not a substitute for medical care. You are responsible for disclosing relevant health conditions, injuries, pregnancy, allergies, or other factors that may affect treatment. We may decline or modify a session if we reasonably believe massage is inappropriate or unsafe.",
            "If you have a medical condition, consult a qualified health professional before booking.",
          ],
        },
        {
          title: "Cancellations and changes",
          paragraphs: [
            "Please cancel or reschedule as early as possible by email or phone. Late cancellations, no-shows, or incomplete address/access information may result in loss of the reserved time and, where we notify you in advance of our policy, a fee. We will communicate any cancellation policy changes clearly before they apply to new bookings.",
          ],
        },
        {
          title: "Fees and payment",
          paragraphs: [
            "Service fees are communicated when you book or inquire. Payment arrangements (method and timing) will be confirmed with you for each session. Prices may change; changes will not affect bookings already confirmed at a stated price unless we agree otherwise with you.",
          ],
        },
        {
          title: "Conduct",
          paragraphs: [
            "We provide professional therapeutic massage only. Sexual or inappropriate behaviour toward the therapist will result in immediate termination of the session without refund, and may be reported to authorities where appropriate.",
          ],
        },
        {
          title: "Website use",
          paragraphs: [
            "You may use the Site for lawful personal purposes related to learning about and booking our services. You may not misuse the Site (including attempting to disrupt it, scrape it abusively, or submit false booking information).",
          ],
        },
        {
          title: "Intellectual property",
          paragraphs: [
            "Site content, branding, and materials belong to KalmTouch or its licensors. You may not copy or reuse them for commercial purposes without our written permission.",
          ],
        },
        {
          title: "Disclaimer and limitation of liability",
          paragraphs: [
            "To the fullest extent permitted by law, the Services and Site are provided “as is.” We are not liable for indirect, incidental, or consequential damages arising from your use of the Site or Services. Our total liability for any claim related to a session or the Site is limited to the amount you paid us for the specific session giving rise to the claim, except where liability cannot be limited under applicable law (including for gross negligence or wilful misconduct).",
          ],
        },
        {
          title: "Privacy",
          paragraphs: [
            "How we handle personal information is described in our Privacy Policy.",
          ],
        },
        {
          title: "Governing law",
          paragraphs: [
            "These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein, without regard to conflict-of-law rules. Courts in Ottawa, Ontario shall have exclusive jurisdiction, except where consumer protection laws give you non-waivable rights in another forum.",
          ],
        },
        {
          title: "Changes",
          paragraphs: [
            "We may update these Terms from time to time. The “Last updated” date will change when we do. Continued use of the Services after an update constitutes acceptance of the revised Terms for future use and bookings.",
          ],
        },
        {
          title: "Contact",
          paragraphs: [
            "Questions about these Terms: {email}. KalmTouch Massage — Ottawa/Gatineau Area.",
          ],
        },
      ],
    },
  },
  fr: {
    backHome: "Retour à l’accueil",
    privacy: {
      title: "Politique de confidentialité",
      lastUpdated: "Dernière mise à jour : 3 août 2026",
      intro:
        "KalmTouch Massage (« KalmTouch », « nous » ou « notre ») respecte votre vie privée. Cette politique explique quels renseignements personnels nous recueillons via www.kalmtouch.ca (le « Site »), comment nous les utilisons et quels choix vous avez. Nous offrons un service de massage à domicile dans la région d’Ottawa/Gatineau.",
      sections: [
        {
          title: "Renseignements que nous recueillons",
          paragraphs: [
            "Nous recueillons les renseignements que vous choisissez de nous fournir lorsque vous réservez une séance ou envoyez un message :",
          ],
          bullets: [
            "Réservation : nom, adresse courriel, numéro de téléphone, adresse du service, détails du rendez-vous et toute note que vous fournissez (par exemple accès à l’immeuble ou préférences).",
            "Fiche santé (facultative, après la réservation) : zones de douleur, problèmes de santé, allergies, tolérance aux odeurs, occupation, sports, chirurgie récente, détails de grossesse, historique de massage récent, médication et autres notes que vous choisissez de partager, y compris des sélections sur un schéma du corps. Vous pouvez envoyer un formulaire vide.",
            "Formulaire de contact : nom, adresse courriel, objet et message.",
            "Préférence de langue : stockée dans le stockage local de votre navigateur pour que le Site se souvienne de l’anglais ou du français.",
          ],
        },
        {
          title: "Comment nous utilisons vos renseignements",
          paragraphs: ["Nous utilisons vos renseignements pour :"],
          bullets: [
            "Planifier, confirmer et offrir les rendez-vous de massage à domicile.",
            "Préparer un massage sécuritaire et adapté grâce aux détails de la fiche santé que vous fournissez.",
            "Envoyer des invitations calendrier et des courriels liés aux réservations.",
            "Répondre aux demandes et offrir du soutien à la clientèle.",
            "Assurer et améliorer l’expérience linguistique du Site.",
          ],
        },
        {
          title: "Comment nous partageons les renseignements",
          paragraphs: [
            "Nous ne vendons pas vos renseignements personnels. Nous ne les partageons que dans la mesure nécessaire pour offrir le service :",
          ],
          bullets: [
            "Google Calendar et Gmail : les détails de réservation et les messages de contact peuvent être traités via les services Google que nous utilisons pour gérer les rendez-vous et le courriel.",
            "Google Drive, Google Sheets et Gmail : les fiches santé facultatives sont enregistrées en PDF dans le Drive du studio, résumées (nom, téléphone, adresse, courriel, id de réservation et lien Drive) dans une feuille Google du studio pour préparer la séance, et une copie PDF est envoyée à l’adresse courriel que vous fournissez.",
            "Fournisseurs qui nous aident à héberger ou à faire fonctionner le Site, sous obligation de protéger vos renseignements.",
            "Lorsque la loi l’exige, ou pour protéger la sécurité, les droits ou les biens de KalmTouch, de nos clients ou d’autrui.",
          ],
        },
        {
          title: "Témoins et technologies similaires",
          paragraphs: [
            "Le Site n’utilise pas de témoins publicitaires ou d’analytique. Nous stockons votre préférence de langue localement dans votre navigateur. Vous pouvez l’effacer en tout temps dans les paramètres de votre navigateur.",
          ],
        },
        {
          title: "Conservation",
          paragraphs: [
            "Nous conservons les renseignements de réservation, de contact et de fiche santé aussi longtemps que nécessaire pour fournir les services, assurer le suivi des rendez-vous, respecter des obligations légales ou comptables, et résoudre des différends. Vous pouvez nous demander de supprimer des renseignements que nous n’avons plus besoin de conserver.",
          ],
        },
        {
          title: "Vos choix et droits",
          paragraphs: [
            "Selon les lois canadiennes applicables en matière de protection de la vie privée (y compris la LPRPDE et, le cas échéant, les règles provinciales), vous pouvez demander l’accès, la correction ou la suppression des renseignements personnels que nous détenons à votre sujet. Pour faire une demande, écrivez-nous à l’adresse ci-dessous. Nous pourrons devoir vérifier votre identité avant de répondre. Remplir la fiche santé est facultatif; la passer n’annule pas votre réservation.",
          ],
        },
        {
          title: "Sécurité",
          paragraphs: [
            "Nous prenons des mesures administratives et techniques raisonnables pour protéger les renseignements personnels, y compris en limitant les fiches santé au compte Google du studio. Aucune méthode de transmission ou de stockage n’est totalement sécurisée; nous ne pouvons donc pas garantir une sécurité absolue.",
          ],
        },
        {
          title: "Enfants",
          paragraphs: [
            "Le Site ne s’adresse pas aux enfants de moins de 16 ans. Nous ne recueillons pas sciemment de renseignements personnels auprès d’enfants de moins de 16 ans. Si vous croyez que nous en avons recueilli, contactez-nous afin que nous puissions les supprimer.",
          ],
        },
        {
          title: "Liens vers des tiers",
          paragraphs: [
            "Le Site peut contenir des liens vers des sites tiers (par exemple Instagram). Leurs pratiques de confidentialité leur appartiennent; la présente politique ne les couvre pas.",
          ],
        },
        {
          title: "Modifications",
          paragraphs: [
            "Nous pouvons mettre à jour cette politique de temps à autre. La date de « Dernière mise à jour » en haut changera lorsque nous le ferons. L’utilisation continue du Site après une mise à jour signifie que vous acceptez la politique révisée.",
          ],
        },
        {
          title: "Contact",
          paragraphs: [
            "Questions au sujet de cette politique ou de vos renseignements personnels : {email}. KalmTouch Massage — région d’Ottawa/Gatineau.",
          ],
        },
      ],
    },
    terms: {
      title: "Conditions d’utilisation",
      lastUpdated: "Dernière mise à jour : 27 juillet 2026",
      intro:
        "Les présentes Conditions d’utilisation (« Conditions ») régissent votre utilisation du site Web et des services de réservation de KalmTouch Massage (les « Services »). En utilisant le Site ou en réservant une séance, vous acceptez ces Conditions. Si vous n’êtes pas d’accord, veuillez ne pas utiliser les Services.",
      sections: [
        {
          title: "Qui nous sommes",
          paragraphs: [
            "KalmTouch Massage offre des massages suédois, tissus profonds et services connexes à domicile dans la région d’Ottawa/Gatineau. Contact : {email}.",
          ],
        },
        {
          title: "Admissibilité",
          paragraphs: [
            "Vous devez être en mesure de conclure un contrat valide selon la loi applicable pour réserver une séance. En réservant, vous confirmez que les renseignements fournis sont exacts et que vous (ou la personne qui reçoit le massage) êtes un candidat approprié au massage thérapeutique, comme décrit ci-dessous.",
          ],
        },
        {
          title: "Services et réservations",
          paragraphs: [
            "La réservation en ligne vous permet de demander ou de confirmer des plages horaires selon la disponibilité. Les réservations en semaine (lun–jeu) peuvent être confirmées automatiquement lorsqu’une plage est libre. Les demandes de fin de semaine sur demande restent des demandes jusqu’à confirmation par courriel.",
            "Une réservation ne garantit pas le traitement si nous ne pouvons pas offrir le service de façon sécuritaire ou appropriée (par exemple contre-indications de santé, conditions dangereuses sur les lieux, ou conflits d’horaire). Dans ces cas, nous vous contacterons pour reporter ou annuler.",
          ],
        },
        {
          title: "Visites à domicile",
          paragraphs: [
            "Les séances ont lieu à l’adresse que vous fournissez. Vous acceptez de :",
          ],
          bullets: [
            "Fournir une adresse complète et exacte dans notre zone de service, y compris le numéro d’unité le cas échéant.",
            "Assurer un accès raisonnable, un espace convenable pour le massage et un environnement sécuritaire pour le thérapeute.",
            "Être présent et prêt à l’heure de début prévue.",
          ],
        },
        {
          title: "Santé et admissibilité au massage",
          paragraphs: [
            "Le massage ne remplace pas les soins médicaux. Vous êtes responsable de divulguer les conditions de santé, blessures, grossesse, allergies ou autres facteurs pertinents pouvant affecter le traitement. Nous pouvons refuser ou modifier une séance si nous croyons raisonnablement que le massage est inapproprié ou dangereux.",
            "Si vous avez une condition médicale, consultez un professionnel de la santé qualifié avant de réserver.",
          ],
        },
        {
          title: "Annulations et modifications",
          paragraphs: [
            "Veuillez annuler ou reporter le plus tôt possible par courriel ou téléphone. Les annulations tardives, les absences ou des renseignements d’adresse/d’accès incomplets peuvent entraîner la perte de la plage réservée et, lorsque nous vous avons informé à l’avance de notre politique, des frais. Nous communiquerons clairement toute modification de la politique d’annulation avant qu’elle s’applique aux nouvelles réservations.",
          ],
        },
        {
          title: "Tarifs et paiement",
          paragraphs: [
            "Les tarifs des services sont communiqués lors de la réservation ou de la demande de renseignements. Les modalités de paiement (méthode et moment) seront confirmées avec vous pour chaque séance. Les prix peuvent changer; les changements n’affectent pas les réservations déjà confirmées à un prix indiqué, sauf entente contraire.",
          ],
        },
        {
          title: "Conduite",
          paragraphs: [
            "Nous offrons uniquement un massage thérapeutique professionnel. Tout comportement sexuel ou inapproprié envers le thérapeute entraînera la fin immédiate de la séance sans remboursement, et pourra être signalé aux autorités le cas échéant.",
          ],
        },
        {
          title: "Utilisation du site",
          paragraphs: [
            "Vous pouvez utiliser le Site à des fins personnelles légitimes liées à la découverte et à la réservation de nos services. Vous ne devez pas en abuser (y compris tenter de le perturber, le moissonner de façon abusive, ou soumettre de fausses informations de réservation).",
          ],
        },
        {
          title: "Propriété intellectuelle",
          paragraphs: [
            "Le contenu, l’image de marque et les matériaux du Site appartiennent à KalmTouch ou à ses concédants. Vous ne pouvez pas les copier ni les réutiliser à des fins commerciales sans notre autorisation écrite.",
          ],
        },
        {
          title: "Avertissement et limitation de responsabilité",
          paragraphs: [
            "Dans toute la mesure permise par la loi, les Services et le Site sont fournis « tels quels ». Nous ne sommes pas responsables des dommages indirects, accessoires ou consécutifs découlant de votre utilisation du Site ou des Services. Notre responsabilité totale pour toute réclamation liée à une séance ou au Site est limitée au montant que vous nous avez payé pour la séance précise donnant lieu à la réclamation, sauf lorsque la responsabilité ne peut être limitée selon la loi applicable (notamment en cas de négligence grave ou de faute intentionnelle).",
          ],
        },
        {
          title: "Confidentialité",
          paragraphs: [
            "La façon dont nous traitons les renseignements personnels est décrite dans notre Politique de confidentialité.",
          ],
        },
        {
          title: "Droit applicable",
          paragraphs: [
            "Ces Conditions sont régies par les lois de la province de l’Ontario et les lois fédérales du Canada qui s’y appliquent, sans égard aux règles de conflit de lois. Les tribunaux d’Ottawa (Ontario) ont compétence exclusive, sauf lorsque les lois sur la protection du consommateur vous donnent des droits non renonçables devant un autre forum.",
          ],
        },
        {
          title: "Modifications",
          paragraphs: [
            "Nous pouvons mettre à jour ces Conditions de temps à autre. La date de « Dernière mise à jour » changera lorsque nous le ferons. L’utilisation continue des Services après une mise à jour constitue l’acceptation des Conditions révisées pour les utilisations et réservations futures.",
          ],
        },
        {
          title: "Contact",
          paragraphs: [
            "Questions au sujet de ces Conditions : {email}. KalmTouch Massage — région d’Ottawa/Gatineau.",
          ],
        },
      ],
    },
  },
};
