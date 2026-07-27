"use client";

import { LOCALES, type Locale } from "@/lib/i18n/messages";
import { useLocale } from "@/lib/i18n/locale-provider";

type LanguageToggleProps = {
  variant?: "header" | "footer";
};

export default function LanguageToggle({
  variant = "header",
}: LanguageToggleProps) {
  const { locale, setLocale, t } = useLocale();

  const idleClass =
    variant === "header"
      ? "text-white/55 hover:text-white"
      : "text-muted hover:text-foreground";
  const activeClass =
    variant === "header" ? "text-white" : "text-foreground";

  return (
    <div
      role="group"
      aria-label={t.language.label}
      className="inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.08em]"
    >
      {LOCALES.map((code, index) => (
        <span key={code} className="inline-flex items-center gap-1.5">
          {index > 0 ? (
            <span
              aria-hidden
              className={
                variant === "header" ? "text-white/35" : "text-stone"
              }
            >
              |
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={locale === code}
            className={`transition-colors ${
              locale === code ? activeClass : idleClass
            }`}
          >
            {t.language[code as Locale]}
          </button>
        </span>
      ))}
    </div>
  );
}
