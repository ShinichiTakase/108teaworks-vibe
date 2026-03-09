"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import PaymentRequestButtons from "@/components/PaymentRequestButtons";

const FALLBACK_IMAGE = "/images/products/product-01.webp";
const FREE_SHIPPING_THRESHOLD = 20000;
const ZIPCLOUD_API = "https://zipcloud.ibsnet.co.jp/api/search";

type ZipcloudResult = {
  address1: string; // 都道府県
  address2: string; // 市区町村
  address3: string; // 町域
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
  const { items, updateQuantity, removeFromCart } = useCart();
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
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [shipping, setShipping] = useState<number | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);

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
        setAddressError(data.message ?? "住所が見つかりませんでした");
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
      setAddressError("住所の取得に失敗しました");
    } finally {
      setAddressLoading(false);
    }
  }, []);

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
        setAddressError2(data.message ?? "住所が見つかりませんでした");
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
      setAddressError2("住所の取得に失敗しました");
    } finally {
      setAddressLoading2(false);
    }
  }, []);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Stripe 決済連携
    alert("購入処理は準備中です。");
  };

  if (items.length === 0) {
    return (
      <article className="mb-10">
        <h1 className="m-0 mb-6 font-heading text-xl font-semibold text-tea-deep">購入手続き</h1>
        <p className="text-ink-muted mb-4">カートに商品がありません。</p>
        <Link href="/" className="text-tea font-semibold no-underline hover:underline">
          商品一覧へ
        </Link>
      </article>
    );
  }

  return (
    <article className="mb-10">
      <h1 className="m-0 mb-6 font-heading text-xl font-semibold text-tea-deep">購入手続き</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="m-0 mb-4 text-base font-semibold text-tea-deep">請求先</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="checkout-name" className="block text-[0.875rem] font-medium text-ink mb-1">
                お名前 <span className="text-red-600">*</span>
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
                メールアドレス <span className="text-red-600">*</span>
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
                電話番号 <span className="text-red-600">*</span>
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
                郵便番号 <span className="text-red-600">*</span>
              </label>
              <input
                id="checkout-postal"
                type="text"
                inputMode="numeric"
                pattern="[0-9\-]*"
                placeholder="123-4567"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-3 py-2 border-2 border-border rounded-lg text-[0.9375rem] focus:border-tea-deep focus:outline-none"
              />
              {addressLoading && (
                <p className="m-0 mt-1 text-[0.8125rem] text-ink-muted">住所を検索中...</p>
              )}
              {!addressLoading && addressError && (
                <p className="m-0 mt-1 text-[0.8125rem] text-red-600">{addressError}</p>
              )}
              {!addressLoading && addressResults.length > 0 && (
                <div className="mt-2 p-2 border border-border rounded-lg bg-washi">
                  <p className="m-0 mb-2 text-[0.8125rem] text-ink-muted">住所の候補を選択してください</p>
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
                都道府県 <span className="text-red-600">*</span>
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
                市区町村 <span className="text-red-600">*</span>
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
                住所（番地・建物名など） <span className="text-red-600">*</span>
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
                <span className="text-[0.9375rem] text-ink">金額記載の明細書は不要（ギフト用）</span>
              </label>
              <div>
                <label htmlFor="checkout-memo" className="block text-[0.875rem] font-medium text-ink mb-1">
                  注文に関するメモ
                </label>
                <textarea
                  id="checkout-memo"
                  rows={3}
                  value={orderMemo}
                  onChange={(e) => setOrderMemo(e.target.value)}
                  placeholder="ご要望などがございましたらご記入ください"
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
                <span className="text-[0.9375rem] text-ink">別の住所へ配送しますか？</span>
              </label>
            </div>
            {shipToDifferent && (
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="m-0 mb-4 text-[0.9375rem] font-semibold text-tea-deep">送付先</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="checkout-ship-name" className="block text-[0.875rem] font-medium text-ink mb-1">
                      氏名 <span className="text-red-600">*</span>
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
                      電話番号 <span className="text-red-600">*</span>
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
                      〒（郵便番号） <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="checkout-ship-postal"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9\-]*"
                      placeholder="123-4567"
                      required={shipToDifferent}
                      value={shipPostalCode}
                      onChange={(e) => setShipPostalCode(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-border rounded-lg text-[0.9375rem] focus:border-tea-deep focus:outline-none"
                    />
                    {addressLoading2 && (
                      <p className="m-0 mt-1 text-[0.8125rem] text-ink-muted">住所を検索中...</p>
                    )}
                    {!addressLoading2 && addressError2 && (
                      <p className="m-0 mt-1 text-[0.8125rem] text-red-600">{addressError2}</p>
                    )}
                    {!addressLoading2 && addressResults2.length > 0 && (
                      <div className="mt-2 p-2 border border-border rounded-lg bg-washi">
                        <p className="m-0 mb-2 text-[0.8125rem] text-ink-muted">住所の候補を選択してください</p>
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
        <div>
          <h2 className="m-0 mb-4 text-base font-semibold text-tea-deep">注文内容</h2>
          <ul className="list-none m-0 p-0 flex flex-col gap-3 mb-6">
            {items.map((item) => (
              <li key={item.slug} className="flex flex-wrap items-center gap-3 p-3 rounded-lg border border-border bg-washi">
                <div className="shrink-0 w-14 h-14 rounded overflow-hidden bg-cream">
                  <Image
                    src={item.imagePath ?? FALLBACK_IMAGE}
                    alt={item.title}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="m-0 text-[0.9375rem] font-medium text-ink">{item.title}</p>
                  <p className="m-0 text-[0.8125rem] text-ink-muted">
                    {formatPrice(item.price)}（税込）× {item.quantity} = {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded border border-border bg-white text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-washi"
                    aria-label="数量を減らす"
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
                    aria-label="数量を増やす"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.slug)}
                  className="text-[0.8125rem] text-ink-muted underline hover:text-tea-deep shrink-0"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex justify-between text-[0.9375rem]">
              <span className="text-ink-muted">小計</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[0.9375rem] pb-2 border-b border-border">
              <span className="text-ink-muted">送料</span>
              <span className="font-medium">{shippingDisplay}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-tea-deep pt-2">
              <span>合計（税込）</span>
              <span>{shipping !== null ? formatPrice(total) : "—"}</span>
            </div>
            <p className="m-0 text-[0.8125rem] text-ink-muted text-right">
              （消費税{shipping !== null ? formatPrice(taxAmount) : "—"}を含む）
            </p>
            <div className="pt-6 p-4 rounded-xl bg-[#f0ebe5] border border-border">
              <h3 className="m-0 mb-4 text-[0.9375rem] font-semibold text-tea-deep">
                クレジットカードまたはデビットカード
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="checkout-card-number" className="block text-[0.875rem] font-medium text-ink mb-1">
                    カード番号
                  </label>
                  <input
                    id="checkout-card-number"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="1234 1234 1234 1234"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-border rounded-lg text-[0.9375rem] focus:border-tea-deep focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="checkout-card-expiry" className="block text-[0.875rem] font-medium text-ink mb-1">
                    有効期限
                  </label>
                  <input
                    id="checkout-card-expiry"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="月 / 年"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-border rounded-lg text-[0.9375rem] focus:border-tea-deep focus:outline-none bg-white max-w-[8rem]"
                  />
                </div>
                <div>
                  <label htmlFor="checkout-card-cvc" className="block text-[0.875rem] font-medium text-ink mb-1">
                    セキュリティコード
                  </label>
                  <input
                    id="checkout-card-cvc"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="CVC"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-border rounded-lg text-[0.9375rem] focus:border-tea-deep focus:outline-none bg-white max-w-[8rem]"
                  />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <button
                  type="submit"
                  disabled={shipping === null}
                  className="w-full py-3 px-6 rounded-lg border-2 border-tea bg-tea text-white text-[0.9375rem] font-semibold transition-colors hover:bg-tea-light hover:border-tea-light disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  購入を確定する
                </button>
              </div>
            </div>
            <div className="pt-4">
              <PaymentRequestButtons
                amount={shipping !== null ? total : 0}
                disabled={shipping === null}
              />
            </div>
          </div>
        </div>
      </form>
    </article>
  );
}
