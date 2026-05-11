"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const fromEnv = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
/** 未設定時は本番ピクセル。空文字を明示すると読み込まない。 */
const META_PIXEL_ID =
  fromEnv === "" ? "" : fromEnv || "1725497478865844";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function MetaPixel() {
  const pathname = usePathname();
  const initialized = useRef(false);

  const trackPageView = () => {
    if (typeof window.fbq !== "function") return;
    window.fbq("track", "PageView");
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    trackPageView();
  }, [pathname]);

  if (!META_PIXEL_ID) return null;

  return (
    <Script
      id="meta-pixel-fbq"
      strategy="afterInteractive"
      onReady={() => {
        if (typeof window.fbq === "function") {
          window.fbq("init", META_PIXEL_ID);
          trackPageView();
        }
      }}
    >
      {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');`}
    </Script>
  );
}
