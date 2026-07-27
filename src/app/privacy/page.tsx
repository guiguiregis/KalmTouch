import type { Metadata } from "next";
import LegalDocument from "../legal-document";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How KalmTouch Massage collects, uses, and protects personal information when you book or contact us.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return <LegalDocument kind="privacy" />;
}
