"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BOOKING_SERVICES,
  BOOKING_TIMEZONE,
  BOOKING_WINDOW_DAYS,
  getServiceById,
  type BookingMode,
} from "@/lib/calendar/config";
import SelectDropdown from "@/app/select-dropdown";
import { SELECT_SERVICE_EVENT } from "@/app/book-service-link";
import { formatMessage } from "@/lib/i18n/messages";
import { useLocale } from "@/lib/i18n/locale-provider";
import { SITE } from "@/lib/site";

type Slot = {
  start: string;
  end: string;
  date: string;
  time: string;
  label: string;
};

type AvailabilityResponse = {
  configured?: boolean;
  slots?: Slot[];
  onDemand?: Slot[];
  error?: string;
};

const inputClass =
  "w-full rounded-md border border-stone bg-white/80 px-4 py-3 text-foreground outline-none transition focus:border-accent";

function todayInBookingZone() {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: BOOKING_TIMEZONE,
  });
}

function addDaysToYmd(ymd: string, days: number) {
  const [year, month, day] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

function SectionToggle({
  label,
  open,
  onToggle,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="mb-2 flex w-full items-center justify-between gap-2 text-left text-sm font-medium text-foreground"
    >
      {label}
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className={`size-4 shrink-0 text-muted transition-transform duration-200 ${
          open ? "rotate-180" : ""
        }`}
      >
        <path
          d="M5 7.5 10 12.5 15 7.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default function BookingForm() {
  const { locale, t } = useLocale();
  const copy = t.booking;
  const dateLocale = locale === "fr" ? "fr-CA" : "en-US";

  const [regularSlots, setRegularSlots] = useState<Slot[]>([]);
  const [onDemandSlots, setOnDemandSlots] = useState<Slot[]>([]);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [mode, setMode] = useState<BookingMode>("regular");
  const [serviceId, setServiceId] = useState<string>(BOOKING_SERVICES[0].id);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStart, setSelectedStart] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [dateUnavailable, setDateUnavailable] = useState(false);
  const [dateOpen, setDateOpen] = useState(true);
  const [timeOpen, setTimeOpen] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  async function loadAvailability() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/availability");
      const data = (await response.json()) as AvailabilityResponse;
      setConfigured(data.configured !== false);
      setRegularSlots(data.slots ?? []);
      setOnDemandSlots(data.onDemand ?? []);
      if (!response.ok && data.error) {
        setError(data.error);
      }
    } catch {
      setError(copy.loadTimesFailed);
      setRegularSlots([]);
      setOnDemandSlots([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAvailability();
    // Load once on mount; later refreshes go through loadAvailability().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function onSelectService(event: Event) {
      const serviceId = (event as CustomEvent<{ serviceId?: string }>).detail
        ?.serviceId;
      if (serviceId && getServiceById(serviceId)) {
        setServiceId(serviceId);
      }
    }

    window.addEventListener(SELECT_SERVICE_EVENT, onSelectService);
    return () => {
      window.removeEventListener(SELECT_SERVICE_EVENT, onSelectService);
    };
  }, []);

  const slots = mode === "regular" ? regularSlots : onDemandSlots;

  const dates = useMemo(() => {
    return [...new Set(slots.map((slot) => slot.date))];
  }, [slots]);

  const timesForDate = useMemo(() => {
    if (!selectedDate) return [];
    return slots.filter((slot) => slot.date === selectedDate);
  }, [slots, selectedDate]);

  useEffect(() => {
    setSelectedDate("");
    setSelectedStart("");
    setDateInput("");
    setDateUnavailable(false);
  }, [mode]);

  const minDate = useMemo(() => todayInBookingZone(), []);
  const maxDate = useMemo(
    () => addDaysToYmd(minDate, BOOKING_WINDOW_DAYS - 1),
    [minDate],
  );

  function selectDate(date: string) {
    setSelectedDate(date);
    setSelectedStart("");
    setDateInput(date);
    setDateUnavailable(false);
  }

  function onDateInputChange(value: string) {
    setDateInput(value);
    if (!value) {
      setDateUnavailable(false);
      return;
    }
    if (dates.includes(value)) {
      setSelectedDate(value);
      setSelectedStart("");
      setDateUnavailable(false);
    } else {
      setDateUnavailable(true);
    }
  }

  useEffect(() => {
    if (selectedDate && !dates.includes(selectedDate)) {
      setSelectedDate("");
      setSelectedStart("");
      setDateInput("");
      setDateUnavailable(false);
    }
  }, [dates, selectedDate]);

  useEffect(() => {
    if (
      selectedStart &&
      !timesForDate.some((slot) => slot.start === selectedStart)
    ) {
      setSelectedStart("");
    }
  }, [timesForDate, selectedStart]);

  function resetBooking() {
    setMode("regular");
    setServiceId(BOOKING_SERVICES[0].id);
    setSelectedDate("");
    setSelectedStart("");
    setDateInput("");
    setDateUnavailable(false);
    setName("");
    setEmail("");
    setAddress("");
    setPhone("");
    setNotes("");
    setError(null);
    setSuccess(null);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedStart) {
      setError(
        mode === "on-demand"
          ? copy.choosePreferredTime
          : copy.chooseAvailableTime,
      );
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          serviceId,
          start: selectedStart,
          name,
          email,
          address,
          phone,
          notes: notes || undefined,
        }),
      });
      const data = (await response.json()) as {
        error?: string;
        booking?: { serviceName: string; start: string; mode: BookingMode };
      };

      if (!response.ok) {
        setError(data.error || copy.bookingFailed);
        if (response.status === 409) {
          await loadAvailability();
          setSelectedStart("");
        }
        return;
      }

      const booked = slots.find((slot) => slot.start === selectedStart);
      const serviceLabel =
        t.serviceDetails[serviceId]?.name ??
        data.booking?.serviceName ??
        copy.bookedYourSession;

      if (mode === "on-demand") {
        const prefix = booked
          ? formatMessage(copy.requestSentFor, { label: booked.label })
          : copy.requestSent;
        setSuccess(
          `${prefix}. ${formatMessage(copy.confirmEmail, { email })}`,
        );
      } else {
        setSuccess(
          `${formatMessage(copy.booked, { service: serviceLabel })}${
            booked ? ` — ${booked.label}` : ""
          }. ${formatMessage(copy.inviteOnWay, { email })}`,
        );
      }
      setName("");
      setEmail("");
      setAddress("");
      setPhone("");
      setNotes("");
      setSelectedStart("");
      await loadAvailability();
    } catch {
      setError(copy.bookingFailedRetry);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div id="book" className="flex flex-col gap-3 text-muted">
        <p>{copy.loading}</p>
      </div>
    );
  }

  if (!configured) {
    const parts = copy.notConfigured.split(/\{email\}|\{phone\}/);
    return (
      <div id="book" className="flex flex-col gap-4">
        <p className="text-muted">
          {parts[0]}
          <a
            href={`mailto:${SITE.email}`}
            className="font-medium text-accent hover:text-accent-deep"
          >
            {SITE.email}
          </a>
          {parts[1]}
          <a
            href={`tel:${SITE.phoneE164}`}
            className="font-medium text-accent hover:text-accent-deep"
          >
            {SITE.phoneDisplay}
          </a>
          {parts[2]}
        </p>
      </div>
    );
  }

  const modeButtonClass = (active: boolean) =>
    `rounded-md border px-3 py-2.5 text-sm transition max-[786px]:px-2.5 max-[786px]:py-2 max-[786px]:text-xs max-[336px]:px-2 max-[336px]:py-1.5 max-[336px]:text-[11px] ${
      active
        ? "border-accent bg-accent text-white"
        : "border-stone bg-white/80 text-foreground hover:border-accent"
    }`;

  const selectedService = getServiceById(serviceId);
  const selectedServiceCopy = selectedService
    ? t.serviceDetails[selectedService.id]
    : undefined;

  return (
    <form id="book" className="flex flex-col gap-4" onSubmit={onSubmit}>
      <fieldset className="block">
        <legend className="mb-2 block text-sm font-medium text-foreground">
          {copy.schedule}
        </legend>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={modeButtonClass(mode === "regular")}
            onClick={() => setMode("regular")}
          >
            {copy.regular}
          </button>
          <button
            type="button"
            className={modeButtonClass(mode === "on-demand")}
            onClick={() => setMode("on-demand")}
          >
            {copy.onDemand}
          </button>
        </div>
        <p className="mt-2 text-sm text-muted">
          {mode === "regular" ? copy.regularHint : copy.onDemandHint}
        </p>
      </fieldset>

      <div>
        <SelectDropdown
          label={copy.service}
          value={serviceId}
          onChange={setServiceId}
          options={BOOKING_SERVICES.map((service) => ({
            value: service.id,
            label: t.serviceDetails[service.id]?.name ?? service.name,
            description: formatMessage(t.services.duration, {
              minutes: service.duration,
            }),
          }))}
        />
        {selectedServiceCopy ? (
          <p className="mt-2 text-sm text-muted">
            {selectedServiceCopy.detail}{" "}
            <a
              href="#contact"
              className="font-medium text-accent hover:text-accent-deep"
            >
              {t.services.getInTouch}
            </a>{" "}
            {copy.serviceMore}
          </p>
        ) : null}
      </div>

      <div>
        <SectionToggle
          label={copy.date}
          open={dateOpen}
          onToggle={() => setDateOpen((prev) => !prev)}
        />
        {dateOpen ? (
          <div className="flex flex-col gap-3">
            {dates.length === 0 ? (
              <p className="text-sm text-muted">{copy.noDates}</p>
            ) : (
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {dates.map((date) => {
                  const selected = selectedDate === date;
                  const day = new Date(`${date}T12:00:00Z`);
                  return (
                    <button
                      key={date}
                      type="button"
                      onClick={() => selectDate(date)}
                      className={`rounded-md border px-2 py-1.5 text-left transition sm:px-3 sm:py-2.5 ${
                        selected
                          ? "border-accent bg-accent text-white"
                          : "border-stone bg-white/80 text-foreground hover:border-accent"
                      }`}
                    >
                      <span className="block text-xs font-medium sm:text-sm">
                        {new Intl.DateTimeFormat(dateLocale, {
                          weekday: "short",
                          timeZone: "UTC",
                        }).format(day)}
                      </span>
                      <span
                        className={`block text-[11px] sm:text-xs ${
                          selected ? "text-white/85" : "text-muted"
                        }`}
                      >
                        {new Intl.DateTimeFormat(dateLocale, {
                          month: "short",
                          day: "numeric",
                          timeZone: "UTC",
                        }).format(day)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex items-center gap-3">
              <span className="shrink-0 text-sm text-muted">{copy.or}</span>
              <input
                type="date"
                className={inputClass}
                value={dateInput}
                min={minDate}
                max={maxDate}
                onChange={(event) => onDateInputChange(event.target.value)}
                aria-label={copy.enterDate}
              />
            </div>
            {dateUnavailable ? (
              <p className="text-sm text-red-700">{copy.unavailable}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div>
        <SectionToggle
          label={mode === "on-demand" ? copy.preferredTime : copy.time}
          open={timeOpen}
          onToggle={() => setTimeOpen((prev) => !prev)}
        />
        {timeOpen ? (
          timesForDate.length === 0 ? (
            <p className="text-sm text-muted">
              {mode === "on-demand" ? copy.noWeekendTimes : copy.noSlots}
            </p>
          ) : (
            <div
              className={`grid gap-2 ${
                mode === "on-demand"
                  ? "grid-cols-3 sm:grid-cols-4"
                  : "grid-cols-3"
              }`}
            >
              {timesForDate.map((slot) => {
                const selected = selectedStart === slot.start;
                return (
                  <button
                    key={slot.start}
                    type="button"
                    onClick={() => setSelectedStart(slot.start)}
                    className={`rounded-md border px-3 py-2.5 text-sm transition ${
                      selected
                        ? "border-accent bg-accent text-white"
                        : "border-stone bg-white/80 text-foreground hover:border-accent"
                    }`}
                  >
                    {new Intl.DateTimeFormat(dateLocale, {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: locale !== "fr",
                      timeZone: "America/Toronto",
                    }).format(new Date(slot.start))}
                  </button>
                );
              })}
            </div>
          )
        ) : null}
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-foreground">
          {copy.name}
        </span>
        <input
          className={inputClass}
          value={name}
          onChange={(event) => setName(event.target.value)}
          type="text"
          required
          autoComplete="name"
          placeholder={copy.namePlaceholder}
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-foreground">
          {copy.email}
        </span>
        <input
          className={inputClass}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          required
          autoComplete="email"
          placeholder={copy.emailPlaceholder}
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-foreground">
          {copy.address}
        </span>
        <input
          className={inputClass}
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          type="text"
          required
          minLength={8}
          autoComplete="street-address"
          placeholder={copy.addressPlaceholder}
        />
        <span className="mt-1.5 block text-sm text-muted">{copy.addressHint}</span>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-foreground">
          {copy.phone}
        </span>
        <input
          className={inputClass}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          type="tel"
          required
          autoComplete="tel"
          placeholder={copy.phonePlaceholder}
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-foreground">
          {copy.notes}{" "}
          <span className="font-normal text-muted">{copy.notesOptional}</span>
        </span>
        <textarea
          className={`${inputClass} min-h-[88px] resize-y`}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder={copy.notesPlaceholder}
        />
      </label>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {success ? <p className="text-sm text-accent-deep">{success}</p> : null}

      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <button
          type="submit"
          disabled={submitting || dates.length === 0}
          className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? mode === "on-demand"
              ? copy.sendingRequest
              : copy.booking
            : mode === "on-demand"
              ? copy.requestWeekend
              : copy.bookAppointment}
        </button>
        <button
          type="button"
          onClick={resetBooking}
          disabled={submitting}
          className="rounded-md border border-stone bg-white/80 px-6 py-3 text-sm font-medium text-foreground transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {copy.reset}
        </button>
      </div>

      <p className="text-sm text-muted">
        {copy.orCall}{" "}
        <a
          href={`tel:${SITE.phoneE164}`}
          className="font-medium text-accent hover:text-accent-deep"
        >
          {SITE.phoneDisplay}
        </a>
      </p>
    </form>
  );
}
