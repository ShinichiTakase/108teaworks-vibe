import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

/** グリッド表示向け。Retina でも軽量になるよう上限を抑える */
const MAX_EDGE = 320;

function isAllowedInstagramCdnUrl(urlString: string): boolean {
  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    return false;
  }
  if (url.protocol !== "https:") return false;
  const h = url.hostname.toLowerCase();
  if (h.endsWith(".cdninstagram.com")) return true;
  if (h.endsWith(".fbcdn.net")) return true;
  return false;
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("url");
  if (!raw) {
    return new NextResponse("Missing url", { status: 400 });
  }

  let imageUrl: string;
  try {
    imageUrl = decodeURIComponent(raw);
  } catch {
    return new NextResponse("Bad url encoding", { status: 400 });
  }

  if (!isAllowedInstagramCdnUrl(imageUrl)) {
    return new NextResponse("URL not allowed", { status: 400 });
  }

  try {
    const upstream = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; 108teaworks-thumb/1.0)",
      },
      next: { revalidate: 86400 },
    });

    if (!upstream.ok) {
      return new NextResponse("Upstream error", { status: 502 });
    }

    const buf = Buffer.from(await upstream.arrayBuffer());
    const ct = upstream.headers.get("content-type") ?? "";
    if (!ct.startsWith("image/")) {
      return new NextResponse("Not an image", { status: 502 });
    }

    const webp = await sharp(buf)
      .rotate()
      .resize(MAX_EDGE, MAX_EDGE, { fit: "cover", position: "centre" })
      .webp({ quality: 78, effort: 4 })
      .toBuffer();

    return new NextResponse(webp, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
      },
    });
  } catch (e) {
    console.error("[instagram-thumb]", e);
    return new NextResponse("Error", { status: 500 });
  }
}
