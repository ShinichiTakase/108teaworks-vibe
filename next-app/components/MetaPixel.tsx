"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const fromEnv = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
/** 未設定時は本番ピクセル。空文字を明示すると読み込まない。 */
const META_PIXEL_ID =
  fromEnv === "" ? "" : fromEnv || "2487381581715717";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Meta（Facebook）ピクセル。
 * 公式ベースコードと、ルート変更時の PageView 送信。
 */
export default function MetaPixel() {
  const pathname = usePathname();
  const skipNextPathEffect = useRef(true);

  useEffect(() => {
    if (!META_PIXEL_ID || typeof window.fbq !== "function") return;
    if (skipNextPathEffect.current) {
      skipNextPathEffect.current = false;
      return;
    }
    window.fbq("track", "PageView");
  }, [pathname]);

  if (!META_PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel-fbq" strategy="afterInteractive">
        {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
`}
      </Script>
      <noscript>
        <img
          height={1}
          width={1}
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
