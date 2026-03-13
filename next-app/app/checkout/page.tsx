"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import type { Locale } from "@/lib/i18n";
import { CHECKOUT_TEXTS } from "@/lib/checkoutTexts";

const FALLBACK_IMAGE = "/images/products/product-01.webp";
const FREE_SHIPPING_THRESHOLD = 20000;
const ZIPCLOUD_API = "https://zipcloud.ibsnet.co.jp/api/search";

const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "";
const stripePromise = loadStripe(STRIPE_PK);

function detectLocaleFromPath(pathname: string | null): Locale {
  if (!pathname) return "ja";
  if (pathname.startsWith("/en")) return "en";
  if (pathname.startsWith("/ko")) return "ko";
  if (pathname.startsWith("/zh")) return "zh";
  return "ja";
}

type ZipcloudResult = {
  address1: string; // 都道府県
  address2: string; // 市区町村
  address3: string; // 町域
};

type SavedCheckoutProfile = {
  billing: {
    name: string;
    email: string;
    phone: string;
    postalCode: string;
    prefecture: string;
    city: string;
    addressLine: string;
  };
  shipToDifferent: boolean;
  shipping?: {
    name: string;
    phone: string;
    postalCode: string;
    prefecture: string;
    city: string;
    addressLine: string;
  };
  giftNoInvoice: boolean;
};

function formatPrice(price: number): string {
  return `¥${Number(price).toLocaleString()}`;
}

function taxIncluded(amount: number): number {
  return Math.floor(amount * 10 / 110);
}

function normalizePostalCode(value: string): string {
  return value.replace(/\D/g, "").slice(0, 7);
}

