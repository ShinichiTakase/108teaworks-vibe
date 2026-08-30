import { MetadataRoute } from "next";
import { getProducts } from "@/lib/microcms";
import { getNotices } from "@/lib/microcms";
import { getAllChapterSlugs } from "@/lib/kabatadani";
import { getAllChapterSlugs as getIsechaChapterSlugs } from "@/lib/isecha_rekishi";
import { getAllChapterSlugs as getMieChagyoShiChapterSlugs } from "@/lib/mie_chagyo_shi";
import { loadReviewsForSlug, summarizeReviews } from "@/lib/reviewsStorage";

const LOCALES = ["ja", "en", "ko", "zh"] as const;
type Locale = (typeof LOCALES)[number];

/** サイトのベースURL。本番では .env に NEXT_PUBLIC_SITE_URL を設定してください。 */
const getBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (url) return url.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://108teaworks.com";
};

function withTrailingSlash(pathname: string): string {
  if (pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

function localizedUrl(baseUrl: string, locale: Locale, path: string): string {
  const pathNorm = path.startsWith("/") ? path : `/${path}`;
  const pathWithSlash = withTrailingSlash(pathNorm);
  if (locale === "ja") return `${baseUrl}${pathWithSlash}`;
  return `${baseUrl}/${locale}${pathWithSlash}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const entries: MetadataRoute.Sitemap = [];

  const staticPaths: { path: string; changeFrequency?: "daily" | "weekly" | "monthly"; priority?: number }[] = [
    { path: "/", changeFrequency: "daily", priority: 1 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/ise-cha", changeFrequency: "monthly", priority: 0.8 },
    { path: "/ise-cha/books", changeFrequency: "monthly", priority: 0.75 },
    { path: "/ise-cha/america", changeFrequency: "monthly", priority: 0.75 },
    { path: "/ise-cha/how-to-brew", changeFrequency: "monthly", priority: 0.75 },
    { path: "/ise-cha/maccha", changeFrequency: "monthly", priority: 0.75 },
    { path: "/ise-cha/caffeine", changeFrequency: "monthly", priority: 0.75 },
    { path: "/ise-cha/catechin", changeFrequency: "monthly", priority: 0.75 },
    { path: "/ise-cha/fukamushi", changeFrequency: "monthly", priority: 0.75 },
    { path: "/ise-cha/decaf", changeFrequency: "monthly", priority: 0.75 },
    { path: "/ise-cha/houjicha", changeFrequency: "monthly", priority: 0.75 },
    { path: "/ise-cha/wakocha", changeFrequency: "monthly", priority: 0.75 },
    { path: "/how-to-brew", changeFrequency: "monthly", priority: 0.7 },
    { path: "/user-guide", changeFrequency: "monthly", priority: 0.8 },
    { path: "/guide", changeFrequency: "monthly", priority: 0.6 },
    { path: "/notice", changeFrequency: "weekly", priority: 0.8 },
    { path: "/wholesale", changeFrequency: "monthly", priority: 0.7 },
    { path: "/inquiry", changeFrequency: "monthly", priority: 0.6 },
    { path: "/cart", changeFrequency: "weekly", priority: 0.5 },
    { path: "/checkout", changeFrequency: "weekly", priority: 0.5 },
    { path: "/privacy-policy", changeFrequency: "monthly", priority: 0.4 },
    { path: "/legal", changeFrequency: "monthly", priority: 0.4 },
    { path: "/maccha", changeFrequency: "monthly", priority: 0.75 },
  ];

  for (const { path, changeFrequency, priority } of staticPaths) {
    for (const locale of LOCALES) {
      entries.push({
        url: localizedUrl(baseUrl, locale, path),
        lastModified: new Date(),
        changeFrequency,
        priority,
      });
    }
  }

  // 日本語のみのコンテンツ（多言語ルートは日本語版へリダイレクトするためsitemapには載せない）
  const jaOnlyStaticPaths: { path: string; changeFrequency?: "daily" | "weekly" | "monthly"; priority?: number }[] = [
    { path: "/kabatadani_no_ocha", changeFrequency: "monthly", priority: 0.7 },
    { path: "/isecha_no_rekishi", changeFrequency: "monthly", priority: 0.7 },
    { path: "/mie_chagyo_shi/toc", changeFrequency: "monthly", priority: 0.7 },
    { path: "/ise-cha/decafe-lp", changeFrequency: "monthly", priority: 0.75 },
    { path: "/ise-cha/roasted-powder-lp", changeFrequency: "monthly", priority: 0.75 },
    { path: "/ise-cha/fukamushi-lp", changeFrequency: "monthly", priority: 0.75 },
    { path: "/ise-cha/fukamushi-powder-lp", changeFrequency: "monthly", priority: 0.75 },
    { path: "/ise-cha/wakocha-lp", changeFrequency: "monthly", priority: 0.75 },
  ];

  for (const { path, changeFrequency, priority } of jaOnlyStaticPaths) {
    entries.push({
      url: localizedUrl(baseUrl, "ja", path),
      lastModified: new Date(),
      changeFrequency,
      priority,
    });
  }

  // 川俣谷のお茶・各章ページ（日本語のみ）
  for (const slug of getAllChapterSlugs()) {
    const path = `/kabatadani_no_ocha/${slug}`;
    entries.push({
      url: localizedUrl(baseUrl, "ja", path),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.65,
    });
  }

  // 伊勢茶の歴史・各章ページ（日本語のみ）
  for (const slug of getIsechaChapterSlugs()) {
    const path = `/isecha_no_rekishi/${slug}`;
    entries.push({
      url: localizedUrl(baseUrl, "ja", path),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.65,
    });
  }

  // 三重県茶業史・各章ページ（日本語のみ）
  for (const slug of getMieChagyoShiChapterSlugs()) {
    const path = `/mie_chagyo_shi/${slug}`;
    entries.push({
      url: localizedUrl(baseUrl, "ja", path),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.65,
    });
  }

  try {
    const { contents: products } = await getProducts();
    for (const p of products) {
      const slug = p.SLUG ?? (p as { slug?: string }).slug ?? p.id;
      if (!slug) continue;
      const path = `/ise-cha/${slug}`;
      for (const locale of LOCALES) {
        entries.push({
          url: localizedUrl(baseUrl, locale, path),
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }

      // レビュー一覧ページ（日本語のみ実装）。0件の商品は空ページになるため除外
      try {
        const reviews = await loadReviewsForSlug(slug);
        const { reviewCount } = summarizeReviews(reviews);
        if (reviewCount > 0) {
          entries.push({
            url: localizedUrl(baseUrl, "ja", `${path}/reviews`),
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.5,
          });
        }
      } catch (e) {
        console.error("[sitemap] loadReviewsForSlug error", slug, e);
      }
    }
  } catch (e) {
    console.error("[sitemap] getProducts error", e);
  }

  try {
    const PAGE_LIMIT = 100;
    let offset = 0;
    let totalCount = Infinity;
    while (offset < totalCount) {
      const { contents: notices, totalCount: total } = await getNotices(PAGE_LIMIT, offset);
      totalCount = typeof total === "number" && Number.isFinite(total) ? total : totalCount;

      for (const n of notices) {
      const slug = n.slug ?? n.id;
      if (!slug) continue;
      const path = `/notice/${slug}`;
      const lastModified = n.revisedAt
        ? new Date(n.revisedAt)
        : n.publishedAt
          ? new Date(n.publishedAt)
          : new Date();
      for (const locale of LOCALES) {
        entries.push({
          url: localizedUrl(baseUrl, locale, path),
          lastModified,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
      }

      if (notices.length < PAGE_LIMIT) break;
      offset += PAGE_LIMIT;
    }
  } catch (e) {
    console.error("[sitemap] getNotices error", e);
  }

  return entries;
}
