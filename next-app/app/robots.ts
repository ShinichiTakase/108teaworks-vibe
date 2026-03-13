import { MetadataRoute } from "next";

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (url) return url.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://108teaworks.com";
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  const disallow = [
    "/cart",
    "/checkout",
    "/checkout/complete",
    "/en/cart",
    "/en/checkout",
    "/en/checkout/complete",
    "/ko/cart",
    "/ko/checkout",
    "/ko/checkout/complete",
    "/zh/cart",
    "/zh/checkout",
    "/zh/checkout/complete",
  ];
  return {
    rules: { userAgent: "*", allow: "/", disallow },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
