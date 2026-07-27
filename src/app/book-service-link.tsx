"use client";

import { useLocale } from "@/lib/i18n/locale-provider";

export const SELECT_SERVICE_EVENT = "kalmtouch:select-service";

export default function BookServiceLink({ serviceId }: { serviceId: string }) {
  const { t } = useLocale();

  return (
    <a
      href="#book"
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent(SELECT_SERVICE_EVENT, {
            detail: { serviceId },
          }),
        );
      }}
      className="text-sm font-medium text-accent transition hover:text-accent-deep"
    >
      {t.services.bookNow}
    </a>
  );
}
