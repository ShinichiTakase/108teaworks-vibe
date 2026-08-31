import type { Metadata } from "next";
import fixed from "@/lib/seoFixedPages.json";
import { ORGANIZATION_NAME_JA, SITE_BASE_URL } from "@/lib/siteConstants";

type FixedSeoEntry = {
  title?: string;
  description?: string;
};

type FixedSeoJson = {
  pages?: Record<string, FixedSeoEntry>;
};

const FIXED = fixed as unknown as FixedSeoJson;

function normalizePathKey(pathname: string): string {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return p === "/" ? "/" : p;
}

function withTrailingSlash(pathname: string): string {
  if (pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

function withoutTrailingSlash(pathname: string): string {
  if (pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

const ALIASES: Record<string, string[]> = {
  "/how-to-brew": ["/how2brew/", "/how2brew"],
  /** 旧スラッグ rekushi で getFixedSeo した場合も新キーを参照 */
  "/isecha_no_rekushi": ["/isecha_no_rekishi/", "/isecha_no_rekishi"],
  /** 旧スラッグ isecha で getFixedSeo した場合も新キーを参照 */
  "/isecha": ["/ise-cha/", "/ise-cha"],
  /** /ise-cha/amerika → 英語スラッグ america へ */
  "/ise-cha/amerika": ["/ise-cha/america/", "/ise-cha/america"],
  /** 旧スラッグ inquery → inquiry へ */
  "/inquery": ["/inquiry/", "/inquiry"],
};

export function getFixedSeo(
  pathname: string
): { title?: string; description?: string } | null {
  const pages = FIXED.pages ?? {};
  const key0 = normalizePathKey(pathname);
  const candidates = [
    key0,
    withTrailingSlash(key0),
    withoutTrailingSlash(key0),
    ...(ALIASES[withoutTrailingSlash(key0)] ?? []),
  ].map((k) => normalizePathKey(k));

  for (const key of candidates) {
    const entry = pages[key];
    if (!entry) continue;
    const { title, description } = entry;
    if (title || description) return { title, description };
  }
  return null;
}

export function buildAlternatesForLocales(pathname: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ?? "https://108teaworks.com";
  const path = withTrailingSlash(normalizePathKey(pathname));
  return {
    canonical: `${base}${path}`,
  };
}

/** /ise-cha/america/ 用: OGP・Twitter・robots（本文は Article JSON-LD を別コンポーネントで） */
export function buildIseChaAmericaMetadata(): Metadata {
  const seo = getFixedSeo("/ise-cha/america");
  const title = seo?.title;
  const description = seo?.description;
  const alternates = buildAlternatesForLocales("/ise-cha/america");
  const ogImageUrl = `${SITE_BASE_URL}/images/tea_garden.jpg`;

  return {
    title,
    description,
    alternates,
    robots: { index: true, follow: true },
    openGraph: {
      title: title ?? undefined,
      description: description ?? undefined,
      url: alternates.canonical,
      siteName: ORGANIZATION_NAME_JA,
      locale: "ja_JP",
      type: "article",
      images: [
        {
          url: ogImageUrl,
          width: 1000,
          height: 712,
          alt: "19世紀末から20世紀初頭の日本風茶庭と茶屋",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? undefined,
      description: description ?? undefined,
      images: [ogImageUrl],
    },
  };
}
