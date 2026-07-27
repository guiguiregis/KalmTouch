"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/locale-provider";

const inputClass =
  "w-full rounded-md border border-stone bg-white/80 px-4 py-3 text-foreground outline-none transition focus:border-accent";

export default function ContactForm() {
  const { t } = useLocale();
  const copy = t.contactForm;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error || copy.sendFailed);
        return;
      }

      setSuccess(copy.sent);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setError(copy.sendFailedRetry);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
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
          {copy.subject}
        </span>
        <input
          className={inputClass}
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          type="text"
          required
          placeholder={copy.subjectPlaceholder}
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-foreground">
          {copy.message}
        </span>
        <textarea
          className={`${inputClass} resize-y`}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
          rows={5}
          placeholder={copy.messagePlaceholder}
        />
      </label>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {success ? <p className="text-sm text-accent-deep">{success}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? copy.sending : copy.send}
      </button>
    </form>
  );
}
