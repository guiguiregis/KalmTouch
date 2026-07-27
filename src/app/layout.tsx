import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { LocaleProvider } from "@/lib/i18n/locale-provider";
import { getLocalBusinessJsonLd, SITE } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "massage Ottawa",
    "massage Gatineau",
    "on-site massage",
    "Swedish massage",
    "deep tissue massage",
    "prenatal massage",
    "KalmTouch",
  ],
  authors: [{ name: SITE.name }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "/",
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = getLocalBusinessJsonLd();

  return (
    <html
      lang="en-CA"
      className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
