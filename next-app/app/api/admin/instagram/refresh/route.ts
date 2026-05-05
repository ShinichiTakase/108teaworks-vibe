import { NextResponse } from "next/server";
import { forceRefresh } from "@/lib/instagram-token";

export async function POST() {
  const result = await forceRefresh();
  return NextResponse.json(result);
}
