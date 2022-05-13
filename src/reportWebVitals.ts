import { ReportHandler } from 'web-vitals';

/**
 * https://create-react-app.dev/docs/measuring-performance/
 * To measure any of the supported metrics
 * @param {ReportHandler} onPerfEntry metric to measure
 */
function reportWebVitals(onPerfEntry?: ReportHandler) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({
      getCLS, getFID, getFCP, getLCP, getTTFB,
    }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
}

export default reportWebVitals;
