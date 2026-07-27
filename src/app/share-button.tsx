"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/locale-provider";
import { SITE } from "@/lib/site";

type ShareButtonProps = {
  className?: string;
  variant?: "footer" | "hero";
};

export default function ShareButton({
  className = "",
  variant = "footer",
}: ShareButtonProps) {
  const { t } = useLocale();
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setStatus("copied");
    window.setTimeout(() => setStatus("idle"), 2000);
  }

  async function handleShare() {
    const url = `${window.location.origin}${window.location.pathname}`;
    const data = {
      title: SITE.name,
      text: t.share.text,
      url,
    };

    try {
      if (typeof navigator.share === "function") {
        await navigator.share(data);
        return;
      }
      await copyUrl(url);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      try {
        await copyUrl(url);
      } catch {
        setStatus("error");
        window.setTimeout(() => setStatus("idle"), 2000);
      }
    }
  }

  const label =
    status === "copied"
      ? t.share.copied
      : status === "error"
        ? t.share.failed
        : t.share.label;

  const toneClass =
    variant === "hero"
      ? "text-sm font-medium text-white/90 underline-offset-4 hover:text-white hover:underline"
      : "text-sm hover:text-accent";

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center gap-2 text-left transition ${toneClass} ${className}`}
      aria-live="polite"
    >
      <ShareIcon className="shrink-0" />
      <span>{label}</span>
    </button>
  );
}

function ShareIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.4 13.2 15.6 17.3M15.6 6.7 8.4 10.8" />
    </svg>
  );
}
