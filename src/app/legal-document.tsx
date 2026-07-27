"use client";

import Image from "next/image";
import Link from "next/link";
import LanguageToggle from "./language-toggle";
import { formatMessage } from "@/lib/i18n/messages";
import { legalCopy, type LegalDocument as LegalDocumentData } from "@/lib/i18n/legal";
import { useLocale } from "@/lib/i18n/locale-provider";
import { SITE } from "@/lib/site";

type DocumentKind = "privacy" | "terms";

function fillEmail(text: string) {
  return formatMessage(text, { email: SITE.email });
}

function DocumentBody({ document }: { document: LegalDocumentData }) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-24">
      <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent">
        {document.lastUpdated}
      </p>
      <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-foreground md:text-5xl">
        {document.title}
      </h1>
      <p className="mt-6 text-base leading-relaxed text-muted md:text-lg">
        {fillEmail(document.intro)}
      </p>

      <div className="mt-12 flex flex-col gap-10">
        {document.sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-2xl font-medium tracking-tight text-foreground">
              {section.title}
            </h2>
            {section.paragraphs?.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-3 text-base leading-relaxed text-muted"
              >
                {fillEmail(paragraph)}
              </p>
            ))}
            {section.bullets ? (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-muted">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{fillEmail(bullet)}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </article>
  );
}

export default function LegalDocument({ kind }: { kind: DocumentKind }) {
  const { locale, t } = useLocale();
  const copy = legalCopy[locale];
  const document = copy[kind];
  const otherHref = kind === "privacy" ? "/terms" : "/privacy";
  const otherLabel =
    kind === "privacy" ? t.footer.terms : t.footer.privacy;

  return (
    <div className="flex min-h-full flex-col bg-background">
      <header className="border-b border-stone/70 bg-background/90">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5 md:px-10">
          <Link href="/" className="relative block h-14 w-14 shrink-0 md:h-16 md:w-16">
            <Image
              src="/images/kalm-touch-logo.png"
              alt="KalmTouch"
              fill
              priority
              quality={100}
              className="object-contain"
              sizes="(max-width: 768px) 56px, 64px"
            />
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <LanguageToggle variant="footer" />
            <Link
              href="/"
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-deep"
            >
              {copy.backHome}
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <DocumentBody document={document} />
      </main>

      <footer className="border-t border-stone/70 bg-background px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {SITE.legalName}. {t.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <Link href={otherHref} className="text-foreground transition hover:text-accent">
              {otherLabel}
            </Link>
            <LanguageToggle variant="footer" />
          </div>
        </div>
      </footer>
    </div>
  );
}
