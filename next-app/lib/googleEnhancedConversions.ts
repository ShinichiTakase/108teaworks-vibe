// Google 広告 拡張コンバージョン（手動設定）用の user_data 生成・送信ヘルパー。
// ハッシュ化はしない（Google タグ側で自動ハッシュ化されるため、平文のまま渡す）。

export type EnhancedConversionInput = {
  email: string;
  phone?: string;
  name?: string;
  postalCode?: string;
  prefecture?: string;
  city?: string;
  addressLine?: string;
};

export type EnhancedConversionUserData = {
  email: string;
  phone_number?: string;
  address: {
    first_name?: string;
    last_name?: string;
    street?: string;
    city?: string;
    region?: string;
    postal_code?: string;
    country: "JP";
  };
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// 日本国内の電話番号（0始まり）のみ E.164 に変換する。判定できない形式は省略する。
function normalizePhoneToE164Japan(phone: string): string | undefined {
  const cleaned = phone.replace(/[^\d+]/g, "");
  if (!cleaned) return undefined;
  if (cleaned.startsWith("+")) return cleaned;
  if (/^0\d{9,10}$/.test(cleaned)) return `+81${cleaned.slice(1)}`;
  return undefined;
}

// 「姓 名」のスペース区切りを前提にベストエフォートで分割する。区切りがない場合は姓のみ扱いとする。
function splitJapaneseName(fullName: string): { firstName?: string; lastName?: string } {
  const trimmed = fullName.trim();
  if (!trimmed) return {};
  const parts = trimmed.split(/[\s　]+/).filter(Boolean);
  if (parts.length >= 2) {
    return { lastName: parts[0], firstName: parts.slice(1).join(" ") };
  }
  return { lastName: trimmed };
}

// email が取得できない／不正な場合は null を返す。呼び出し側は null なら push しないこと。
export function buildEnhancedConversionUserData(
  input: EnhancedConversionInput,
): EnhancedConversionUserData | null {
  const email = normalizeEmail(input.email ?? "");
  if (!email || !email.includes("@")) return null;

  const { firstName, lastName } = splitJapaneseName(input.name ?? "");
  const postalCode = (input.postalCode ?? "").replace(/\D/g, "");
  const phoneNumber = input.phone ? normalizePhoneToE164Japan(input.phone) : undefined;

  const address: EnhancedConversionUserData["address"] = { country: "JP" };
  if (firstName) address.first_name = firstName;
  if (lastName) address.last_name = lastName;
  if (input.addressLine?.trim()) address.street = input.addressLine.trim();
  if (input.city?.trim()) address.city = input.city.trim();
  if (input.prefecture?.trim()) address.region = input.prefecture.trim();
  if (postalCode) address.postal_code = postalCode;

  const userData: EnhancedConversionUserData = { email, address };
  if (phoneNumber) userData.phone_number = phoneNumber;
  return userData;
}

// gtag('set', 'user_data', ...) を conversion イベントの直前に呼ぶこと（Google の手動設定要件）。
export function setEnhancedConversionUserData(userData: EnhancedConversionUserData): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  try {
    window.gtag("set", "user_data", userData);
  } catch (e) {
    console.error("[debug] gtag set user_data call THREW", e);
  }
}
