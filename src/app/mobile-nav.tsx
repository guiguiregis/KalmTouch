"use client";

import { useEffect, useEffectEvent, useId, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n/locale-provider";

const LINKS = [
  { href: "#services", key: "services" },
  { href: "#approach", key: "approach" },
  { href: "#visit", key: "visit" },
  { href: "#contact", key: "contact" },
] as const;

export default function MobileNav() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const close = useEffectEvent((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) {
      triggerRef.current?.focus();
    }
  });

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        close();
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onResize() {
      if (window.matchMedia("(min-width: 640px)").matches) {
        close();
      }
    }

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  return (
    <div ref={rootRef} className="relative sm:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-10 items-center gap-2 rounded-md border border-white/25 bg-white/10 px-3 text-sm font-medium text-white/90 backdrop-blur-sm transition hover:border-white/40 hover:bg-white/15 hover:text-white"
      >
        <span className="relative block h-2.5 w-3.5" aria-hidden>
          <span
            className={`absolute left-0 top-0 h-px w-full bg-current transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              open ? "translate-y-[5px] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 bottom-0 h-px w-full bg-current transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              open ? "-translate-y-[5px] -rotate-45" : ""
            }`}
          />
        </span>
        {t.nav.menu}
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="animate-dropdown absolute right-0 top-[calc(100%+0.65rem)] z-30 w-[min(16.5rem,calc(100vw-2.5rem))] overflow-hidden rounded-lg border border-white/20 bg-[rgba(6,48,58,0.88)] shadow-[0_18px_50px_rgba(6,48,58,0.35)] backdrop-blur-md"
        >
          <ul className="flex flex-col py-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  role="menuitem"
                  onClick={() => close()}
                  className="block px-5 py-3 font-display text-lg font-light tracking-wide text-white/90 transition hover:bg-white/10 hover:text-white"
                >
                  {t.nav[link.key]}
                </a>
              </li>
            ))}
          </ul>
          <div className="border-t border-white/15 px-5 py-3">
            <a
              href="#book"
              role="menuitem"
              onClick={() => close()}
              className="block rounded-md bg-white/95 px-4 py-2.5 text-center text-sm font-medium text-accent-deep transition hover:bg-white"
            >
              {t.nav.book}
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
