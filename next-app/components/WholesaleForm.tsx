"use client";

import { useState, useEffect } from "react";

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
};

export default function WholesaleForm({ onStepChange }: WholesaleFormProps) {
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
    if (!form.company.trim()) next.company = "事業者名を入力してください。";
    if (!form.lastName.trim()) next.lastName = "姓を入力してください。";
    if (!form.firstName.trim()) next.firstName = "名を入力してください。";
    if (!form.phone.trim()) next.phone = "電話番号を入力してください。";
    if (!form.email.trim()) {
      next.email = "メールアドレスを入力してください。";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "メールアドレスの形式が正しくありません。";
    }
    if (!form.message.trim()) next.message = "お問い合わせ内容を入力してください。";
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
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send");
      setStep("done");
    } catch (err) {
      console.error(err);
      setSendError("送信中にエラーが発生しました。お手数ですが、時間をおいて再度お試しください。");
    } finally {
      setSending(false);
    }
  };

  const fieldClass = (key: keyof FormState) =>
    `w-full rounded border px-3 py-2 text-[0.9375rem] outline-none transition-colors ${
      errors[key] ? "border-red-400" : "border-border focus:border-tea-deep"
    }`;

  const labelRequired = (
    <span className="text-[0.75rem] text-tea-deep">（必須）</span>
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
            お問い合わせフォーム
          </h2>
          <p className="mb-6 text-[0.9375rem] leading-relaxed text-ink-muted">
            パートナー募集に関するご相談は、下記フォームよりお送りください。
          </p>

          <form noValidate onSubmit={handleConfirm} className="space-y-5">
            <div>
              <label htmlFor="company" className="mb-1 block text-[0.875rem] font-semibold text-ink">
                事業者名 {labelRequired}
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
                部署名
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
                  名前（姓） {labelRequired}
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
                  名前（名） {labelRequired}
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
                電話番号 {labelRequired}
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
                メールアドレス {labelRequired}
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
                お問い合わせ内容 {labelRequired}
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

            <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-muted">
              icloud.com, me.com, mac.comなどのアドレスをご利用の場合、当方からの返信メールが届かない場合がございます。
              なるべく他のメールアドレスをご利用いただくか、@108teaworks.comからのメールを受信許可に設定してください。
            </p>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded bg-tea-deep px-6 py-2 text-[0.9375rem] font-medium text-cream transition-colors hover:bg-tea focus:outline-none focus:ring-2 focus:ring-tea-light focus:ring-offset-2 focus:ring-offset-cream"
              >
                確認する
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
            入力内容の確認
          </h2>
          <p className="mb-4 text-[0.875rem] text-ink-muted">
            入力内容をご確認ください。修正する場合は「戻る」を、送信する場合は「送信する」を押してください。
          </p>

          <div>
            <div className="text-[0.8125rem] font-semibold text-tea-deep">事業者名</div>
            <p className="mt-1 mb-0 whitespace-pre-wrap break-words">{form.company}</p>
          </div>
          {form.department && (
            <div>
              <div className="text-[0.8125rem] font-semibold text-tea-deep">部署名</div>
              <p className="mt-1 mb-0">{form.department}</p>
            </div>
          )}
          <div>
            <div className="text-[0.8125rem] font-semibold text-tea-deep">名前</div>
            <p className="mt-1 mb-0">{form.lastName} {form.firstName}</p>
          </div>
          <div>
            <div className="text-[0.8125rem] font-semibold text-tea-deep">電話番号</div>
            <p className="mt-1 mb-0 break-all">{form.phone}</p>
          </div>
          <div>
            <div className="text-[0.8125rem] font-semibold text-tea-deep">メールアドレス</div>
            <p className="mt-1 mb-0 break-all">{form.email}</p>
          </div>
          <div>
            <div className="text-[0.8125rem] font-semibold text-tea-deep">お問い合わせ内容</div>
            <p className="mt-1 mb-0 whitespace-pre-wrap break-words">{form.message}</p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center justify-center rounded border border-border bg-white px-5 py-2 text-[0.875rem] text-ink hover:border-tea-deep hover:text-tea-deep"
            >
              戻る
            </button>
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center justify-center rounded bg-tea-deep px-6 py-2 text-[0.9375rem] font-medium text-cream transition-colors hover:bg-tea focus:outline-none focus:ring-2 focus:ring-tea-light focus:ring-offset-2 focus:ring-offset-washi disabled:opacity-70"
            >
              {sending ? "送信中..." : "送信する"}
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
            送信完了
          </h2>
          <p className="mb-2">
            パートナー募集フォームよりお問い合わせいただき、ありがとうございます。
          </p>
          <p className="mb-0 text-[0.875rem] text-ink-muted">
            内容を確認のうえ、通常2〜3営業日以内にご返信させていただきます。
            しばらく経っても返信が届かない場合は、迷惑メールフォルダをご確認いただくか、別のメールアドレスにて再度お問い合わせください。
          </p>
        </div>
      )}
    </section>
  );
}
