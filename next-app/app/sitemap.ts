import { MetadataRoute } from "next";
import { getProducts } from "@/lib/microcms";
import { getNotices } from "@/lib/microcms";

const LOCALES = ["ja", "en", "ko", "zh"] as const;
type Locale = (typeof LOCALES)[number];

/** サイトのベースURL。本番では .env に NEXT_PUBLIC_SITE_URL を設定してください。 */
const getBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (url) return url.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://108teaworks.com";
};

/** パスに対する各言語のURLを alternates 用に生成 */
function localeUrls(baseUrl: string, path: string): Record<string, string> {
  const pathNorm = path.startsWith("/") ? path : `/${path}`;
  const rec: Record<string, string> = {};
  rec.ja = `${baseUrl}${pathNorm}`;
  for (const lang of ["en", "ko", "zh"] as const) {
    rec[lang] = `${baseUrl}/${lang}${pathNorm}`;
  }
  return rec;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const entries: MetadataRoute.Sitemap = [];

  const staticPaths: { path: string; changeFrequency?: "daily" | "weekly" | "monthly"; priority?: number }[] = [
    { path: "/", changeFrequency: "daily", priority: 1 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/isecha", changeFrequency: "monthly", priority: 0.8 },
    { path: "/how-to-brew", changeFrequency: "monthly", priority: 0.7 },
    { path: "/user-guide", changeFrequency: "monthly", priority: 0.8 },
    { path: "/guide", changeFrequency: "monthly", priority: 0.6 },
    { path: "/notice", changeFrequency: "weekly", priority: 0.8 },
    { path: "/wholesale", changeFrequency: "monthly", priority: 0.7 },
    { path: "/inquery", changeFrequency: "monthly", priority: 0.6 },
    { path: "/cart", changeFrequency: "weekly", priority: 0.5 },
    { path: "/checkout", changeFrequency: "weekly", priority: 0.5 },
    { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.4 },
    { path: "/legal", changeFrequency: "yearly", priority: 0.4 },
    { path: "/kabatadani_no_ocha", changeFrequency: "monthly", priority: 0.7 },
  ];

  for (const { path, changeFrequency, priority } of staticPaths) {
    const pathNorm = path.startsWith("/") ? path : `/${path}`;
    const url = `${baseUrl}${pathNorm}`;
    entries.push({
      url,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: localeUrls(baseUrl, pathNorm),
      },
    });
  }

  try {
    const { contents: products } = await getProducts();
    for (const p of products) {
      const slug = p.SLUG ?? (p as { slug?: string }).slug ?? p.id;
      if (!slug) continue;
      const pathNorm = `/products/${slug}`;
      entries.push({
        url: `${baseUrl}${pathNorm}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: localeUrls(baseUrl, pathNorm),
        },
      });
    }
  } catch (e) {
    console.error("[sitemap] getProducts error", e);
  }

  try {
    const { contents: notices } = await getNotices(200, 0);
    for (const n of notices) {
      const slug = n.slug ?? n.id;
      if (!slug) continue;
      const pathNorm = `/notice/${slug}`;
      entries.push({
        url: `${baseUrl}${pathNorm}`,
        lastModified: n.revisedAt ? new Date(n.revisedAt) : n.publishedAt ? new Date(n.publishedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: {
          languages: localeUrls(baseUrl, pathNorm),
        },
      });
    }
  } catch (e) {
    console.error("[sitemap] getNotices error", e);
  }

  return entries;
}
