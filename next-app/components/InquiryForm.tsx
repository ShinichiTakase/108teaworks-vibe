"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { INQUIRY_TEXTS } from "@/lib/inquiryTexts";

type FormState = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
};

type Step = "form" | "confirm" | "done";

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  message: "",
};

type Props = {
  locale?: Locale;
};

export default function InquiryForm({ locale: localeProp }: Props) {
  const locale = localeProp ?? "ja";
  const t = INQUIRY_TEXTS[locale];

  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = t.errName;
    if (!form.email.trim()) {
      next.email = t.errEmail;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = t.errEmailInvalid;
    }
    if (!form.message.trim()) next.message = t.errMessage;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStep("confirm");
  };

  const handleBack = () => setStep("form");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendError(null);
    setSending(true);
    try {
      const res = await fetch("/api/inquery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setStep("done");
    } catch (err) {
      console.error(err);
      setSendError(t.sendError);
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      aria-labelledby="inquiry-heading"
      className="mb-12 max-w-3xl"
    >
      {step === "form" && (
        <>
          <h1
            id="inquiry-heading"
            className="m-0 mb-4 font-heading text-xl font-semibold text-tea-deep"
          >
            {t.heading}
          </h1>
          <p className="mb-6 text-[0.9375rem] leading-relaxed text-ink-muted">
            {t.intro}
          </p>

          <form noValidate onSubmit={handleConfirm} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-[0.875rem] font-semibold text-ink"
              >
                {t.name} <span className="text-[0.75rem] text-tea-deep">{t.required}</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                className={`w-full rounded border px-3 py-2 text-[0.9375rem] outline-none transition-colors ${
                  errors.name ? "border-red-400" : "border-border focus:border-tea-deep"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-[0.75rem] text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-[0.875rem] font-semibold text-ink"
              >
                {t.email} <span className="text-[0.75rem] text-tea-deep">{t.required}</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                className={`w-full rounded border px-3 py-2 text-[0.9375rem] outline-none transition-colors ${
                  errors.email ? "border-red-400" : "border-border focus:border-tea-deep"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-[0.75rem] text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-1 block text-[0.875rem] font-semibold text-ink"
              >
                {t.message} <span className="text-[0.75rem] text-tea-deep">{t.required}</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={form.message}
                onChange={handleChange("message")}
                className={`w-full rounded border px-3 py-2 text-[0.9375rem] leading-relaxed outline-none transition-colors ${
                  errors.message ? "border-red-400" : "border-border focus:border-tea-deep"
                }`}
              />
            {errors.message && (
              <p className="mt-1 text-[0.75rem] text-red-500">{errors.message}</p>
            )}
          </div>

            {t.emailNote && (
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-muted">
                {t.emailNote}
              </p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded bg-tea-deep px-6 py-2 text-[0.9375rem] font-medium text-cream transition-colors hover:bg-tea focus:outline-none focus:ring-2 focus:ring-tea-light focus:ring-offset-2 focus:ring-offset-cream"
              >
                {t.confirmButton}
              </button>
            </div>
          </form>
        </>
      )}

      {step === "confirm" && (
        <form
          aria-labelledby="inquiry-heading"
          onSubmit={handleSubmit}
          className="mt-0 space-y-5 rounded-md bg-washi px-4 py-4 text-[0.9375rem] leading-relaxed text-ink md:px-6 md:py-5"
        >
          <p className="mb-2 text-[0.875rem] text-ink-muted">
            {t.confirmIntro}
          </p>

          <div>
            <div className="text-[0.8125rem] font-semibold text-tea-deep">{t.nameLabel}</div>
            <p className="mt-1 mb-0 whitespace-pre-wrap break-words">{form.name}</p>
          </div>
          <div>
            <div className="text-[0.8125rem] font-semibold text-tea-deep">{t.emailLabel}</div>
            <p className="mt-1 mb-0 break-all">{form.email}</p>
          </div>
          <div>
            <div className="text-[0.8125rem] font-semibold text-tea-deep">{t.messageLabel}</div>
            <p className="mt-1 mb-0 whitespace-pre-wrap break-words">{form.message}</p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center justify-center rounded border border-border bg-white px-5 py-2 text-[0.875rem] text-ink hover:border-tea-deep hover:text-tea-deep"
            >
              {t.back}
            </button>
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center justify-center rounded bg-tea-deep px-6 py-2 text-[0.9375rem] font-medium text-cream transition-colors hover:bg-tea focus:outline-none focus:ring-2 focus:ring-tea-light focus:ring-offset-2 focus:ring-offset-washi"
            >
              {sending ? t.sending : t.submit}
            </button>
          </div>

          {sendError && (
            <p className="mt-2 text-[0.8125rem] text-red-500">{sendError}</p>
          )}
        </form>
      )}

      {step === "done" && (
        <div className="mt-0 rounded-md bg-washi px-4 py-4 text-[0.9375rem] leading-relaxed text-ink md:px-6 md:py-5">
          <h1
            id="inquiry-heading"
            className="m-0 mb-3 font-heading text-xl font-semibold text-tea-deep"
          >
            {t.doneTitle}
          </h1>
          <p className="mb-2">{t.doneThanks}</p>
          <p className="mb-0 text-[0.875rem] text-ink-muted">
            {t.doneNote}
          </p>
        </div>
      )}
    </section>
  );
}
