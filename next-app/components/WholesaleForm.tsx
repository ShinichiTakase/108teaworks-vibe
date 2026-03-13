"use client";

import { useState, useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import { WHOLESALE_FORM_TEXTS } from "@/lib/wholesaleTexts";

type FormState = {
  company: string;
  department: string;
  lastName: string;
  firstName: string;
  phone: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export type WholesaleFormStep = "form" | "confirm" | "done";

const INITIAL_STATE: FormState = {
  company: "",
  department: "",
  lastName: "",
  firstName: "",
  phone: "",
  email: "",
  message: "",
};

type WholesaleFormProps = {
  onStepChange?: (step: WholesaleFormStep) => void;
  locale?: Locale;
};

export default function WholesaleForm({ onStepChange, locale: localeProp }: WholesaleFormProps) {
  const locale = localeProp ?? "ja";
  const ft = WHOLESALE_FORM_TEXTS[locale];
  const [step, setStep] = useState<WholesaleFormStep>("form");
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
    if (!form.company.trim()) next.company = ft.errCompany;
    if (!form.lastName.trim()) next.lastName = ft.errLastName;
    if (!form.firstName.trim()) next.firstName = ft.errFirstName;
    if (!form.phone.trim()) next.phone = ft.errPhone;
    if (!form.email.trim()) {
      next.email = ft.errEmail;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = ft.errEmailInvalid;
    }
    if (!form.message.trim()) next.message = ft.errMessage;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStep("confirm");
  };

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  const handleBack = () => setStep("form");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendError(null);
    setSending(true);
    try {
      const res = await fetch("/api/wholesale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setStep("done");
    } catch (err) {
      console.error(err);
      setSendError(ft.sendError);
    } finally {
      setSending(false);
    }
  };

  const fieldClass = (key: keyof FormState) =>
    `w-full rounded border px-3 py-2 text-[0.9375rem] outline-none transition-colors ${
      errors[key] ? "border-red-400" : "border-border focus:border-tea-deep"
    }`;

  const labelRequired = (
    <span className="text-[0.75rem] text-tea-deep"> {ft.required}</span>
  );

  return (
    <section
      aria-labelledby="wholesale-form-heading"
      className="mb-12 max-w-3xl"
    >
      {step === "form" && (
        <>
          <h2
            id="wholesale-form-heading"
            className="m-0 mb-4 font-heading text-lg font-semibold text-tea-deep"
          >
            {ft.formHeading}
          </h2>
          <p className="mb-6 text-[0.9375rem] leading-relaxed text-ink-muted">
            {ft.formIntro}
          </p>

          <form noValidate onSubmit={handleConfirm} className="space-y-5">
            <div>
              <label htmlFor="company" className="mb-1 block text-[0.875rem] font-semibold text-ink">
                {ft.company}{labelRequired}
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={form.company}
                onChange={handleChange("company")}
                className={fieldClass("company")}
              />
              {errors.company && (
                <p className="mt-1 text-[0.75rem] text-red-500">{errors.company}</p>
              )}
            </div>

            <div>
              <label htmlFor="department" className="mb-1 block text-[0.875rem] font-semibold text-ink">
                {ft.department}
              </label>
              <input
                id="department"
                name="department"
                type="text"
                value={form.department}
                onChange={handleChange("department")}
                className={fieldClass("department")}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="lastName" className="mb-1 block text-[0.875rem] font-semibold text-ink">
                  {ft.lastName}{labelRequired}
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange("lastName")}
                  className={fieldClass("lastName")}
                />
                {errors.lastName && (
                  <p className="mt-1 text-[0.75rem] text-red-500">{errors.lastName}</p>
                )}
              </div>
              <div>
                <label htmlFor="firstName" className="mb-1 block text-[0.875rem] font-semibold text-ink">
                  {ft.firstName}{labelRequired}
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange("firstName")}
                  className={fieldClass("firstName")}
                />
                {errors.firstName && (
                  <p className="mt-1 text-[0.75rem] text-red-500">{errors.firstName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="mb-1 block text-[0.875rem] font-semibold text-ink">
                {ft.phone}{labelRequired}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange("phone")}
                className={fieldClass("phone")}
              />
              {errors.phone && (
                <p className="mt-1 text-[0.75rem] text-red-500">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-[0.875rem] font-semibold text-ink">
                {ft.email}{labelRequired}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                className={fieldClass("email")}
              />
              {errors.email && (
                <p className="mt-1 text-[0.75rem] text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="mb-1 block text-[0.875rem] font-semibold text-ink">
                {ft.message}{labelRequired}
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={form.message}
                onChange={handleChange("message")}
                className={`${fieldClass("message")} leading-relaxed`}
              />
              {errors.message && (
                <p className="mt-1 text-[0.75rem] text-red-500">{errors.message}</p>
              )}
            </div>

            {ft.emailNote && (
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-muted">
                {ft.emailNote}
              </p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded bg-tea-deep px-6 py-2 text-[0.9375rem] font-medium text-cream transition-colors hover:bg-tea focus:outline-none focus:ring-2 focus:ring-tea-light focus:ring-offset-2 focus:ring-offset-cream"
              >
                {ft.confirmButton}
              </button>
            </div>
          </form>
        </>
      )}

      {step === "confirm" && (
        <form
          aria-labelledby="wholesale-form-heading"
          onSubmit={handleSubmit}
          className="mt-0 space-y-5 rounded-md bg-washi px-4 py-4 text-[0.9375rem] leading-relaxed text-ink md:px-6 md:py-5"
        >
          <h2
            id="wholesale-form-heading"
            className="m-0 mb-2 font-heading text-lg font-semibold text-tea-deep"
          >
            {ft.confirm}
          </h2>
          <p className="mb-4 text-[0.875rem] text-ink-muted">
            {ft.confirmIntro}
          </p>

          <div>
            <div className="text-[0.8125rem] font-semibold text-tea-deep">{ft.company}</div>
            <p className="mt-1 mb-0 whitespace-pre-wrap break-words">{form.company}</p>
          </div>
          {form.department && (
            <div>
              <div className="text-[0.8125rem] font-semibold text-tea-deep">{ft.department}</div>
              <p className="mt-1 mb-0">{form.department}</p>
            </div>
          )}
          <div>
            <div className="text-[0.8125rem] font-semibold text-tea-deep">{locale === "ja" ? "名前" : locale === "en" ? "Name" : locale === "ko" ? "이름" : "姓名"}</div>
            <p className="mt-1 mb-0">{form.lastName} {form.firstName}</p>
          </div>
          <div>
            <div className="text-[0.8125rem] font-semibold text-tea-deep">{ft.phone}</div>
            <p className="mt-1 mb-0 break-all">{form.phone}</p>
          </div>
          <div>
            <div className="text-[0.8125rem] font-semibold text-tea-deep">{ft.email}</div>
            <p className="mt-1 mb-0 break-all">{form.email}</p>
          </div>
          <div>
            <div className="text-[0.8125rem] font-semibold text-tea-deep">{ft.message}</div>
            <p className="mt-1 mb-0 whitespace-pre-wrap break-words">{form.message}</p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center justify-center rounded border border-border bg-white px-5 py-2 text-[0.875rem] text-ink hover:border-tea-deep hover:text-tea-deep"
            >
              {ft.back}
            </button>
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center justify-center rounded bg-tea-deep px-6 py-2 text-[0.9375rem] font-medium text-cream transition-colors hover:bg-tea focus:outline-none focus:ring-2 focus:ring-tea-light focus:ring-offset-2 focus:ring-offset-washi disabled:opacity-70"
            >
              {sending ? ft.sending : ft.submit}
            </button>
          </div>
          {sendError && (
            <p className="mt-2 text-[0.8125rem] text-red-500">{sendError}</p>
          )}
        </form>
      )}

      {step === "done" && (
        <div className="mt-0 rounded-md bg-washi px-4 py-4 text-[0.9375rem] leading-relaxed text-ink md:px-6 md:py-5">
          <h2
            id="wholesale-form-heading"
            className="m-0 mb-3 font-heading text-xl font-semibold text-tea-deep"
          >
            {ft.doneTitle}
          </h2>
          <p className="mb-2">
            {ft.doneThanks}
          </p>
          <p className="mb-0 text-[0.875rem] text-ink-muted">
            {ft.doneNote}
          </p>
        </div>
      )}
    </section>
  );
}
