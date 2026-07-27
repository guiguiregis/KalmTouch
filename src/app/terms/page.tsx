import type { Metadata } from "next";
import LegalDocument from "../legal-document";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms for using KalmTouch Massage’s website and booking on-site massage in the Ottawa/Gatineau area.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return <LegalDocument kind="terms" />;
}