export default function CheckoutPage() {
  const pathname = usePathname();
  const locale = detectLocaleFromPath(pathname);
  const t = CHECKOUT_TEXTS[locale];
  const homeHref = locale === "ja" ? "/" : `/${locale}`;
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [addressResults, setAddressResults] = useState<ZipcloudResult[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [giftNoInvoice, setGiftNoInvoice] = useState(false);
  const [orderMemo, setOrderMemo] = useState("");
  const [shipToDifferent, setShipToDifferent] = useState(false);
  const [shipName, setShipName] = useState("");
  const [shipPhone, setShipPhone] = useState("");
  const [shipPostalCode, setShipPostalCode] = useState("");
  const [shipPrefecture, setShipPrefecture] = useState("");
  const [shipCity, setShipCity] = useState("");
  const [shipAddressLine, setShipAddressLine] = useState("");
  const [addressResults2, setAddressResults2] = useState<ZipcloudResult[]>([]);
  const [addressLoading2, setAddressLoading2] = useState(false);
  const [addressError2, setAddressError2] = useState<string | null>(null);
  const [shipping, setShipping] = useState<number | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const paymentIntentIdRef = useRef<string | null>(null);
  const [paymentInitError, setPaymentInitError] = useState<string | null>(null);
  const [hasSavedProfile, setHasSavedProfile] = useState(false);
  const [approval, setApproval] = useState(true);

  // Stripe.js を直接扱うための参照（React 再レンダーで壊れないようにする）
  const stripeRef = useRef<any>(null);
  const elementsRef = useRef<any>(null);
  const expressCheckoutRef = useRef<any>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const expressContainerRef = useRef<HTMLDivElement | null>(null);
  const [cardReady, setCardReady] = useState(false);

  const handlePayRef = useRef<null | (() => Promise<void>)>(null);

  const stripeElementsOptions = useMemo(() => {
    if (!clientSecret) return null;
    return {
      clientSecret,
      appearance: { theme: "stripe" as const },
    };
  }, [clientSecret]);

  const zip7 = normalizePostalCode(postalCode);
  const zip7Ship = normalizePostalCode(shipPostalCode);

  const fetchAddress = useCallback(async (code: string) => {
    if (code.length !== 7) {
      setAddressResults([]);
      setAddressError(null);
      return;
    }
    setAddressLoading(true);
    setAddressError(null);
    try {
      const res = await fetch(`${ZIPCLOUD_API}?zipcode=${code}`);
      const data = await res.json();
      if (data.status !== 200 || !Array.isArray(data.results)) {
        setAddressResults([]);
        setAddressError(data.message ?? t.addressNotFound);
        return;
      }
      const list = data.results.map((r: { address1?: string; address2?: string; address3?: string }) => ({
        address1: r.address1 ?? "",
        address2: r.address2 ?? "",
        address3: r.address3 ?? "",
      }));
      setAddressResults(list);
    } catch (e) {
      setAddressResults([]);
      setAddressError(t.addressLookupFailed);
    } finally {
      setAddressLoading(false);
    }
  }, [t.addressLookupFailed, t.addressNotFound]);

  useEffect(() => {
    if (zip7.length === 7) {
      fetchAddress(zip7);
    } else {
      setAddressResults([]);
      setAddressError(null);
    }
  }, [zip7, fetchAddress]);

  const selectAddress = useCallback((r: ZipcloudResult) => {
    setPrefecture(r.address1);
    setCity(r.address2);
    setAddressLine((prev) => (prev.trim() ? prev : r.address3));
    setAddressResults([]);
  }, []);

  const fetchAddressShip = useCallback(async (code: string) => {
    if (code.length !== 7) {
      setAddressResults2([]);
      setAddressError2(null);
      return;
    }
    setAddressLoading2(true);
    setAddressError2(null);
    try {
      const res = await fetch(`${ZIPCLOUD_API}?zipcode=${code}`);
      const data = await res.json();
      if (data.status !== 200 || !Array.isArray(data.results)) {
        setAddressResults2([]);
        setAddressError2(data.message ?? t.addressNotFound);
        return;
      }
      const list = data.results.map((r: { address1?: string; address2?: string; address3?: string }) => ({
        address1: r.address1 ?? "",
        address2: r.address2 ?? "",
        address3: r.address3 ?? "",
      }));
      setAddressResults2(list);
    } catch (e) {
      setAddressResults2([]);
      setAddressError2(t.addressLookupFailed);
    } finally {
      setAddressLoading2(false);
    }
  }, [t.addressLookupFailed, t.addressNotFound]);

  useEffect(() => {
    if (zip7Ship.length === 7) {
      fetchAddressShip(zip7Ship);
    } else {
      setAddressResults2([]);
      setAddressError2(null);
    }
  }, [zip7Ship, fetchAddressShip]);

  const selectAddressShip = useCallback((r: ZipcloudResult) => {
    setShipPrefecture(r.address1);
    setShipCity(r.address2);
    setShipAddressLine((prev) => (prev.trim() ? prev : r.address3));
    setAddressResults2([]);
  }, []);

  const subtotal = items.reduce((sum, x) => sum + x.price * x.quantity, 0);
  const total = subtotal + (shipping ?? 0);
  const taxAmount = taxIncluded(total);

  const effectivePrefecture = shipToDifferent ? shipPrefecture.trim() : prefecture.trim();
  const itemsSignature = items.map((i) => `${i.slug}:${i.quantity}`).join(",");

  const getPrefectureForFee = () => {
    if (shipToDifferent) {
      const el = document.getElementById("check-ship-prefecture") as HTMLInputElement | null;
      return el?.value?.trim() ?? shipPrefecture.trim();
    }
    const el = document.getElementById("check-prefecture") as HTMLInputElement | null;
    return el?.value?.trim() ?? prefecture.trim();
  };

  useEffect(() => {
    const prefectureForFee = getPrefectureForFee();
    if (!prefectureForFee || items.length === 0) {
      setShipping(null);
      return;
    }
    let cancelled = false;
    setShippingLoading(true);
    fetch("/api/checkout/shipping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prefecture: prefectureForFee,
        items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
        subtotal,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.ok && typeof data.shipping === "number") setShipping(data.shipping);
        else setShipping(null);
      })
      .catch(() => {
        if (!cancelled) setShipping(null);
      })
      .finally(() => {
        if (!cancelled) setShippingLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [effectivePrefecture, itemsSignature]);

  const shippingDisplay = shippingLoading
    ? "計算中..."
    : shipping === null
      ? "計算中"
      : formatPrice(shipping);

  const formatPostal = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 7);
    if (digits.length <= 3) return digits;
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  };

  const handlePostalInput = (raw: string) => {
    setPostalCode(formatPostal(raw));
  };

  const handleShipPostalInput = (raw: string) => {
    setShipPostalCode(formatPostal(raw));
  };

  const orderPayload = useMemo(
    () => ({
      lines: items.map((it) => ({
        slug: it.slug,
        name: it.title,
        quantity: it.quantity,
        unitPrice: it.price,
        amount: it.price * it.quantity,
      })),
      shipping: shipping ?? 0,
      giftNoInvoice,
      memo: orderMemo,
      billingAddress: {
        name,
        postalCode,
        prefecture,
        city,
        addressLine,
        phone,
        email,
      },
      shippingAddress: shipToDifferent
        ? {
            name: shipName,
            postalCode: shipPostalCode,
            prefecture: shipPrefecture,
            city: shipCity,
            addressLine: shipAddressLine,
            phone: shipPhone,
          }
        : {
            name,
            postalCode,
            prefecture,
            city,
            addressLine,
            phone,
          },
    }),
    [
      items,
      shipping,
      giftNoInvoice,
      orderMemo,
      name,
      postalCode,
      prefecture,
      city,
      addressLine,
      phone,
      email,
      shipToDifferent,
      shipName,
      shipPostalCode,
      shipPrefecture,
      shipCity,
      shipAddressLine,
      shipPhone,
    ]
  );

  // 合計が変わったら PaymentIntent を作り直す（Google Pay/カードを同一フローに）
  useEffect(() => {
    if (!STRIPE_PK) return;
    let cancelled = false;
    (async () => {
      try {
        setPaymentInitError(null);
        const amountForIntent = shipping !== null ? total : subtotal;
        if (!Number.isFinite(amountForIntent) || amountForIntent < 1) {
          setClientSecret(null);
          return;
        }
        const res = await fetch("/api/checkout/pay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amountForIntent,
            cancelPreviousId: paymentIntentIdRef.current ?? undefined,
          }),
        });
        const text = await res.text();
        let data: any = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = null;
        }

        const cs = data?.clientSecret;
        const piId = data?.id;
        if (!cancelled && res.ok && typeof cs === "string" && cs.length > 10) {
          if (typeof piId === "string" && piId.startsWith("pi_")) {
            paymentIntentIdRef.current = piId;
          }
          setClientSecret(cs);
          return;
        }

        if (!cancelled) {
          const msg = data?.error
            ? `${t.paymentInitFailed}（${String(data.error)}）`
            : `${t.paymentInitFailed}（HTTP ${res.status}）`;
          setPaymentInitError(msg + (text ? `\n${text}` : ""));
          setClientSecret(null);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setPaymentInitError(t.paymentInitFailed);
          setClientSecret(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [shipping, total, subtotal, t.paymentInitFailed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Payment Element へ切り替えたため、ここでは submit を止めておく（実際の決済は下のフォームで行う）
    if (paying || shipping === null) return;
    alert(t.paymentElementAlert);
  };

  // PaymentElement を Stripe.js で一度だけマウント（React の再レンダーでは再マウントしない）
  useEffect(() => {
    if (!clientSecret || !STRIPE_PK || !cardContainerRef.current) return;

    let cancelled = false;
    (async () => {
      try {
        if (!stripeRef.current) {
          stripeRef.current = await stripePromise;
        }
        const stripe = stripeRef.current;
        if (!stripe || cancelled) return;

        if (!elementsRef.current) {
          elementsRef.current = stripe.elements({ clientSecret });

          // Wallet（Apple Pay / Google Pay 等）用: Express Checkout Element
          // Payment Element 内の表示は端末/条件に依存するため、明示的に表示枠を用意する。
          if (expressContainerRef.current && !expressCheckoutRef.current) {
            try {
              expressCheckoutRef.current = elementsRef.current.create("expressCheckout", {
                buttonType: {
                  applePay: "buy",
                  googlePay: "buy",
                },
              } as any);
              expressCheckoutRef.current.mount(expressContainerRef.current);
              expressCheckoutRef.current.on("confirm", async () => {
                try {
                  await handlePayRef.current?.();
                } catch {
                  // noop
                }
              });
            } catch (e) {
              // expressCheckout が使えない環境では黙ってスキップ
              expressCheckoutRef.current = null;
            }
          }

          const paymentElement = elementsRef.current.create("payment", {
            fields: { billingDetails: "never" },
          } as any);
          paymentElement.mount(cardContainerRef.current!);
          paymentElement.on("ready", () => {
            if (!cancelled) setCardReady(true);
          });
        }
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [clientSecret]);

  const handlePay = useCallback(async () => {
    const stripe = stripeRef.current;
    const elements = elementsRef.current;
    if (!stripe || !elements) return;
    if (paying || shipping === null) return;

    try {
      setPaying(true);
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}${locale === "ja" ? "/checkout" : `/${locale}/checkout`}`,
          payment_method_data: {
            billing_details: {
              name,
              email,
              phone,
              address: {
                postal_code: postalCode.replace(/\D/g, ""),
                country: "JP",
                state: prefecture,
                city,
                line1: addressLine,
              },
            },
          },
        },
        redirect: "if_required",
      } as any);

      if (result.error) {
        alert(result.error.message ?? t.paymentFailed);
        return;
      }
      const pi = result.paymentIntent;
      if (!pi || pi.status !== "succeeded") {
        alert(t.statusCheckFailed);
        return;
      }

      const completeRes = await fetch("/api/checkout/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: pi.id,
          order: orderPayload,
          locale,
          customer: {
            email,
            name,
            tel: phone,
            zipcode: postalCode,
            prefectures: prefecture,
            city,
            address: addressLine,
            approval: approval ? 1 : 0,
          },
        }),
      });
      const completeData = await completeRes.json();
      if (!completeRes.ok || !completeData?.ok) {
        // メール送信失敗等があっても、決済が成功していれば注文自体は完了扱いにする
        // （SES sandbox 等でお客様宛メールが拒否されるケースを許容）
      }

      // プロファイルを localStorage に保存（次回のオートフィル用）
      try {
        const profile: SavedCheckoutProfile = {
          billing: {
            name,
            email,
            phone,
            postalCode,
            prefecture,
            city,
            addressLine,
          },
          shipToDifferent,
          shipping: shipToDifferent
            ? {
                name: shipName,
                phone: shipPhone,
                postalCode: shipPostalCode,
                prefecture: shipPrefecture,
                city: shipCity,
                addressLine: shipAddressLine,
              }
            : undefined,
          giftNoInvoice,
        };
        localStorage.setItem("lastCheckoutProfile", JSON.stringify(profile));
      } catch {
        // localStorage が使えない環境では何もしない
      }
      try {
        if (completeData.summary) {
          sessionStorage.setItem(
            "lastOrderSummary",
            JSON.stringify(completeData.summary)
          );
        } else {
          sessionStorage.removeItem("lastOrderSummary");
        }
      } catch {
        // sessionStorage が使えない場合もあるので、失敗しても無視する
      }

      clearCart();
      window.location.href = locale === "ja" ? "/checkout/complete" : `/${locale}/checkout/complete`;
    } catch (e) {
      console.error(e);
      alert(t.paymentProcessingError);
    } finally {
      setPaying(false);
    }
  }, [
    paying,
    shipping,
    orderPayload,
    name,
    email,
    phone,
    postalCode,
    prefecture,
    city,
    addressLine,
    clearCart,
    locale,
    approval,
    t.paymentFailed,
    t.statusCheckFailed,
    t.paymentProcessingError,
  ]);

  useEffect(() => {
    handlePayRef.current = handlePay;
  }, [handlePay]);
  const stripeEnvMissing = !STRIPE_PK;

  // 保存済みプロファイルの有無を確認し、あればマウント時にオートフィル
  useEffect(() => {
    try {
      const raw = localStorage.getItem("lastCheckoutProfile");
      if (!raw) {
        setHasSavedProfile(false);
        return;
      }
      setHasSavedProfile(true);
      const profile = JSON.parse(raw) as SavedCheckoutProfile;
      setName(profile.billing.name || "");
      setEmail(profile.billing.email || "");
      setPhone(profile.billing.phone || "");
      setPostalCode(profile.billing.postalCode || "");
      setPrefecture(profile.billing.prefecture || "");
      setCity(profile.billing.city || "");
      setAddressLine(profile.billing.addressLine || "");
      setGiftNoInvoice(!!profile.giftNoInvoice);
      setShipToDifferent(!!profile.shipToDifferent);
      if (profile.shipToDifferent && profile.shipping) {
        setShipName(profile.shipping.name || "");
        setShipPhone(profile.shipping.phone || "");
        setShipPostalCode(profile.shipping.postalCode || "");
        setShipPrefecture(profile.shipping.prefecture || "");
        setShipCity(profile.shipping.city || "");
        setShipAddressLine(profile.shipping.addressLine || "");
      }
    } catch {
      setHasSavedProfile(false);
    }
  }, []);

  const applySavedProfile = useCallback(() => {
    try {
      const raw = localStorage.getItem("lastCheckoutProfile");
      if (!raw) return;
      const profile = JSON.parse(raw) as SavedCheckoutProfile;
      setName(profile.billing.name || "");
      setEmail(profile.billing.email || "");
      setPhone(profile.billing.phone || "");
      setPostalCode(profile.billing.postalCode || "");
      setPrefecture(profile.billing.prefecture || "");
      setCity(profile.billing.city || "");
      setAddressLine(profile.billing.addressLine || "");
      setGiftNoInvoice(!!profile.giftNoInvoice);
      setShipToDifferent(!!profile.shipToDifferent);
      if (profile.shipToDifferent && profile.shipping) {
        setShipName(profile.shipping.name || "");
        setShipPhone(profile.shipping.phone || "");
        setShipPostalCode(profile.shipping.postalCode || "");
        setShipPrefecture(profile.shipping.prefecture || "");
        setShipCity(profile.shipping.city || "");
        setShipAddressLine(profile.shipping.addressLine || "");
      }
    } catch {
      // 読み込み失敗時は何もしない
    }
  }, []);

  if (items.length === 0) {
    return (
      <article className="mb-10">
        <h1 className="m-0 mb-6 font-heading text-xl font-semibold text-tea-deep">{t.title}</h1>
        <p className="text-ink-muted mb-4">{t.empty}</p>
        <Link href={homeHref} className="text-tea font-semibold no-underline hover:underline">
          {t.goToProducts}
        </Link>
      </article>
    );
  }

  return (
    <article className="mb-10">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h1 className="m-0 font-heading text-xl font-semibold text-tea-deep">{t.title}</h1>
        <Link
          href={homeHref}
          className="text-[0.875rem] text-tea font-semibold no-underline hover:underline"
        >
          {t.continueShopping}
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="m-0 mb-4 text-base font-semibold text-tea-deep">{t.orderSummary}</h2>
          <ul className="list-none m-0 p-0 flex flex-col gap-3 mb-6">
            {items.map((item) => (
              <li
                key={item.slug}
                className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 p-3 rounded-lg border border-border bg-washi"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0 w-14 h-14 rounded overflow-hidden bg-cream">
                    <Image
                      src={item.imagePath ?? FALLBACK_IMAGE}
                      alt={item.title}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 sm:min-w-[6rem]">
                    <p className="m-0 text-[0.9375rem] font-medium text-ink break-words">{item.title}</p>
                    <p className="m-0 text-[0.8125rem] text-ink-muted">
                      {formatPrice(item.price)}
                      {locale === "ja" ? "（税込）" : " (tax incl.)"} × {item.quantity} ={" "}
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded border border-border bg-white text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-washi"
                    aria-label={t.qtyDecrease}
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-[0.9375rem] font-medium" aria-live="polite">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                    disabled={item.quantity >= 99}
                    className="w-8 h-8 flex items-center justify-center rounded border border-border bg-white text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-washi"
                    aria-label={t.qtyIncrease}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.slug)}
                  className="text-[0.8125rem] text-ink-muted underline hover:text-tea-deep shrink-0"
                >
                  {t.remove}
                </button>
              </li>
            ))}
          </ul>

          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex justify-between text-[0.9375rem]">
              <span className="text-ink-muted">{t.subtotal}</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[0.9375rem] pb-2 border-b border-border">
              <span className="text-ink-muted">{t.shipping}</span>
              <span className="font-medium">{shippingDisplay}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-tea-deep pt-2">
              <span>{t.totalTaxIncluded}</span>
              <span>{shipping !== null ? formatPrice(total) : "—"}</span>
            </div>
            <p className="m-0 text-[0.8125rem] text-ink-muted text-right">
              {t.taxIncludedLinePrefix}
              {shipping !== null ? formatPrice(taxAmount) : "—"}
              {t.taxIncludedLineSuffix}
            </p>
          </div>

          {/* 支払い方法（デスクトップ / モバイル共通） */}
          <div className="mt-6">
            <label className="mb-3 inline-flex items-center gap-2 cursor-pointer text-[0.9375rem] text-ink">
              <input
                type="checkbox"
                checked={approval}
                onChange={(e) => setApproval(e.target.checked)}
                className="w-4 h-4 rounded border-border text-tea focus:ring-tea"
              />
              <span>{t.promoApproval}</span>
            </label>
            <h2 className="m-0 mb-4 text-base font-semibold text-tea-deep">{t.paymentMethod}</h2>
            {stripeEnvMissing ? (
              <div className="p-4 rounded-xl bg-[#f0ebe5] border border-border text-ink-muted">
                {t.stripeKeyMissing}
              </div>
            ) : paymentInitError ? (
              <div className="p-4 rounded-xl bg-[#f0ebe5] border border-border text-red-700">
                {paymentInitError}
              </div>
            ) : clientSecret ? (
              <div className="p-4 rounded-xl bg-[#f0ebe5] border border-border">
                <h3 className="m-0 mb-4 text-[0.9375rem] font-semibold text-tea-deep">{t.cardOrGooglePay}</h3>
                <div className="mb-4">
                  <div className="text-[0.8125rem] text-ink-muted mb-2">
                    {t.walletHint}
                  </div>
                  <div ref={expressContainerRef} />
                </div>
                <div className="bg-white rounded-lg border-2 border-border p-3">
                  <div ref={cardContainerRef} />
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={handlePay}
                    disabled={paying || shipping === null || !cardReady}
                    className="w-full py-3 px-6 rounded-lg border-2 border-tea bg-tea text-white text-[0.9375rem] font-semibold transition-colors hover:bg-tea-light hover:border-tea-light disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {paying ? t.paying : t.payNow}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#f0ebe5] border border-border text-ink-muted">
                {t.paymentLoading}
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="m-0 text-base font-semibold text-tea-deep">{t.billing}</h2>
            {hasSavedProfile && (
              <button
                type="button"
                onClick={applySavedProfile}
                className="text-[0.8125rem] font-semibold text-tea no-underline hover:underline"
              >
                {t.autofillPrevious}
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="checkout-name" className="block text-[0.875rem] font-medium text-ink mb-1">
                {t.name} <span className="text-red-600">*</span>
              </label>
              <input
                id="checkout-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border-2 border-border rounded-lg text-[0.9375rem] focus:border-tea-deep focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="checkout-email" className="block text-[0.875rem] font-medium text-ink mb-1">
                {t.email} <span className="text-red-600">*</span>
              </label>
              <input
                id="checkout-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border-2 border-border rounded-lg text-[0.9375rem] focus:border-tea-deep focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="checkout-phone" className="block text-[0.875rem] font-medium text-ink mb-1">
                {t.phone} <span className="text-red-600">*</span>
              </label>
              <input
                id="checkout-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border-2 border-border rounded-lg text-[0.9375rem] focus:border-tea-deep focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="checkout-postal" className="block text-[0.875rem] font-medium text-ink mb-1">
                {t.postalCode} <span className="text-red-600">*</span>
              </label>
              <input
                id="checkout-postal"
                type="text"
                inputMode="numeric"
                pattern="[0-9\-]*"
                placeholder="123-4567"
                required
                value={postalCode}
                  onChange={(e) => handlePostalInput(e.target.value)}
                className="w-full px-3 py-2 border-2 border-border rounded-lg text-[0.9375rem] focus:border-tea-deep focus:outline-none"
              />
              {addressLoading && (
                <p className="m-0 mt-1 text-[0.8125rem] text-ink-muted">{t.searchingAddress}</p>
              )}
              {!addressLoading && addressError && (
                <p className="m-0 mt-1 text-[0.8125rem] text-red-600">{addressError}</p>
              )}
              {!addressLoading && addressResults.length > 0 && (
                <div className="mt-2 p-2 border border-border rounded-lg bg-washi">
                  <p className="m-0 mb-2 text-[0.8125rem] text-ink-muted">{t.selectAddressCandidate}</p>
                  <ul className="list-none m-0 p-0 flex flex-col gap-1">
                    {addressResults.map((r, i) => (
                      <li key={i}>
                        <button
                          type="button"
                          onClick={() => selectAddress(r)}
                          className="w-full text-left px-3 py-2 text-[0.9375rem] rounded border border-border bg-white hover:bg-cream hover:border-tea transition-colors"
                        >
                          {r.address1} {r.address2} {r.address3}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="check-prefecture" className="block text-[0.875rem] font-medium text-ink mb-1">
                {t.prefecture} <span className="text-red-600">*</span>
              </label>
              <input
                id="check-prefecture"
                type="text"
                required
                value={prefecture}
                onChange={(e) => setPrefecture(e.target.value)}
                className="w-full px-3 py-2 border-2 border-border rounded-lg text-[0.9375rem] focus:border-tea-deep focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="checkout-city" className="block text-[0.875rem] font-medium text-ink mb-1">
                {t.city} <span className="text-red-600">*</span>
              </label>
              <input
                id="checkout-city"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border-2 border-border rounded-lg text-[0.9375rem] focus:border-tea-deep focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="checkout-address" className="block text-[0.875rem] font-medium text-ink mb-1">
                {t.addressLine} <span className="text-red-600">*</span>
              </label>
              <input
                id="checkout-address"
                type="text"
                required
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="w-full px-3 py-2 border-2 border-border rounded-lg text-[0.9375rem] focus:border-tea-deep focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={giftNoInvoice}
                  onChange={(e) => setGiftNoInvoice(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-tea focus:ring-tea"
                />
                <span className="text-[0.9375rem] text-ink">{t.giftNoInvoice}</span>
              </label>
              <div>
                <label htmlFor="checkout-memo" className="block text-[0.875rem] font-medium text-ink mb-1">
                  {t.memo}
                </label>
                <textarea
                  id="checkout-memo"
                  rows={3}
                  value={orderMemo}
                  onChange={(e) => setOrderMemo(e.target.value)}
                  placeholder={t.memoPlaceholder}
                  className="w-full px-3 py-2 border-2 border-border rounded-lg text-[0.9375rem] focus:border-tea-deep focus:outline-none resize-y"
                />
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shipToDifferent}
                  onChange={(e) => {
                  const checked = e.target.checked;
                  setShipToDifferent(checked);
                  if (checked) setShipping(null);
                }}
                  className="w-4 h-4 rounded border-border text-tea focus:ring-tea"
                />
                <span className="text-[0.9375rem] text-ink">{t.shipToDifferent}</span>
              </label>
            </div>
            {shipToDifferent && (
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="m-0 mb-4 text-[0.9375rem] font-semibold text-tea-deep">{t.shippingAddress}</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="checkout-ship-name" className="block text-[0.875rem] font-medium text-ink mb-1">
                      {t.recipientName} <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="checkout-ship-name"
                      type="text"
                      required={shipToDifferent}
                      value={shipName}
                      onChange={(e) => setShipName(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-border rounded-lg text-[0.9375rem] focus:border-tea-deep focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-ship-phone" className="block text-[0.875rem] font-medium text-ink mb-1">
                      {t.recipientPhone} <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="checkout-ship-phone"
                      type="tel"
                      required={shipToDifferent}
                      value={shipPhone}
                      onChange={(e) => setShipPhone(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-border rounded-lg text-[0.9375rem] focus:border-tea-deep focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-ship-postal" className="block text-[0.875rem] font-medium text-ink mb-1">
                      {t.recipientPostalCode} <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="checkout-ship-postal"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9\-]*"
                      placeholder="123-4567"
                      required={shipToDifferent}
                      value={shipPostalCode}
                      onChange={(e) => handleShipPostalInput(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-border rounded-lg text-[0.9375rem] focus:border-tea-deep focus:outline-none"
                    />
                    {addressLoading2 && (
                      <p className="m-0 mt-1 text-[0.8125rem] text-ink-muted">{t.searchingAddress}</p>
                    )}
                    {!addressLoading2 && addressError2 && (
                      <p className="m-0 mt-1 text-[0.8125rem] text-red-600">{addressError2}</p>
                    )}
                    {!addressLoading2 && addressResults2.length > 0 && (
                      <div className="mt-2 p-2 border border-border rounded-lg bg-washi">
                        <p className="m-0 mb-2 text-[0.8125rem] text-ink-muted">{t.selectAddressCandidate}</p>
                        <ul className="list-none m-0 p-0 flex flex-col gap-1">
                          {addressResults2.map((r, i) => (
                            <li key={i}>
                              <button
                                type="button"
                                onClick={() => selectAddressShip(r)}
                                className="w-full text-left px-3 py-2 text-[0.9375rem] rounded border border-border bg-white hover:bg-cream hover:border-tea transition-colors"
                              >
                                {r.address1} {r.address2} {r.address3}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="check-ship-prefecture" className="block text-[0.875rem] font-medium text-ink mb-1">
                      都道府県 <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="check-ship-prefecture"
                      type="text"
                      required={shipToDifferent}
                      value={shipPrefecture}
                      onChange={(e) => setShipPrefecture(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-border rounded-lg text-[0.9375rem] focus:border-tea-deep focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-ship-city" className="block text-[0.875rem] font-medium text-ink mb-1">
                      市区町村 <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="checkout-ship-city"
                      type="text"
                      required={shipToDifferent}
                      value={shipCity}
                      onChange={(e) => setShipCity(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-border rounded-lg text-[0.9375rem] focus:border-tea-deep focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-ship-address" className="block text-[0.875rem] font-medium text-ink mb-1">
                      住所（番地・建物名など） <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="checkout-ship-address"
                      type="text"
                      required={shipToDifferent}
                      value={shipAddressLine}
                      onChange={(e) => setShipAddressLine(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-border rounded-lg text-[0.9375rem] focus:border-tea-deep focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </article>
  );
}
