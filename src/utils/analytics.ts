export type TrackEventOptions = {
  category?: string;
  label?: string;
  value?: number;
};

export function trackEvent(
  name: string,
  category?: string,
  label?: string,
  value?: number
): void {
  try {
    const gtag = (window as any).gtag;
    const dataLayer = (window as any).dataLayer;

    if (typeof gtag === "function") {
      gtag("event", name, {
        event_category: category,
        event_label: label,
        value,
      });
      return;
    }

    if (Array.isArray(dataLayer)) {
      dataLayer.push({
        event: name,
        event_category: category,
        event_label: label,
        value,
      });
      return;
    }

    // Fallback: log to console so we can trace in dev
    console.info("[analytics]", name, { category, label, value });
  } catch (err) {
    console.warn("trackEvent failed", err);
  }
}
