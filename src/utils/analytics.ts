declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    trackEvent: (name: string, params?: Record<string, unknown>) => void;
  }
}

export const trackEvent = (name: string, params?: Record<string, unknown>): void => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params ?? {});
  }
};
