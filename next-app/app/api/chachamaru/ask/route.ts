import { NextRequest, NextResponse } from "next/server";

const TEA_ASK_URL = "https://tea.edgeailab.jp/ask";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetch(TEA_ASK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "chachamaru_api_error", status: res.status },
        { status: res.status }
      );
    }
    const text = await res.text();
    return new NextResponse(text, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (e) {
    console.error("Chachamaru ask proxy error:", e);
    return NextResponse.json(
      { error: "chachamaru_proxy_error" },
      { status: 500 }
    );
  }
}
