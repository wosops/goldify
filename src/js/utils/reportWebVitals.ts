import type { ReportCallback } from 'web-vitals';

type WebVitalsModule = Partial<{
  onCLS: (cb: ReportCallback) => void;
  onFID: (cb: ReportCallback) => void;
  onFCP: (cb: ReportCallback) => void;
  onLCP: (cb: ReportCallback) => void;
  onTTFB: (cb: ReportCallback) => void;
  // Legacy API support
  getCLS: (cb: ReportCallback) => void;
  getFID: (cb: ReportCallback) => void;
  getFCP: (cb: ReportCallback) => void;
  getLCP: (cb: ReportCallback) => void;
  getTTFB: (cb: ReportCallback) => void;
}>;

/**
 * Tracks performance of this app
 * @param onPerfEntry function used to report this app's performance
 */
const reportWebVitals = (onPerfEntry?: ReportCallback): void => {
  if (!onPerfEntry) return;
  import('web-vitals')
    .then((mod: WebVitalsModule) => {
      // Support both legacy get* API and modern on* API across versions
      const onCLS = mod.onCLS || mod.getCLS;
      const onFID = mod.onFID || mod.getFID;
      const onFCP = mod.onFCP || mod.getFCP;
      const onLCP = mod.onLCP || mod.getLCP;
      const onTTFB = mod.onTTFB || mod.getTTFB;

      onCLS?.(onPerfEntry);
      onFID?.(onPerfEntry);
      onFCP?.(onPerfEntry);
      onLCP?.(onPerfEntry);
      onTTFB?.(onPerfEntry);
    })
    .catch(() => {
      // no-op if web-vitals failed to load
    });
};

export default reportWebVitals;
