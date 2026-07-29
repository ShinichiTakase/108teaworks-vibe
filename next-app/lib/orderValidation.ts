// PaymentIntent 作成前チェックと注文確定チェックで共通利用する、購入者情報の必須項目バリデーション。

export type BillingAddressInput = {
  name?: string;
  email?: string;
  phone?: string;
  postalCode?: string;
  prefecture?: string;
  city?: string;
  addressLine?: string;
};

const REQUIRED_BILLING_FIELDS = [
  "name",
  "email",
  "phone",
  "postalCode",
  "prefecture",
  "city",
  "addressLine",
] as const;

// 半角数字・+・ハイフン・空白のみを許可し、文字種の混入（アルファベット等）を弾く。
// +81 付き国際表記（ブラウザのオートフィルで入る場合がある）も許容できる長さにしている。
const PHONE_CHARSET_PATTERN = /^[0-9+\-\s]{8,20}$/;

// 日本の電話番号は市外局番込みで9〜11桁が一般的（+81付き国際表記でも最大15桁：E.164上限）。
export function isValidPhone(phone: string | undefined | null): boolean {
  if (!phone) return false;
  const trimmed = phone.trim();
  if (!PHONE_CHARSET_PATTERN.test(trimmed)) return false;
  const digits = trimmed.replace(/[^\d]/g, "");
  return digits.length >= 9 && digits.length <= 15;
}

export function isBillingAddressComplete(
  addr: BillingAddressInput | null | undefined,
): boolean {
  if (!addr) return false;
  const fieldsPresent = REQUIRED_BILLING_FIELDS.every((key) => Boolean(addr[key]?.trim()));
  if (!fieldsPresent) return false;
  return isValidPhone(addr.phone);
}
