import Image from "next/image";

const services = [
  {
    name: "Swedish Massage",
    duration: "60 min",
    detail:
      "Long, flowing strokes to ease everyday tension and quiet the nervous system.",
  },
  {
    name: "Deep Tissue",
    duration: "60 min",
    detail:
      "Slower pressure for stubborn knots, posture strain, and lasting tightness.",
  },
  // {
  //   name: "Prenatal Care",
  //   duration: "60 min",
  //   detail:
  //     "Side-lying comfort work designed for pregnancy — gentle, supported, restorative.",
  // },
  // {
  //   name: "Hot Stone Ritual",
  //   duration: "90 min",
  //   detail:
  //     "Warmed stones melt resistance so muscles can soften without force.",
  // },
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="absolute inset-x-0 top-0 z-20">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
          <a href="#top" className="relative block h-14 w-14 shrink-0 md:h-16 md:w-16">
            <Image
              src="/kalm-touch-logo.png"
              alt="KalmTouch"
              fill
              priority
              className="object-contain"
              sizes="64px"
            />
          </a>
          <div className="hidden items-center gap-8 text-sm text-white/85 sm:flex">
            <a href="#services" className="transition-colors hover:text-white">
              Services
            </a>
            <a href="#approach" className="transition-colors hover:text-white">
              Approach
            </a>
            <a href="#visit" className="transition-colors hover:text-white">
              Visit
            </a>
            <a href="#contact" className="transition-colors hover:text-white">
              Contact
            </a>
          </div>
          <a
            href="#book"
            className="rounded-md bg-white/95 px-4 py-2 text-sm font-medium text-accent-deep transition hover:bg-white"
          >
            Book a session
          </a>
        </nav>
      </header>

      <main id="top" className="flex-1">
        {/* Hero — one composition: brand, headline, support, CTA, full-bleed image */}
        <section className="relative min-h-[100svh] overflow-hidden">
          <div className="absolute inset-0 animate-drift">
            <Image
              src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=2400&q=80"
              alt="Calm massage room with soft natural light"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
          <div
            className="absolute inset-0 animate-veil"
            style={{
              background:
                "linear-gradient(105deg, rgba(10,28,36,0.78) 0%, rgba(10,28,36,0.5) 48%, rgba(10,28,36,0.32) 100%)",
            }}
          />
          <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 pb-16 pt-28 md:px-10 md:pb-24">
            <div className="mx-auto w-full max-w-6xl">
              <div className="animate-rise relative h-36 w-36 sm:h-44 sm:w-44 md:h-52 md:w-52">
                <Image
                  src="/kalm-touch-logo.png"
                  alt="KalmTouch"
                  fill
                  priority
                  className="object-contain object-left drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                  sizes="(max-width: 640px) 144px, (max-width: 768px) 176px, 208px"
                />
              </div>
              <h1 className="animate-rise-delay mt-6 max-w-xl font-display text-2xl font-light leading-snug text-white/95 sm:text-3xl md:text-4xl">
                Massage that restores what the day takes away.
              </h1>
              <p className="animate-rise-delay mt-4 max-w-md text-base leading-relaxed text-white/80 md:text-lg">
                An unhurried studio for Swedish, deep tissue, and prenatal
                bodywork — quiet rooms, skilled hands, lasting calm.
              </p>
              <div className="animate-rise-delay-2 mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#book"
                  className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-deep"
                >
                  Book a session
                </a>
                <a
                  href="#services"
                  className="text-sm font-medium text-white/90 underline-offset-4 transition hover:text-white hover:underline"
                >
                  View services
                </a>
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
              Services
            </h2>
            <p className="mt-4 max-w-lg text-muted md:text-lg">
              Each session is tailored in the moment — pressure, pace, and focus
              shaped around what your body needs today.
            </p>
            <ul className="mt-14 divide-y divide-stone/80 border-y border-stone/80">
              {services.map((service) => (
                <li
                  key={service.name}
                  className="grid gap-3 py-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_auto] md:items-baseline md:gap-10"
                >
                  <h3 className="font-display text-2xl text-foreground md:text-3xl">
                    {service.name}
                  </h3>
                  <p className="text-muted leading-relaxed">{service.detail}</p>
                  <p className="text-sm font-medium text-accent md:text-right">
                    {service.duration}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Approach */}
        <section
          id="approach"
          className="bg-surface px-6 py-24 md:px-10 md:py-32"
        >
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div className="relative aspect-[4/5] overflow-hidden md:aspect-[5/6]">
              <Image
                src="https://images.unsplash.com/photo-1519823551278-64ac9274d515?auto=format&fit=crop&w=1400&q=80"
                alt="Hands preparing warm massage oils"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="font-display text-4xl tracking-tight text-foreground md:text-5xl">
                Soft light. Steady hands. No rush.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                KalmTouch was built for people who carry their week in their
                shoulders. We keep sessions simple: a warm room, attentive
                listening, and bodywork that leaves you clearer — not just
                temporarily soothed.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                Whether you arrive wound tight or simply ready to rest, we meet
                you where you are.
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
              "radial-gradient(ellipse at 20% 0%, #b8e0de 0%, transparent 50%), radial-gradient(ellipse at 90% 100%, #cfe8e6 0%, transparent 45%), #f3f7f8",
          }}
        >
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-4xl tracking-tight text-foreground md:text-5xl">
              Visit the studio
            </h2>
            <p className="mt-4 max-w-md text-muted md:text-lg">
              Arrive a few minutes early. Leave your shoes, your phone, and the
              noise of the day at the door.
            </p>

            <div className="mt-14 grid gap-12 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent">
                  Location
                </p>
                <p className="mt-3 text-lg leading-relaxed text-foreground">
                  Ottawa/Gatineau Area
                  <br />
                  On-Site
                </p>
                <p className="mt-6 text-sm font-medium uppercase tracking-[0.14em] text-accent">
                  Hours
                </p>
                <p className="mt-3 text-lg leading-relaxed text-foreground">
                  Mon–Thu · 6:30pm–9:30pm
                  <br />
                  Sat-Sun · Evenings On-Demand
                </p>
              </div>

              <form
                id="book"
                className="flex flex-col gap-4"
                action="mailto:kalmtouch18@gmail.com"
                method="get"
                encType="text/plain"
              >
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-foreground">
                    Name
                  </span>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-md border border-stone bg-white/80 px-4 py-3 text-foreground outline-none transition focus:border-accent"
                    placeholder="Your name"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-foreground">
                    Email
                  </span>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-md border border-stone bg-white/80 px-4 py-3 text-foreground outline-none transition focus:border-accent"
                    placeholder="you@email.com"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-foreground">
                    Preferred service
                  </span>
                  <select
                    name="service"
                    className="w-full rounded-md border border-stone bg-white/80 px-4 py-3 text-foreground outline-none transition focus:border-accent"
                    defaultValue="Swedish Massage"
                  >
                    {services.map((service) => (
                      <option key={service.name} value={service.name}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-foreground">
                    Preferred hour
                  </span>
                  <select
                    name="hour"
                    required
                    className="w-full rounded-md border border-stone bg-white/80 px-4 py-3 text-foreground outline-none transition focus:border-accent"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a time
                    </option>
                    <option value="18:30">6:30 PM</option>
                    <option value="20:00">8:00 PM</option>
                    <option value="21:30">9:30 PM</option>
                  </select>
                </label>
                <button
                  type="submit"
                  className="mt-2 rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-deep"
                >
                  Request an appointment
                </button>
                <p className="text-sm text-muted">
                  Or call{" "}
                  <a
                    href="tel:+15035550142"
                    className="font-medium text-accent hover:text-accent-deep"
                  >
                    (503) 555-0142
                  </a>
                </p>
              </form>
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
              Get in touch
            </h2>
            <p className="mt-4 max-w-md text-muted md:text-lg">
              Questions about a session, gift certificates, or anything else —
              write to us and we&apos;ll reply within a day.
            </p>

            <div className="mt-14 grid gap-12 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent">
                  Email
                </p>
                <a
                  href="mailto:kalmtouch18@gmail.com"
                  className="mt-3 block text-lg font-medium text-foreground transition hover:text-accent"
                >
                  kalmtouch18@gmail.com
                </a>
                <p className="mt-6 text-sm font-medium uppercase tracking-[0.14em] text-accent">
                  Phone
                </p>
                <a
                  href="tel:+15035550142"
                  className="mt-3 block text-lg font-medium text-foreground transition hover:text-accent"
                >
                  (503) 555-0142
                </a>
              </div>

              <form
                className="flex flex-col gap-4"
                action="mailto:kalmtouch18@gmail.com"
                method="get"
                encType="text/plain"
              >
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-foreground">
                    Subject
                  </span>
                  <input
                    name="subject"
                    type="text"
                    required
                    className="w-full rounded-md border border-stone bg-white/80 px-4 py-3 text-foreground outline-none transition focus:border-accent"
                    placeholder="How can we help?"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-foreground">
                    Message
                  </span>
                  <textarea
                    name="body"
                    required
                    rows={5}
                    className="w-full resize-y rounded-md border border-stone bg-white/80 px-4 py-3 text-foreground outline-none transition focus:border-accent"
                    placeholder="Write your message..."
                  />
                </label>
                <button
                  type="submit"
                  className="mt-2 rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-deep"
                >
                  Send email
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone/70 bg-background px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <a href="#top" className="relative block h-16 w-16 shrink-0">
            <Image
              src="/kalm-touch-logo.png"
              alt="KalmTouch"
              fill
              className="object-contain"
              sizes="64px"
            />
          </a>
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} KalmTouch Massage. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
