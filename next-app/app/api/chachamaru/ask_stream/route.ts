import { NextRequest, NextResponse } from "next/server";

const TEA_ASK_STREAM_URL = "https://tea.edgeailab.jp/ask_stream";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetch(TEA_ASK_STREAM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok || !res.body) {
      return NextResponse.json(
        { error: "chachamaru_stream_error", status: res.status },
        { status: res.status }
      );
    }
    return new NextResponse(res.body, {
      status: 200,
      headers: {
        "Content-Type": res.headers.get("Content-Type") ?? "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (e) {
    console.error("Chachamaru ask_stream proxy error:", e);
    return NextResponse.json(
      { error: "chachamaru_proxy_error" },
      { status: 500 }
    );
  }
}
