"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function langFromPathname(pathname: string): string {
  const m = pathname.match(/^\/(ja|en|ko|zh)(?=\/|$)/);
  const loc = (m ? m[1] : "ja") as "ja" | "en" | "ko" | "zh";
  // Search Console でも扱いやすい代表値に寄せる
  if (loc === "zh") return "zh-CN";
  return loc;
}

export default function HtmlLangSetter() {
  const pathname = usePathname() || "/";

  useEffect(() => {
    const lang = langFromPathname(pathname);
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [pathname]);

  return null;
}

