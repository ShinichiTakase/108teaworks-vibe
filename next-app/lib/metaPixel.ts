declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function fbTrack(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (params !== undefined) {
    window.fbq("track", event, params);
  } else {
    window.fbq("track", event);
  }
}
