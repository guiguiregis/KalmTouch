"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import BodyMap, { type BodyMapHandle } from "@/app/body-map";
import type { BodyRegionSelection } from "@/lib/intake/regions";
import { formatMessage } from "@/lib/i18n/messages";
import { useLocale } from "@/lib/i18n/locale-provider";

const inputClass =
  "w-full rounded-md border border-stone bg-white/80 px-4 py-3 text-foreground outline-none transition focus:border-accent";

const textareaClass = `${inputClass} min-h-24 resize-y`;

export type IntakeBookingContext = {
  eventId: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  serviceName: string;
  appointmentStart: string;
  appointmentLabel: string;
  bookingSuccessMessage: string;
};

type IntakeFormProps = {
  booking: IntakeBookingContext;
  onComplete: (message: string) => void;
};

export default function IntakeForm({ booking, onComplete }: IntakeFormProps) {
  const { locale, t } = useLocale();
  const copy = t.intake;

  const [bodyRegions, setBodyRegions] = useState<BodyRegionSelection[]>([]);
  const [painPoints, setPainPoints] = useState("");
  const [healthIssues, setHealthIssues] = useState("");
  const [allergies, setAllergies] = useState("");
  const [scentTolerance, setScentTolerance] = useState("");
  const [occupation, setOccupation] = useState("");
  const [sports, setSports] = useState("");
  const [recentSurgery, setRecentSurgery] = useState("");
  const [surgeryDetails, setSurgeryDetails] = useState("");
  const [pregnancy, setPregnancy] = useState("");
  const [pregnancyDuration, setPregnancyDuration] = useState("");
  const [recentMassage, setRecentMassage] = useState("");
  const [recentMassageWhen, setRecentMassageWhen] = useState("");
  const [recentMassageAreas, setRecentMassageAreas] = useState("");
  const [medication, setMedication] = useState("");
  const [other, setOther] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bodyMapRef = useRef<BodyMapHandle>(null);

  async function send(skipped: boolean) {
    setSubmitting(true);
    setError(null);

    let bodyMapImage: string | undefined;
    if (!skipped && bodyRegions.length > 0) {
      try {
        bodyMapImage =
          (await bodyMapRef.current?.capturePng()) ?? undefined;
      } catch {
        bodyMapImage = undefined;
      }
    }

    const payload = skipped
      ? {
          eventId: booking.eventId,
          name: booking.name,
          email: booking.email,
          address: booking.address,
          phone: booking.phone,
          serviceName: booking.serviceName,
          appointmentStart: booking.appointmentStart,
          locale,
          bodyRegions: [] as BodyRegionSelection[],
          skipped: true,
        }
      : {
          eventId: booking.eventId,
          name: booking.name,
          email: booking.email,
          address: booking.address,
          phone: booking.phone,
          serviceName: booking.serviceName,
          appointmentStart: booking.appointmentStart,
          locale,
          bodyRegions,
          bodyMapImage,
          painPoints,
          healthIssues,
          allergies,
          scentTolerance,
          occupation,
          sports,
          recentSurgery,
          surgeryDetails,
          pregnancy,
          pregnancyDuration,
          recentMassage,
          recentMassageWhen,
          recentMassageAreas,
          medication,
          other,
          skipped: false,
        };

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        error?: string;
        intake?: { emailedCopy?: boolean };
      };

      if (!response.ok) {
        setError(data.error || copy.failedRetry);
        return;
      }

      const intakeSuccess = data.intake?.emailedCopy
        ? copy.successEmailed
        : copy.success;
      onComplete(`${booking.bookingSuccessMessage} ${intakeSuccess}`);
    } catch {
      setError(copy.failedRetry);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div id="book" className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-accent-deep">{booking.bookingSuccessMessage}</p>
        <h3 className="font-display text-2xl text-foreground">{copy.title}</h3>
        <p className="text-muted">{copy.intro}</p>
        <p className="text-sm text-muted">
          {formatMessage(copy.bookingSummary, {
            label: booking.appointmentLabel || booking.serviceName,
          })}
        </p>
        <p className="text-sm text-muted">
          {copy.consent}{" "}
          <Link
            href="/privacy"
            className="font-medium text-accent hover:text-accent-deep"
          >
            {copy.privacyLink}
          </Link>
          .
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          {t.booking.name}
          <input className={inputClass} value={booking.name} readOnly />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          {t.booking.email}
          <input className={inputClass} value={booking.email} readOnly />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium sm:col-span-2">
          {t.booking.address}
          <input className={inputClass} value={booking.address} readOnly />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          {t.booking.phone}
          <input className={inputClass} value={booking.phone} readOnly />
        </label>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-foreground">
          {copy.bodyMap}
        </legend>
        <BodyMap
          ref={bodyMapRef}
          value={bodyRegions}
          onChange={setBodyRegions}
          frontLabel={copy.front}
          backLabel={copy.back}
          legendFocus={copy.legendFocus}
          legendAvoid={copy.legendAvoid}
          legendHint={copy.legendHint}
        />
      </fieldset>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        {copy.painPoints}
        <textarea
          className={textareaClass}
          value={painPoints}
          onChange={(e) => setPainPoints(e.target.value)}
          placeholder={copy.painPointsPlaceholder}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        {copy.healthIssues}
        <textarea
          className={textareaClass}
          value={healthIssues}
          onChange={(e) => setHealthIssues(e.target.value)}
          placeholder={copy.healthIssuesPlaceholder}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        {copy.allergies}
        <textarea
          className={textareaClass}
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          placeholder={copy.allergiesPlaceholder}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        {copy.scentTolerance}
        <textarea
          className={textareaClass}
          value={scentTolerance}
          onChange={(e) => setScentTolerance(e.target.value)}
          placeholder={copy.scentTolerancePlaceholder}
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          {copy.occupation}
          <input
            className={inputClass}
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            placeholder={copy.occupationPlaceholder}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          {copy.sports}
          <input
            className={inputClass}
            value={sports}
            onChange={(e) => setSports(e.target.value)}
            placeholder={copy.sportsPlaceholder}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          {copy.recentSurgery}
          <input
            className={inputClass}
            value={recentSurgery}
            onChange={(e) => setRecentSurgery(e.target.value)}
            placeholder={copy.recentSurgeryPlaceholder}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          {copy.surgeryDetails}
          <input
            className={inputClass}
            value={surgeryDetails}
            onChange={(e) => setSurgeryDetails(e.target.value)}
            placeholder={copy.surgeryDetailsPlaceholder}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          {copy.pregnancy}
          <input
            className={inputClass}
            value={pregnancy}
            onChange={(e) => setPregnancy(e.target.value)}
            placeholder={copy.pregnancyPlaceholder}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          {copy.pregnancyDuration}
          <input
            className={inputClass}
            value={pregnancyDuration}
            onChange={(e) => setPregnancyDuration(e.target.value)}
            placeholder={copy.pregnancyDurationPlaceholder}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          {copy.recentMassage}
          <input
            className={inputClass}
            value={recentMassage}
            onChange={(e) => setRecentMassage(e.target.value)}
            placeholder={copy.recentMassagePlaceholder}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          {copy.recentMassageWhen}
          <input
            className={inputClass}
            value={recentMassageWhen}
            onChange={(e) => setRecentMassageWhen(e.target.value)}
            placeholder={copy.recentMassageWhenPlaceholder}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        {copy.recentMassageAreas}
        <textarea
          className={textareaClass}
          value={recentMassageAreas}
          onChange={(e) => setRecentMassageAreas(e.target.value)}
          placeholder={copy.recentMassageAreasPlaceholder}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        {copy.medication}
        <textarea
          className={textareaClass}
          value={medication}
          onChange={(e) => setMedication(e.target.value)}
          placeholder={copy.medicationPlaceholder}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        {copy.other}
        <textarea
          className={textareaClass}
          value={other}
          onChange={(e) => setOther(e.target.value)}
          placeholder={copy.otherPlaceholder}
        />
      </label>

      {error ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            disabled={submitting}
            onClick={() =>
              onComplete(`${booking.bookingSuccessMessage} ${copy.failedRetry}`)
            }
            className="w-fit rounded-md border border-stone bg-white/80 px-6 py-3 text-sm font-medium text-foreground transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {copy.continueAnyway}
          </button>
        </div>
      ) : null}

      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={submitting}
          onClick={() => void send(false)}
          className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? copy.submitting : copy.submit}
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={() => void send(true)}
          className="rounded-md border border-stone bg-white/80 px-6 py-3 text-sm font-medium text-foreground transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {copy.skip}
        </button>
      </div>
    </div>
  );
}
