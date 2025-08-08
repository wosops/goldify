import type { ReportHandler } from 'web-vitals';

/**
 * Tracks performance of this app
 * @param onPerfEntry function used to report this app's performance
 */
const reportWebVitals = (onPerfEntry?: ReportHandler): void => {
  if (!onPerfEntry) return;
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  });
};

export default reportWebVitals;
