"use client";

import Image from "next/image";
import BookServiceLink from "./book-service-link";
import BookingForm from "./booking-form";
import ContactForm from "./contact-form";
import HeroCarousel from "./hero-carousel";
import LanguageToggle from "./language-toggle";
import MobileNav from "./mobile-nav";
import ShareButton from "./share-button";
import { BOOKING_SERVICES } from "@/lib/calendar/config";
import { formatMessage } from "@/lib/i18n/messages";
import { useLocale } from "@/lib/i18n/locale-provider";
import { SITE } from "@/lib/site";

export default function Home() {
  const { t } = useLocale();

  const services = BOOKING_SERVICES.map((service) => {
    const detail = t.serviceDetails[service.id];
    return {
      id: service.id,
      name: detail?.name ?? service.name,
      duration: formatMessage(t.services.duration, {
        minutes: service.duration,
      }),
      detail: detail?.detail ?? service.description,
    };
  });

  return (
    <div className="flex min-h-full flex-col">
      <header className="absolute inset-x-0 top-0 z-20">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5 md:px-10">
          <a href="#top" className="relative block h-14 w-14 shrink-0 md:h-16 md:w-16">
            <Image
              src="/images/kalm-touch-logo.png"
              alt="KalmTouch"
              fill
              priority
              quality={100}
              className="object-contain"
              sizes="(max-width: 768px) 56px, 64px"
            />
          </a>
          <div className="hidden items-center gap-8 text-sm text-white/85 sm:flex">
            <a href="#services" className="transition-colors hover:text-white">
              {t.nav.services}
            </a>
            <a href="#approach" className="transition-colors hover:text-white">
              {t.nav.approach}
            </a>
            <a href="#visit" className="transition-colors hover:text-white">
              {t.nav.visit}
            </a>
            <a href="#contact" className="transition-colors hover:text-white">
              {t.nav.contact}
            </a>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <LanguageToggle variant="header" />
            <MobileNav />
            <a
              href="#book"
              className="hidden rounded-md bg-white/95 px-4 py-2 text-sm font-medium text-accent-deep transition hover:bg-white sm:inline-flex"
            >
              {t.nav.book}
            </a>
          </div>
        </nav>
      </header>

      <main id="top" className="flex-1">
        {/* Hero — one composition: brand, headline, support, CTA, full-bleed image */}
        <section className="relative min-h-[100svh] overflow-hidden">
          <HeroCarousel />
          <div
            className="absolute inset-0 animate-veil"
            style={{
              background:
                "linear-gradient(105deg, rgba(6,48,58,0.78) 0%, rgba(6,48,58,0.5) 48%, rgba(6,48,58,0.32) 100%)",
            }}
          />
          <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 pb-16 pt-28 md:px-10 md:pb-24">
            <div className="mx-auto w-full max-w-6xl">
              <div className="animate-rise relative h-36 w-36 sm:h-44 sm:w-44 md:h-52 md:w-52 hidden">
                <Image
                  src="/images/kalm-touch-logo.png"
                  alt="KalmTouch"
                  fill
                  priority
                  quality={100}
                  className="object-contain object-left drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                  sizes="(max-width: 640px) 144px, (max-width: 768px) 176px, 208px"
                />
              </div>
              <p className="animate-rise mt-5 font-display text-4xl font-medium tracking-tight text-white sm:text-5xl md:text-6xl">
                KalmTouch
              </p>
              <p className="animate-rise mt-2 text-sm font-medium uppercase tracking-[0.16em] text-white/70">
                {SITE.tagline}
              </p>
              <h1 className="animate-rise-delay mt-6 max-w-xl font-display text-2xl font-light leading-snug text-white/95 sm:text-3xl md:text-4xl">
                {t.hero.headline}
              </h1>
              <p className="animate-rise-delay mt-4 max-w-md text-base leading-relaxed text-white/80 md:text-lg">
                {t.hero.support}
              </p>
              <div className="animate-rise-delay-2 mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#book"
                  className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-deep"
                >
                  {t.hero.book}
                </a>
                <a
                  href="#services"
                  className="text-sm font-medium text-white/90 underline-offset-4 transition hover:text-white hover:underline"
                >
                  {t.hero.viewServices}
                </a>
                <ShareButton variant="hero" />
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section
          id="services"
          className="relative overflow-hidden bg-background px-6 py-24 md:px-10 md:py-32"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-mist/50 blur-3xl"
          />
          <div className="relative mx-auto max-w-6xl">
            <h2 className="font-display text-4xl tracking-tight text-foreground md:text-5xl">
              {t.services.title}
            </h2>
            <p className="mt-4 max-w-lg text-muted md:text-lg">{t.services.intro}</p>
            <ul className="mt-14 divide-y divide-stone/80 border-y border-stone/80">
              {services.map((service) => (
                <li
                  key={service.id}
                  className="grid gap-3 py-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_auto] md:items-baseline md:gap-10"
                >
                  <h3 className="font-display text-2xl text-foreground md:text-3xl">
                    {service.name}
                  </h3>
                  <p className="text-muted leading-relaxed">{service.detail}</p>
                  <div className="flex flex-col gap-2 md:items-end">
                    <p className="text-sm font-medium text-accent">
                      {service.duration}
                    </p>
                    <BookServiceLink serviceId={service.id} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-muted">
              {t.services.questions}{" "}
              <a
                href="#contact"
                className="font-medium text-accent hover:text-accent-deep"
              >
                {t.services.getInTouch}
              </a>
              .
            </p>
          </div>
        </section>

        {/* Approach */}
        <section
          id="approach"
          className="relative overflow-hidden px-6 py-24 md:px-10 md:py-32"
        >
          <Image
            src="/images/approach-oils-bg.png"
            alt=""
            fill
            aria-hidden
            className="object-cover blur-[5px] scale-105"
            sizes="100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-accent-deep/50" aria-hidden />

          <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div className="relative aspect-[4/5] overflow-hidden md:aspect-[5/6]">
              <Image
                src="/images/approach-oils.png"
                alt={t.approach.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="font-display text-4xl tracking-tight text-white md:text-5xl">
                {t.approach.title}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/85">
                {t.approach.body}
              </p>
            </div>
          </div>
        </section>

        {/* Visit / Book */}
        <section
          id="visit"
          className="relative overflow-hidden px-6 py-24 md:px-10 md:py-32"
          style={{
            background:
              "radial-gradient(ellipse at 20% 0%, #b5e8d6 0%, transparent 50%), radial-gradient(ellipse at 90% 100%, #9fd9c8 0%, transparent 45%), #f1f7f5",
          }}
        >
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-4xl tracking-tight text-foreground md:text-5xl">
              {t.visit.title}
            </h2>
            <p className="mt-4 max-w-md text-muted md:text-lg">{t.visit.intro}</p>

            <div className="mt-14 grid gap-12 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent">
                  {t.visit.location}
                </p>
                <p className="mt-3 text-lg leading-relaxed text-foreground">
                  {t.visit.locationValue}
                  <br />
                  {t.visit.onSite}
                </p>
                <p className="mt-6 text-sm font-medium uppercase tracking-[0.14em] text-accent">
                  {t.visit.hours}
                </p>
                <p className="mt-3 text-lg leading-relaxed text-foreground">
                  {t.visit.weekdayHours}
                  <br />
                  {t.visit.weekendHours}
                </p>
              </div>

              <BookingForm />
            </div>
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="bg-surface px-6 py-24 md:px-10 md:py-32"
        >
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-4xl tracking-tight text-foreground md:text-5xl">
              {t.contact.title}
            </h2>
            <p className="mt-4 max-w-md text-muted md:text-lg">{t.contact.intro}</p>

            <div className="mt-14 grid gap-12 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent">
                  {t.contact.email}
                </p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="mt-3 block text-lg font-medium text-foreground transition hover:text-accent"
                >
                  {SITE.email}
                </a>
                <p className="mt-6 text-sm font-medium uppercase tracking-[0.14em] text-accent">
                  {t.contact.phone}
                </p>
                <a
                  href={`tel:${SITE.phoneE164}`}
                  className="mt-3 block text-lg font-medium text-foreground transition hover:text-accent"
                >
                  {SITE.phoneDisplay}
                </a>
                <p className="mt-6 text-sm font-medium uppercase tracking-[0.14em] text-accent">
                  {t.contact.socials}
                </p>
                <a
                  href={SITE.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2.5 text-lg font-medium text-foreground transition hover:text-accent"
                >
                  <img
                    src="/images/instagram.svg"
                    alt=""
                    width={22}
                    height={22}
                    className="shrink-0"
                  />
                  <span>{SITE.instagramHandle}</span>
                </a>
              </div>

              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone/70 bg-background px-6 py-12 md:px-10 md:py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-x-10 sm:gap-y-12 lg:flex-nowrap">
          <div className="flex min-w-[10rem] max-w-xs flex-col gap-5">
            <a href="#top" className="flex items-center gap-3">
              <span className="relative block h-16 w-16 shrink-0">
                <Image
                  src="/images/kalm-touch-logo.png"
                  alt=""
                  fill
                  quality={100}
                  className="object-contain"
                  sizes="64px"
                />
              </span>
              <span className="font-display text-xl font-medium tracking-tight text-foreground">
                KalmTouch
              </span>
            </a>
            <p className="text-sm leading-relaxed text-muted">{t.footer.blurb}</p>
            <a
              href="#top"
              className="text-sm font-medium text-accent transition hover:text-accent-deep"
            >
              {t.footer.backToTop}
            </a>
          </div>

          <div className="min-w-[8rem]">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent">
              {t.footer.explore}
            </p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-foreground">
              <li>
                <a href="#services" className="transition hover:text-accent">
                  {t.nav.services}
                </a>
              </li>
              <li>
                <a href="#approach" className="transition hover:text-accent">
                  {t.nav.approach}
                </a>
              </li>
              <li>
                <a href="#visit" className="transition hover:text-accent">
                  {t.nav.visit}
                </a>
              </li>
              <li>
                <a href="#book" className="transition hover:text-accent">
                  {t.footer.book}
                </a>
              </li>
              <li>
                <a href="#contact" className="transition hover:text-accent">
                  {t.nav.contact}
                </a>
              </li>
              <li>
                <a href="/privacy" className="transition hover:text-accent">
                  {t.footer.privacy}
                </a>
              </li>
              <li>
                <a href="/terms" className="transition hover:text-accent">
                  {t.footer.terms}
                </a>
              </li>
            </ul>
          </div>

          <div className="min-w-[10rem]">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent">
              {t.footer.visit}
            </p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-foreground">
              <li>
                {t.visit.locationValue}
                <br />
                <span className="text-muted">{t.visit.onSite}</span>
              </li>
              {t.footer.hours.map((block) => (
                <li key={block.days}>
                  {block.days}
                  <br />
                  <span className="text-muted">{block.detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-[8rem]">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent">
              {t.footer.social}
            </p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-foreground">
              <li>
                <a
                  href={SITE.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition hover:text-accent"
                >
                  <img
                    src="/images/instagram.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="shrink-0"
                  />
                  {SITE.instagramHandle}
                </a>
              </li>
              <li>
                <ShareButton />
              </li>
            </ul>
          </div>

          <div className="min-w-[12rem]">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent">
              {t.footer.contact}
            </p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-foreground">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="transition hover:text-accent"
                >
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${SITE.phoneE164}`}
                  className="transition hover:text-accent"
                >
                  {SITE.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-14 flex max-w-6xl flex-col gap-4 border-t border-stone/50 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {SITE.legalName}. {t.footer.rights}
          </p>
          <LanguageToggle variant="footer" />
        </div>
      </footer>
    </div>
  );
}
