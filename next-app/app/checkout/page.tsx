"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Turnstile } from "@marsidev/react-turnstile";
import { CHECKOUT_TEXTS } from "@/lib/checkoutTexts";
import { formatPriceYen } from "@/lib/formatters";
import { buildEnhancedConversionUserData } from "@/lib/googleEnhancedConversions";

const FREE_SHIPPING_THRESHOLD = 10000;
const ZIPCLOUD_API = "https://zipcloud.ibsnet.co.jp/api/search";

const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "";
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
const stripePromise = loadStripe(STRIPE_PK);

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

function taxIncluded(amount: number): number {
  return Math.floor(amount * 10 / 110);
}

function normalizePostalCode(value: string): string {
  return value.replace(/\D/g, "").slice(0, 7);
}

export default function CheckoutPage() {
  const t = CHECKOUT_TEXTS;
  const homeHref = "/";
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const [resolvedImagePaths, setResolvedImagePaths] = useState<Record<string, string>>({});
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
  const [paying, setPaying] = useState(false);
  const paymentIntentIdRef = useRef<string | null>(null);
  const [paymentInitError, setPaymentInitError] = useState<string | null>(null);
  const [hasSavedProfile, setHasSavedProfile] = useState(false);
  const [approval, setApproval] = useState(true);
  const [showAutocompleteTip, setShowAutocompleteTip] = useState(false);
  const autocompleteTipShownAtRef = useRef<number | null>(null);

  // Stripe.js を直接扱うための参照（React 再レンダーで壊れないようにする）
  const stripeRef = useRef<any>(null);
  const elementsRef = useRef<any>(null);
  const expressCheckoutRef = useRef<any>(null);
  const paymentElementRef = useRef<any>(null);
  const amountForIntentRef = useRef<number | null>(null);
  const cardReadyFallbackIdRef = useRef<number | ReturnType<typeof setTimeout> | null>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const expressContainerRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [cardReady, setCardReady] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<string | null>(null);

  const handlePayRef = useRef<null | (() => Promise<void>)>(null);
  const subtotalRef = useRef<number>(0);
  const itemsRef = useRef<typeof items>([]);
  const checkoutLoggedRef = useRef(false);
  const [paymentResetToken, setPaymentResetToken] = useState(0);
  const walletShippingRef = useRef<number | null>(null);

  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [couponChecking, setCouponChecking] = useState(false);
  const appliedCouponCodeRef = useRef<string | null>(null);

  const [turnstileToken, setTurnstileToken] = useState("");

  const zip7 = normalizePostalCode(postalCode);
  const zip7Ship = normalizePostalCode(shipPostalCode);

  const missingImageSlugs = useMemo(() => {
    return Array.from(new Set(items.filter((i) => !i.imagePath).map((i) => i.slug)));
  }, [items]);

  useEffect(() => {
    if (missingImageSlugs.length === 0) {
      setResolvedImagePaths({});
      return;
    }
    const params = new URLSearchParams({ slugs: missingImageSlugs.join(",") });
    fetch(`/api/product-images?${params}`)
      .then((res) => (res.ok ? res.json() : {}))
      .then((data: Record<string, string>) => setResolvedImagePaths(data ?? {}))
      .catch(() => setResolvedImagePaths({}));
  }, [missingImageSlugs]);

  useEffect(() => {
    if (checkoutLoggedRef.current || items.length === 0) return;
    checkoutLoggedRef.current = true;
    const amount = items.reduce((sum, x) => sum + x.price * x.quantity, 0);
    fetch("/api/checkout/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ total_amount: amount }),
    }).catch(() => {});
  }, [items]);

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
  const effectiveSubtotal = Math.max(0, subtotal - discountAmount);

  const CLICKPOST_RATE = 380;
  const HEAVY_RATE = 880;
  const RANK_THRESHOLD = 6.0;
  const rankSum = items.reduce((sum, i) => sum + (i.shipRank ?? 0) * i.quantity, 0);
  const shipping: number | null = items.length === 0 ? null
    : subtotal >= FREE_SHIPPING_THRESHOLD ? 0
    : rankSum <= RANK_THRESHOLD ? CLICKPOST_RATE : HEAVY_RATE;
  const shippingDisplay = shipping === null ? "計算中" : formatPriceYen(shipping);

  const total = effectiveSubtotal + (shipping ?? 0);
  const taxAmount = taxIncluded(total);
  subtotalRef.current = effectiveSubtotal;
  itemsRef.current = items;

  const effectivePrefecture = shipToDifferent ? shipPrefecture.trim() : prefecture.trim();
  const itemsSignature = items.map((i) => `${i.slug}:${i.quantity}`).join(",");

  // 送料ログ（バックグラウンド、UI非依存）
  useEffect(() => {
    if (shipping === null || items.length === 0) return;
    fetch("/api/checkout/shipping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prefecture: effectivePrefecture,
        items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
        subtotal,
      }),
    }).catch(() => {});
  }, [effectivePrefecture, itemsSignature]);

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

  const handleCouponBlur = useCallback(async () => {
    const code = couponCode.trim();
    if (!code) {
      setDiscountAmount(0);
      setCouponMessage(null);
      appliedCouponCodeRef.current = null;
      return;
    }
    if (subtotal <= 0) {
      setDiscountAmount(0);
      setCouponMessage(null);
      appliedCouponCodeRef.current = null;
      return;
    }
    try {
      setCouponChecking(true);
      setCouponMessage(null);
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (res.ok && data.ok && typeof data.discountAmount === "number") {
        setDiscountAmount(data.discountAmount);
        appliedCouponCodeRef.current = data.code ?? code;
        setCouponMessage(
          `${t.couponApplied} (${data.label ?? ""} -${formatPriceYen(data.discountAmount)})`.trim()
        );
      } else {
        setDiscountAmount(0);
        appliedCouponCodeRef.current = null;
        setCouponMessage(t.couponInvalid);
      }
    } catch {
      setDiscountAmount(0);
      appliedCouponCodeRef.current = null;
      setCouponMessage(t.couponInvalid);
    } finally {
      setCouponChecking(false);
    }
  }, [couponCode, subtotal, t.couponApplied, t.couponInvalid]);

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
      discount: discountAmount,
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
      discountAmount,
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

  // Deferred Intent: PaymentIntent は作らず、mode/amount/currency だけで Payment Element を表示（Stripe に未完了 PI を送らない）
  useEffect(() => {
    if (!STRIPE_PK || !cardContainerRef.current) return;
    const amountForIntent = shipping !== null ? total : subtotal;
    if (subtotal < 1 || !Number.isFinite(amountForIntent) || amountForIntent < 1) {
      setPaymentInitError(null);
      amountForIntentRef.current = null;
      setCardReady(false);
      setSelectedPaymentType(null);
      try {
        paymentElementRef.current?.destroy();
        paymentElementRef.current = null;
        expressCheckoutRef.current?.destroy();
        expressCheckoutRef.current = null;
      } catch {
        // noop
      }
      elementsRef.current = null;
      return;
    }

    const updateAmount = (amount: number) => {
      const el = elementsRef.current as any;
      if (el && typeof el.update === "function") {
        try {
          el.update({ amount });
        } catch {
          // noop
        }
      }
    };

    if (elementsRef.current && amountForIntentRef.current !== amountForIntent) {
      amountForIntentRef.current = amountForIntent;
      updateAmount(amountForIntent);
      setCardReady(true);
      return;
    }

    if (elementsRef.current) {
      setCardReady(true);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setPaymentInitError(null);
        if (!stripeRef.current) {
          stripeRef.current = await stripePromise;
        }
        const stripe = stripeRef.current;
        if (!stripe || cancelled) return;

        const options = {
          mode: "payment" as const,
          amount: Math.round(amountForIntent),
          currency: "jpy" as const,
          appearance: { theme: "stripe" as const },
        };
        const elements = stripe.elements(options as any);
        elementsRef.current = elements;
        amountForIntentRef.current = amountForIntent;

        const paymentElement = elements.create("payment", {
          fields: { billingDetails: "never" },
          layout: { type: "accordion", defaultCollapsed: false },
        } as any);
        paymentElementRef.current = paymentElement;
        paymentElement.mount(cardContainerRef.current!);
        paymentElement.on("change", (event: any) => {
          const type =
            event?.value?.type ??
            event?.value?.payment_method_type ??
            event?.value?.paymentMethodType ??
            null;
          setSelectedPaymentType(typeof type === "string" ? type : null);
        });
        paymentElement.on("ready", () => {
          if (!cancelled) setCardReady(true);
        });
        // Deferred では ready が発火しない環境があるため、マウント後もボタンを有効化する
        if (cardReadyFallbackIdRef.current != null) {
          window.clearTimeout(cardReadyFallbackIdRef.current);
        }
        cardReadyFallbackIdRef.current = window.setTimeout(() => {
          if (!cancelled) setCardReady(true);
          cardReadyFallbackIdRef.current = null;
        }, 2000);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setPaymentInitError(t.paymentInitFailed);
          setCardReady(false);
        }
      }
    })();
    return () => {
      cancelled = true;
      if (cardReadyFallbackIdRef.current != null) {
        window.clearTimeout(cardReadyFallbackIdRef.current);
        cardReadyFallbackIdRef.current = null;
      }
    };
  }, [shipping, total, subtotal, t.paymentInitFailed, paymentResetToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Payment Element へ切り替えたため、ここでは submit を止めておく（実際の決済は下のフォームで行う）
    if (paying || shipping === null) return;
    alert(t.paymentElementAlert);
  };

  const handlePay = useCallback(async () => {
    const stripe = stripeRef.current;
    const elements = elementsRef.current;
    if (!stripe || !elements) return;
    if (paying) return;
    if (shipping === null && (walletShippingRef.current ?? 0) <= 0) {
      alert(t.shippingRequiredToPay);
      return;
    }

    // 0. 購入者情報（氏名・email・電話・住所）の必須チェック。
    //    未入力の場合はブラウザ標準のUIでフォーカスを促し、Stripeへの課金確定処理には進ませない。
    if (formRef.current && !formRef.current.reportValidity()) {
      return;
    }

    try {
      setPaying(true);
      setPaymentInitError(null);

      // 1. フォーム検証と支払い詳細の収集（Stripe に PI はまだ送らない）
      const { error: submitError } = await (elements as any).submit();
      if (submitError) {
        alert(submitError.message ?? t.paymentFailed);
        return;
      }

      const amountForIntent = shipping !== null ? total : subtotal;
      if (!Number.isFinite(amountForIntent) || amountForIntent < 1) {
        alert(t.paymentInitFailed);
        return;
      }

      // 2. 確定ボタン押下時のみ PaymentIntent を1回作成
      const res = await fetch("/api/checkout/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(amountForIntent),
          cancelPreviousId: paymentIntentIdRef.current ?? undefined,
          turnstileToken: turnstileToken || undefined,
          billingAddress: {
            name,
            email,
            phone,
            postalCode,
            prefecture,
            city,
            addressLine,
          },
        }),
      });
      const text = await res.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }
      const clientSecret = data?.clientSecret;
      const piId = data?.id;
      if (!res.ok || typeof clientSecret !== "string" || clientSecret.length < 10) {
        const msg = data?.error
          ? `${t.paymentInitFailed}（${String(data.error)}）`
          : `${t.paymentInitFailed}（HTTP ${res.status}）`;
        setPaymentInitError(msg + (text ? `\n${text}` : ""));
        return;
      }
      if (typeof piId === "string" && piId.startsWith("pi_")) {
        paymentIntentIdRef.current = piId;
      }

      // 3. 収集済みの支払い詳細で PaymentIntent を確定
      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout`,
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
      console.log("[debug] confirmPayment result", JSON.stringify(result.error ?? result.paymentIntent?.status));

      if (result.error) {
        alert(result.error.message ?? t.paymentFailed);
        return;
      }
      const pi = result.paymentIntent;
      if (!pi || pi.status !== "succeeded") {
        alert(t.statusCheckFailed);
        return;
      }
      // Apple Pay 等でウォレット住所から送料を反映した場合は PI 金額から送料を逆算
      const effectiveShipping =
        (orderPayload.shipping ?? 0) > 0
          ? orderPayload.shipping
          : Math.max(0, (pi.amount ?? 0) - subtotalRef.current);
      const effectiveOrder = { ...orderPayload, shipping: effectiveShipping };

      console.log("[debug] calling /api/checkout/complete");
      const completeRes = await fetch("/api/checkout/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: pi.id,
          order: effectiveOrder,
          couponCode: appliedCouponCodeRef.current,
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
      }).catch((e: unknown) => { console.error("[debug] fetch failed", e); throw e; });
      let completeData: any = { ok: false };
      try {
        const jsonText = await completeRes.text();
        completeData = jsonText ? JSON.parse(jsonText) : {};
      } catch {
        // レスポンスが JSON でない場合（500 エラーページ等）も決済は成功しているので完了ページへ
      }
      console.log("[debug] completeRes.status", completeRes.status);
      console.log("[debug] completeData", JSON.stringify(completeData));
      console.log("[debug] summary", JSON.stringify(completeData?.summary));
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
          const enhancedConversionUserData = buildEnhancedConversionUserData({
            email,
            phone,
            name,
            postalCode,
            prefecture,
            city,
            addressLine,
          });
          if (enhancedConversionUserData) {
            sessionStorage.setItem(
              "lastOrderUserData",
              JSON.stringify(enhancedConversionUserData)
            );
          } else {
            sessionStorage.removeItem("lastOrderUserData");
          }
        } else {
          sessionStorage.removeItem("lastOrderSummary");
          sessionStorage.removeItem("lastOrderUserData");
        }
      } catch (e) {
        console.error("[debug] sessionStorage.setItem failed", e);
      }

      clearCart();
      window.location.href = "/checkout/complete/";
    } catch (e) {
      console.error("[checkout handlePay]", e);
      const detail = e instanceof Error ? e.message : String(e);
      alert(`${t.paymentProcessingError}\n\n${detail}`);
    } finally {
      setPaying(false);
    }
  }, [
    paying,
    shipping,
    total,
    orderPayload,
    name,
    email,
    phone,
    postalCode,
    prefecture,
    city,
    addressLine,
    clearCart,
    approval,
    turnstileToken,
    t.shippingRequiredToPay,
    t.paymentInitFailed,
    t.paymentFailed,
    t.statusCheckFailed,
    t.paymentProcessingError,
  ]);

  useEffect(() => {
    handlePayRef.current = handlePay;
  }, [handlePay]);
  const handleChangePaymentMethod = useCallback(() => {
    try {
      paymentElementRef.current?.destroy();
      paymentElementRef.current = null;
    } catch { /* noop */ }
    elementsRef.current = null;
    amountForIntentRef.current = null;
    setCardReady(false);
    setSelectedPaymentType(null);
    setPaymentResetToken((n) => n + 1);
  }, []);

  const stripeEnvMissing = !STRIPE_PK;
  const isGooglePaySelected = selectedPaymentType === "google_pay";
  const isApplePaySelected = selectedPaymentType === "apple_pay";
  const payButtonLabel = paying
    ? t.paying
    : isGooglePaySelected
      ? "Google Payで支払う"
      : isApplePaySelected
        ? "Apple Payで支払う"
        : t.payNow;
  const walletSectionTitle = "クレジットカード / Apple Pay / Google Pay";

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

  useEffect(() => {
    setShowAutocompleteTip(true);
    autocompleteTipShownAtRef.current = Date.now();
    const timer = setTimeout(() => setShowAutocompleteTip(false), 6000);
    return () => clearTimeout(timer);
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
      <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* 1. 注文内容（スマホ1番目・デスクトップ左列上） */}
        <div className="order-1 lg:col-start-1 lg:row-start-1">
          <h2 className="m-0 mb-4 text-base font-semibold text-tea-deep">{t.orderSummary}</h2>
          <ul className="list-none m-0 p-0 flex flex-col gap-3 mb-6">
            {items.map((item) => {
              const imageSrc = item.imagePath ?? resolvedImagePaths[item.slug] ?? "";
              return (
              <li
                key={item.slug}
                className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 p-3 rounded-lg border border-border bg-washi"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0 w-14 h-14 rounded overflow-hidden bg-cream">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={item.title}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-cream" aria-hidden="true" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 sm:min-w-[6rem]">
                    <p className="m-0 text-[0.9375rem] font-medium text-ink break-words">{item.title}</p>
                    <p className="m-0 text-[0.8125rem] text-ink-muted">
                      {formatPriceYen(item.price)}
                      （税込） × {item.quantity} ={" "}
                      {formatPriceYen(item.price * item.quantity)}
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
              );
            })}
          </ul>

          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex justify-between text-[0.9375rem]">
              <span className="text-ink-muted">{t.subtotal}</span>
              <span className="font-medium">{formatPriceYen(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[0.9375rem] pb-2 border-b border-border">
              <span className="text-ink-muted">{t.shipping}</span>
              <span className="font-medium">{shippingDisplay}</span>
            </div>
            <div className="flex items-center justify-between text-[0.9375rem] pb-2 border-b border-border">
              <span className="text-ink-muted">{t.couponLabel}</span>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  setCouponMessage(null);
                  setDiscountAmount(0);
                  appliedCouponCodeRef.current = null;
                }}
                onBlur={handleCouponBlur}
                maxLength={32}
                className="w-40 rounded border border-border bg-white px-2 py-1 text-right text-[0.875rem]"
                placeholder={t.couponPlaceholder}
                autoComplete="off"
              />
            </div>
            {couponMessage && (
              <p
                className="m-0 mt-1 text-[0.8125rem] text-right"
              >
                {couponMessage}
              </p>
            )}
            {discountAmount > 0 && (
              <div className="flex justify-between text-[0.9375rem] text-tea-deep">
                <span className="text-ink-muted">割引</span>
                <span className="font-medium">-{formatPriceYen(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold text-tea-deep pt-2">
              <span>{t.totalTaxIncluded}</span>
              <span>{shipping !== null ? formatPriceYen(total) : "—"}</span>
            </div>
            <p className="m-0 text-[0.8125rem] text-ink-muted text-right">
              {t.taxIncludedLinePrefix}
              {shipping !== null ? formatPriceYen(taxAmount) : "—"}
              {t.taxIncludedLineSuffix}
            </p>
            <p className="m-0 pt-2 text-[0.9375rem] font-bold text-tea-deep text-right">
              {subtotal >= FREE_SHIPPING_THRESHOLD
                ? t.freeShipping
                : `${t.freeShippingRemainPrefix}${formatPriceYen(FREE_SHIPPING_THRESHOLD - subtotal)}${t.freeShippingRemain}`}
            </p>
          </div>
        </div>

        {/* 2. 請求先＆お届け先（スマホ2番目・デスクトップ右列） */}
        <div className="order-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
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
            <div className="relative">
              <label htmlFor="checkout-name" className="block text-[0.875rem] font-medium text-ink mb-1">
                {t.name} <span className="text-red-600">*</span>
              </label>
              <input
                id="checkout-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => {
                  if (autocompleteTipShownAtRef.current && Date.now() - autocompleteTipShownAtRef.current >= 800) {
                    setShowAutocompleteTip(false);
                  }
                }}
                className="w-full px-3 py-2 border-2 border-border rounded-lg text-[0.9375rem] focus:border-tea-deep focus:outline-none"
              />
              {showAutocompleteTip && (
                <div className="absolute left-0 w-1/2 top-full mt-1 z-20">
                  <div className="relative bg-tea-deep text-white text-[0.8125rem] px-3 py-2.5 rounded-lg shadow-lg flex items-center gap-2">
                    <div className="absolute -top-1.5 left-5 w-3 h-3 bg-tea-deep rotate-45" />
                    <span>ブラウザに保存された住所情報で<br />かんたん入力できます</span>
                    <button
                      type="button"
                      onClick={() => setShowAutocompleteTip(false)}
                      className="ml-auto shrink-0 opacity-70 hover:opacity-100"
                      aria-label="閉じる"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="checkout-email" className="block text-[0.875rem] font-medium text-ink mb-1">
                {t.email} <span className="text-red-600">*</span>
              </label>
              <input
                id="checkout-email"
                name="email"
                type="email"
                required
                autoComplete="email"
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
                name="tel"
                type="tel"
                inputMode="tel"
                pattern="[0-9+\-\s]{8,20}"
                required
                autoComplete="tel"
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
                name="postal-code"
                type="text"
                inputMode="numeric"
                pattern="[0-9\-]*"
                placeholder="123-4567"
                required
                autoComplete="postal-code"
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
                name="address-level1"
                type="text"
                required
                autoComplete="address-level1"
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
                name="address-level2"
                type="text"
                required
                autoComplete="address-level2"
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
                name="street-address"
                type="text"
                required
                autoComplete="street-address"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="w-full px-3 py-2 border-2 border-border rounded-lg text-[0.9375rem] focus:border-tea-deep focus:outline-none"
              />
            </div>
            <p className="m-0 text-[0.875rem] leading-relaxed text-ink-muted">{t.domesticShippingOnly}</p>
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
                  setShipToDifferent(e.target.checked);
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
                      name="ship-name"
                      type="text"
                      required={shipToDifferent}
                      autoComplete="section-shipping name"
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
                      name="ship-tel"
                      type="tel"
                      inputMode="tel"
                      pattern="[0-9+\-\s]{8,20}"
                      required={shipToDifferent}
                      autoComplete="section-shipping tel"
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
                      name="ship-postal-code"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9\-]*"
                      placeholder="123-4567"
                      required={shipToDifferent}
                      autoComplete="section-shipping postal-code"
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
                      name="ship-address-level1"
                      type="text"
                      required={shipToDifferent}
                      autoComplete="section-shipping address-level1"
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
                      name="ship-address-level2"
                      type="text"
                      required={shipToDifferent}
                      autoComplete="section-shipping address-level2"
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
                      name="ship-street-address"
                      type="text"
                      required={shipToDifferent}
                      autoComplete="section-shipping street-address"
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

        {/* 3. 支払い方法（スマホ3番目・デスクトップ左列下） */}
        <div className="order-3 lg:col-start-1 lg:row-start-2">
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
          ) : (
            <div className="p-4 rounded-xl bg-[#f0ebe5] border border-border">
              <h3 className="m-0 mb-4 text-[0.9375rem] font-semibold text-tea-deep">{walletSectionTitle}</h3>
              <div className={`bg-white rounded-lg border-2 border-border p-3 min-h-[120px] ${isApplePaySelected || isGooglePaySelected ? "hidden" : ""}`}>
                <div ref={cardContainerRef} />
              </div>
              {(isApplePaySelected || isGooglePaySelected) && (
                <button
                  type="button"
                  onClick={handleChangePaymentMethod}
                  className="mt-3 text-sm text-tea hover:underline"
                >
                  ← 支払い方法を変更
                </button>
              )}
              <div className="mt-4 pt-4 border-t border-border">
                {TURNSTILE_SITE_KEY && (
                  <div className="mb-3 flex justify-center">
                    <Turnstile
                      siteKey={TURNSTILE_SITE_KEY}
                      onSuccess={(token) => setTurnstileToken(token)}
                      onExpire={() => setTurnstileToken("")}
                      onError={() => setTurnstileToken("")}
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={handlePay}
                  disabled={paying || shipping === null || !cardReady || (!!TURNSTILE_SITE_KEY && !turnstileToken)}
                  className="w-full py-3 px-6 rounded-lg border-2 border-tea bg-tea text-white text-[0.9375rem] font-semibold transition-colors hover:bg-tea-light hover:border-tea-light disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {payButtonLabel}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </article>
  );
}
