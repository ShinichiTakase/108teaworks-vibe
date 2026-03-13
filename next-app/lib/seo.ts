import type { Locale } from "@/lib/i18n";
import fixed from "@/lib/seoFixedPages.json";

type FixedSeoEntry = {
  title?: Partial<Record<Locale, string>>;
  description?: Partial<Record<Locale, string>>;
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
  "/isecha": ["/ise-cha/", "/ise-cha"],
  "/how-to-brew": ["/how2brew/", "/how2brew"],
};

export function getFixedSeo(
  pathname: string,
  locale: Locale
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
    const title = entry.title?.[locale] ?? entry.title?.ja;
    const description = entry.description?.[locale] ?? entry.description?.ja;
    if (title || description) return { title, description };
  }
  return null;
}

export function buildAlternatesForLocales(pathname: string) {
  const path = normalizePathKey(pathname);
  const base = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ?? "https://108teaworks.com";
  const ja = `${base}${path === "/" ? "/" : withoutTrailingSlash(path)}`;
  const make = (loc: Locale) =>
    loc === "ja"
      ? ja
      : `${base}/${loc}${path === "/" ? "" : withoutTrailingSlash(path)}`;
  return {
    canonical: make("ja"),
    languages: {
      ja: make("ja"),
      en: make("en"),
      ko: make("ko"),
      zh: make("zh"),
    },
  };
}

