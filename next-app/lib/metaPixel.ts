declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type CAPIData = {
  event_source_url?: string;
  fbc?: string;
  fbp?: string;
};

export function fbTrack(
  event: string,
  params?: Record<string, unknown>,
  capiData?: CAPIData,
): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;

  const eventId = crypto.randomUUID();

  // Pixelへ送信（event_id でdeduplication）
  window.fbq("track", event, params ?? {}, { eventID: eventId });

  // CAPIへ送信（Purchaseのみ、fire-and-forget）
  if (capiData !== undefined) {
    fetch("/api/meta-capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_id: eventId,
        event_source_url: capiData.event_source_url ?? window.location.href,
        fbc: capiData.fbc,
        fbp: capiData.fbp,
        ...(params ?? {}),
      }),
    }).catch(() => {});
  }
}
